import fetch from 'node-fetch';
import FormData from 'form-data';
import * as fs from 'fs';
import { configStore } from '../store/config';

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;
  private sessionId: string | null = null;

  constructor() {
    this.baseUrl = configStore.get('serverUrl');
    this.token = configStore.get('token');
    this.sessionId = configStore.get('sessionId');
  }

  async authenticate(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/monitoring/agent/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: configStore.get('email'),
          agentKey: configStore.get('agentKey'),
          deviceId: configStore.getDeviceId(),
        }),
      });

      if (!response.ok) {
        console.error('Authentication failed:', response.status);
        return false;
      }

      const data = await response.json() as { token: string; userId: string };
      this.token = data.token;
      configStore.set('token', data.token);
      return true;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  async createSession(deviceName: string, ipAddress: string): Promise<boolean> {
    try {
      const response = await this.fetch('/api/monitoring/sessions', {
        method: 'POST',
        body: JSON.stringify({
          deviceName,
          deviceId: configStore.getDeviceId(),
          ipAddress,
        }),
      });

      if (!response.ok) {
        console.error('Session creation failed:', response.status);
        return false;
      }

      const data = await response.json() as { id: string };
      this.sessionId = data.id;
      configStore.set('sessionId', data.id);
      return true;
    } catch (error) {
      console.error('Session creation error:', error);
      return false;
    }
  }

  async updateStatus(status: 'ONLINE' | 'OFFLINE' | 'IDLE'): Promise<boolean> {
    if (!this.sessionId) return false;

    try {
      const response = await this.fetch(
        `/api/monitoring/sessions/${this.sessionId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Status update error:', error);
      return false;
    }
  }

  async heartbeat(): Promise<boolean> {
    if (!this.sessionId) return false;

    try {
      const response = await this.fetch(
        `/api/monitoring/sessions/${this.sessionId}/status`,
        {
          method: 'PATCH',
          body: JSON.stringify({ lastActive: new Date().toISOString() }),
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Heartbeat error:', error);
      return false;
    }
  }

  async uploadScreenshot(filepath: string): Promise<boolean> {
    if (!this.sessionId || !this.token) return false;

    try {
      const formData = new FormData();
      formData.append('screenshot', fs.createReadStream(filepath));
      formData.append('sessionId', this.sessionId);

      const response = await fetch(
        `${this.baseUrl}/api/monitoring/screenshots`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          body: formData,
        }
      );

      return response.ok;
    } catch (error) {
      console.error('Screenshot upload error:', error);
      return false;
    }
  }

  async logActivity(activity: {
    activityType: string;
    appName?: string;
    windowTitle?: string;
    duration?: number;
  }): Promise<boolean> {
    if (!this.sessionId) return false;

    try {
      const response = await this.fetch('/api/monitoring/activity', {
        method: 'POST',
        body: JSON.stringify({
          sessionId: this.sessionId,
          ...activity,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Activity log error:', error);
      return false;
    }
  }

  async logActivities(
    activities: Array<{
      activityType: string;
      appName?: string;
      windowTitle?: string;
      duration?: number;
    }>
  ): Promise<boolean> {
    if (!this.sessionId) return false;

    try {
      const response = await this.fetch('/api/monitoring/activity', {
        method: 'POST',
        body: JSON.stringify(
          activities.map((a) => ({
            sessionId: this.sessionId,
            ...a,
          }))
        ),
      });

      return response.ok;
    } catch (error) {
      console.error('Activity batch log error:', error);
      return false;
    }
  }

  private async fetch(
    endpoint: string,
    options: { method?: string; body?: string } = {}
  ) {
    return fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  async checkConsentStatus(): Promise<{
    status: string;
    adminEnabled: boolean;
    employeeConsented: boolean;
    canMonitor: boolean;
    requiresConsent?: boolean;
  }> {
    try {
      const response = await this.fetch('/api/monitoring/consent/employee', {
        method: 'GET',
      });

      if (!response.ok) {
        console.error('Consent status check failed:', response.status);
        return {
          status: 'ERROR',
          adminEnabled: false,
          employeeConsented: false,
          canMonitor: false,
        };
      }

      return await response.json() as {
        status: string;
        adminEnabled: boolean;
        employeeConsented: boolean;
        canMonitor: boolean;
        requiresConsent?: boolean;
      };
    } catch (error) {
      console.error('Consent status check error:', error);
      return {
        status: 'ERROR',
        adminEnabled: false,
        employeeConsented: false,
        canMonitor: false,
      };
    }
  }

  async submitConsent(consentVersion: string = '1.0'): Promise<boolean> {
    try {
      const response = await this.fetch('/api/monitoring/consent/employee', {
        method: 'POST',
        body: JSON.stringify({
          accepted: true,
          deviceId: configStore.getDeviceId(),
          consentVersion,
        }),
      });

      if (!response.ok) {
        console.error('Consent submission failed:', response.status);
        return false;
      }

      const data = await response.json() as { success: boolean };
      return data.success === true;
    } catch (error) {
      console.error('Consent submission error:', error);
      return false;
    }
  }
}

export const apiClient = new ApiClient();
