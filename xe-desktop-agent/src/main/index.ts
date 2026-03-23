import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as os from 'os';
import fetch from 'node-fetch';
import { configStore } from '../store/config';
import { apiClient } from '../api/client';
import { screenshotCapture } from '../capture/screenshot';
import { windowTracker } from '../capture/window-tracker';
import { idleDetector } from '../capture/idle-detector';
import { streamer } from '../capture/streamer';
import { createTray, updateTrayTooltip, showSettingsWindow, destroyTray } from './tray';

class DesktopAgent {
  private isMonitoring: boolean = false;
  private isStreaming: boolean = false;
  private captureInterval: NodeJS.Timeout | null = null;
  private heartbeatInterval: NodeJS.Timeout | null = null;
  private activityBuffer: Array<{
    activityType: string;
    appName?: string;
    windowTitle?: string;
    duration?: number;
  }> = [];
  private userName: string = '';
  private consentWindow: BrowserWindow | null = null;
  private consentResolve: ((value: boolean) => void) | null = null;

  async initialize(): Promise<void> {
    console.log('Initializing XeWorkspace Desktop Agent...');

    // Setup IPC handlers for consent
    this.setupConsentHandlers();

    // Check if configured
    if (!configStore.isConfigured()) {
      console.log('Agent not configured, showing settings...');
      showSettingsWindow();
      return;
    }

    // Initialize window tracker
    await windowTracker.initialize();

    // Authenticate with server
    const authenticated = await apiClient.authenticate();
    if (!authenticated) {
      console.error('Failed to authenticate with server');
      updateTrayTooltip('Authentication Failed');
      showSettingsWindow();
      return;
    }

    // Check consent status
    const consentStatus = await apiClient.checkConsentStatus();
    console.log('Consent status:', consentStatus);

    if (!consentStatus.adminEnabled) {
      console.log('Monitoring not enabled by admin');
      updateTrayTooltip('Monitoring Not Enabled');
      // Create tray but don't start monitoring
      this.createTrayWithoutMonitoring();
      return;
    }

    if (consentStatus.requiresConsent && !consentStatus.employeeConsented) {
      console.log('Employee consent required, showing consent window...');
      updateTrayTooltip('Consent Required');

      const consented = await this.showConsentWindow();
      if (!consented) {
        console.log('Employee declined consent');
        updateTrayTooltip('Consent Declined');
        this.createTrayWithoutMonitoring();
        return;
      }
    }

    if (!consentStatus.canMonitor && !consentStatus.requiresConsent) {
      console.log('Cannot monitor - consent revoked or not available');
      updateTrayTooltip('Monitoring Unavailable');
      this.createTrayWithoutMonitoring();
      return;
    }

    // Create or update session
    const sessionCreated = await apiClient.createSession(
      os.hostname(),
      this.getLocalIP()
    );

    if (!sessionCreated) {
      console.error('Failed to create session');
      updateTrayTooltip('Session Failed');
      return;
    }

    // Get user name from config email
    this.userName = configStore.get('email').split('@')[0];

    // Start monitoring
    await this.startMonitoring();

    // Create system tray
    createTray({
      onStartMonitoring: () => this.startMonitoring(),
      onStopMonitoring: () => this.stopMonitoring(),
      onStartStreaming: () => this.startStreaming(),
      onStopStreaming: () => this.stopStreaming(),
      onOpenSettings: () => showSettingsWindow(),
      isMonitoring: () => this.isMonitoring,
      isStreaming: () => this.isStreaming,
    });
  }

  private setupConsentHandlers(): void {
    ipcMain.handle('submit-consent', async () => {
      try {
        const success = await apiClient.submitConsent('1.0');
        return { success };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('consent-complete', async (_event, accepted: boolean) => {
      if (this.consentResolve) {
        this.consentResolve(accepted);
        this.consentResolve = null;
      }
      if (this.consentWindow) {
        this.consentWindow.close();
        this.consentWindow = null;
      }
    });

    // Config handlers
    ipcMain.handle('get-config', () => {
      return configStore.getAll();
    });

    ipcMain.handle('save-config', async (_event, config: any) => {
      try {
        if (config.serverUrl) configStore.set('serverUrl', config.serverUrl);
        if (config.email) configStore.set('email', config.email);
        if (config.password) configStore.set('password', config.password);
        if (config.captureInterval) configStore.set('captureInterval', config.captureInterval);
        if (config.idleThreshold) configStore.set('idleThreshold', config.idleThreshold);

        // Re-initialize after config change
        await this.reinitialize();
        return { success: true };
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('test-connection', async (_event, config: any) => {
      try {
        const response = await fetch(`${config.serverUrl}/api/monitoring/agent/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: config.email,
            password: config.password,
            deviceId: configStore.getDeviceId(),
          }),
        });

        if (response.ok) {
          return { success: true };
        } else {
          const data = await response.json() as { error?: string };
          return { success: false, error: data.error || 'Authentication failed' };
        }
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    });

    // Setup with code handler (plug-and-play)
    ipcMain.handle('setup-with-code', async (_event, serverUrl: string, setupCode: string) => {
      try {
        const result = await apiClient.setupWithCode(serverUrl, setupCode);
        if (result.success) {
          // Re-initialize the agent after successful setup
          setTimeout(() => this.reinitialize(), 1000);
        }
        return result;
      } catch (error: any) {
        return { success: false, error: error.message };
      }
    });
  }

  private async showConsentWindow(): Promise<boolean> {
    return new Promise((resolve) => {
      this.consentResolve = resolve;

      this.consentWindow = new BrowserWindow({
        width: 650,
        height: 800,
        resizable: false,
        minimizable: false,
        maximizable: false,
        alwaysOnTop: true,
        center: true,
        title: 'XeWorkspace - Monitoring Consent',
        webPreferences: {
          preload: path.join(__dirname, '../preload/index.js'),
          contextIsolation: true,
          nodeIntegration: false,
        },
      });

      this.consentWindow.loadFile(
        path.join(__dirname, '../renderer/consent.html')
      );

      this.consentWindow.on('closed', () => {
        this.consentWindow = null;
        // If window was closed without explicit consent, treat as declined
        if (this.consentResolve) {
          this.consentResolve(false);
          this.consentResolve = null;
        }
      });
    });
  }

  private createTrayWithoutMonitoring(): void {
    createTray({
      onStartMonitoring: async () => {
        // Re-check consent when trying to start monitoring
        const status = await apiClient.checkConsentStatus();
        if (status.canMonitor) {
          await this.reinitialize();
        } else if (status.requiresConsent) {
          const consented = await this.showConsentWindow();
          if (consented) {
            await this.reinitialize();
          }
        }
      },
      onStopMonitoring: () => this.stopMonitoring(),
      onStartStreaming: () => {}, // Disabled when not monitoring
      onStopStreaming: () => {},
      onOpenSettings: () => showSettingsWindow(),
      isMonitoring: () => false,
      isStreaming: () => false,
    });
  }

  private async reinitialize(): Promise<void> {
    destroyTray();
    await this.initialize();
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    console.log('Starting monitoring...');

    // Update status to online
    await apiClient.updateStatus('ONLINE');
    updateTrayTooltip('Monitoring Active');

    // Start capturing modules
    windowTracker.start();
    idleDetector.start();

    // Setup event listeners
    this.setupEventListeners();

    // Start screenshot capture interval
    const captureMinutes = configStore.get('captureInterval') || 2;
    this.captureInterval = setInterval(
      () => this.captureAndUpload(),
      captureMinutes * 60 * 1000
    );

    // Start heartbeat interval (every 30 seconds)
    this.heartbeatInterval = setInterval(
      () => this.sendHeartbeat(),
      30 * 1000
    );

    // Capture initial screenshot
    await this.captureAndUpload();

    // Log session start
    await apiClient.logActivity({ activityType: 'session_start' });
  }

  async stopMonitoring(): Promise<void> {
    if (!this.isMonitoring) return;

    this.isMonitoring = false;
    console.log('Stopping monitoring...');

    // Stop streaming if active
    if (this.isStreaming) {
      await this.stopStreaming();
    }

    // Clear intervals
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }

    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }

    // Stop capturing modules
    windowTracker.stop();
    idleDetector.stop();

    // Flush activity buffer
    await this.flushActivityBuffer();

    // Update status to offline
    await apiClient.updateStatus('OFFLINE');
    updateTrayTooltip('Monitoring Paused');
  }

  async startStreaming(): Promise<void> {
    if (this.isStreaming) return;

    const sessionId = apiClient.getSessionId();
    if (!sessionId) {
      console.error('No active session for streaming');
      return;
    }

    console.log('Starting live stream...');

    const started = await streamer.start({
      serverUrl: configStore.get('serverUrl'),
      sessionId,
      userId: configStore.get('email'), // Will be resolved by server
      deviceName: os.hostname(),
      userName: this.userName,
      frameRate: 2, // 2 fps for live streaming (balanced for bandwidth)
      quality: 70, // JPEG quality
    });

    if (started) {
      this.isStreaming = true;
      updateTrayTooltip('Streaming Live');
      console.log('Live streaming started');
    } else {
      console.error('Failed to start streaming');
    }

    // Listen for streaming events
    streamer.on('stopped', () => {
      this.isStreaming = false;
      if (this.isMonitoring) {
        updateTrayTooltip('Monitoring Active');
      }
    });

    streamer.on('fps', (fps: number) => {
      if (this.isStreaming) {
        updateTrayTooltip(`Streaming (${fps} fps)`);
      }
    });
  }

  async stopStreaming(): Promise<void> {
    if (!this.isStreaming) return;

    console.log('Stopping live stream...');
    streamer.stop();
    this.isStreaming = false;

    if (this.isMonitoring) {
      updateTrayTooltip('Monitoring Active');
    }
  }

  private setupEventListeners(): void {
    // Window change events
    windowTracker.on('change', (event) => {
      this.activityBuffer.push({
        activityType: 'app_switch',
        appName: event.appName,
        windowTitle: event.windowTitle,
        duration: event.duration,
      });

      // Flush buffer if it gets too large
      if (this.activityBuffer.length >= 10) {
        this.flushActivityBuffer();
      }
    });

    // Idle events
    idleDetector.on('idle-start', async () => {
      // Pause streaming when idle
      if (this.isStreaming) {
        await this.stopStreaming();
      }

      await apiClient.updateStatus('IDLE');
      await apiClient.logActivity({ activityType: 'idle_start' });
      updateTrayTooltip('Idle');
    });

    idleDetector.on('idle-end', async () => {
      await apiClient.updateStatus('ONLINE');
      await apiClient.logActivity({ activityType: 'idle_end' });
      updateTrayTooltip('Monitoring Active');
    });
  }

  private async captureAndUpload(): Promise<void> {
    // Don't capture if idle
    if (idleDetector.isIdle()) {
      console.log('Skipping screenshot capture - user is idle');
      return;
    }

    try {
      const filepath = await screenshotCapture.capture();
      if (filepath) {
        const uploaded = await apiClient.uploadScreenshot(filepath);
        if (uploaded) {
          console.log('Screenshot uploaded successfully');
        }
        screenshotCapture.cleanup(filepath);
      }
    } catch (error) {
      console.error('Screenshot capture/upload error:', error);
    }
  }

  private async sendHeartbeat(): Promise<void> {
    await apiClient.heartbeat();
    await this.flushActivityBuffer();
  }

  private async flushActivityBuffer(): Promise<void> {
    if (this.activityBuffer.length === 0) return;

    const activities = [...this.activityBuffer];
    this.activityBuffer = [];

    try {
      await apiClient.logActivities(activities);
    } catch (error) {
      console.error('Failed to flush activity buffer:', error);
      // Put back in buffer for retry
      this.activityBuffer.unshift(...activities);
    }
  }

  private getLocalIP(): string {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
      const iface = interfaces[name];
      if (!iface) continue;

      for (const info of iface) {
        if (info.family === 'IPv4' && !info.internal) {
          return info.address;
        }
      }
    }
    return '127.0.0.1';
  }

  async shutdown(): Promise<void> {
    console.log('Shutting down agent...');
    await this.stopStreaming();
    await this.stopMonitoring();
    destroyTray();
    screenshotCapture.cleanupAll();
  }
}

// Handle second instance
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  console.log('Another instance is already running, quitting...');
  app.quit();
} else {
  // Application entry point
  const agent = new DesktopAgent();

  app.whenReady().then(() => {
    console.log('App is ready, initializing agent...');
    agent.initialize();
  });

  app.on('window-all-closed', (e: Event) => {
    // Prevent app from quitting when all windows are closed
    console.log('All windows closed, preventing quit...');
    e.preventDefault();
  });

  app.on('before-quit', async () => {
    console.log('App is quitting...');
    await agent.shutdown();
  });

  app.on('second-instance', () => {
    console.log('Second instance detected, showing settings...');
    showSettingsWindow();
  });
}
