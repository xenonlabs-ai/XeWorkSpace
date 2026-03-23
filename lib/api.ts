// API utility functions for frontend

const API_BASE = "/api";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(error.error || "Request failed");
  }

  return res.json();
}

// User API
export const userApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetchApi<{ users: any[]; pagination: any }>(`/users${query}`);
  },
  getById: (id: string) => fetchApi<any>(`/users/${id}`),
  create: (data: any) =>
    fetchApi<any>("/users", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    fetchApi<any>(`/users/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) =>
    fetchApi<any>(`/users/${id}`, { method: "DELETE" }),
};

// Task API
export const taskApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetchApi<{ tasks: any[]; pagination: any }>(`/tasks${query}`);
  },
  getById: (id: string) => fetchApi<any>(`/tasks/${id}`),
  create: (data: any) =>
    fetchApi<any>("/tasks", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    fetchApi<any>(`/tasks/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  delete: (id: string) =>
    fetchApi<any>(`/tasks/${id}`, { method: "DELETE" }),
};

// Attendance API
export const attendanceApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetchApi<{ records: any[]; pagination: any }>(`/attendance${query}`);
  },
  checkIn: (data?: { workType?: string; notes?: string }) =>
    fetchApi<any>("/attendance/check-in", {
      method: "POST",
      body: JSON.stringify(data || {}),
    }),
  checkOut: () =>
    fetchApi<any>("/attendance/check-out", { method: "POST", body: "{}" }),
  create: (data: any) =>
    fetchApi<any>("/attendance", { method: "POST", body: JSON.stringify(data) }),
};

// Performance Review API
export const reviewApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetchApi<{ reviews: any[]; pagination: any }>(
      `/performance/reviews${query}`
    );
  },
  getById: (id: string) => fetchApi<any>(`/performance/reviews/${id}`),
  create: (data: any) =>
    fetchApi<any>("/performance/reviews", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    fetchApi<any>(`/performance/reviews/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi<any>(`/performance/reviews/${id}`, { method: "DELETE" }),
};

// Team API
export const teamApi = {
  getAll: () => fetchApi<any[]>("/teams"),
  create: (data: any) =>
    fetchApi<any>("/teams", { method: "POST", body: JSON.stringify(data) }),
};

// Project API
export const projectApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetchApi<any[]>(`/projects${query}`);
  },
  create: (data: any) =>
    fetchApi<any>("/projects", { method: "POST", body: JSON.stringify(data) }),
};

// Auth API
export const authApi = {
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) =>
    fetchApi<any>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

// Monitoring API
export const monitoringApi = {
  // Sessions
  getSessions: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetchApi<{ sessions: any[]; pagination: any }>(
      `/monitoring/sessions${query}`
    );
  },
  getSession: (id: string) => fetchApi<any>(`/monitoring/sessions/${id}`),
  endSession: (id: string) =>
    fetchApi<any>(`/monitoring/sessions/${id}`, { method: "DELETE" }),

  // Screenshots
  getScreenshots: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetchApi<{ screenshots: any[]; pagination: any }>(
      `/monitoring/screenshots${query}`
    );
  },
  getScreenshot: (id: string) => fetchApi<any>(`/monitoring/screenshots/${id}`),
  deleteScreenshot: (id: string) =>
    fetchApi<any>(`/monitoring/screenshots/${id}`, { method: "DELETE" }),

  // Activity
  getActivity: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetchApi<{ activities: any[]; pagination: any }>(
      `/monitoring/activity${query}`
    );
  },

  // Statistics
  getStats: () => fetchApi<any>("/monitoring/stats"),
  getUserStats: (userId: string) =>
    fetchApi<any>(`/monitoring/stats/user/${userId}`),

  // Consent Management
  getConsentList: (params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : "";
    return fetchApi<{ users: any[]; pagination: any }>(
      `/monitoring/consent${query}`
    );
  },
  getConsent: (userId: string) =>
    fetchApi<any>(`/monitoring/consent/${userId}`),
  enableMonitoring: (userId: string) =>
    fetchApi<any>(`/monitoring/consent/${userId}`, {
      method: "POST",
      body: JSON.stringify({ action: "enable" }),
    }),
  disableMonitoring: (userId: string) =>
    fetchApi<any>(`/monitoring/consent/${userId}`, {
      method: "POST",
      body: JSON.stringify({ action: "disable" }),
    }),
  revokeConsent: (userId: string, reason?: string) =>
    fetchApi<any>(`/monitoring/consent/${userId}`, {
      method: "POST",
      body: JSON.stringify({ action: "revoke", reason }),
    }),

  // Employee self-service consent
  getMyConsent: () => fetchApi<any>("/monitoring/consent/me"),
  submitMyConsent: (accepted: boolean, consentVersion?: string) =>
    fetchApi<any>("/monitoring/consent/me", {
      method: "POST",
      body: JSON.stringify({ accepted, consentVersion: consentVersion || "1.0" }),
    }),
  revokeMyConsent: (reason?: string) =>
    fetchApi<any>("/monitoring/consent/me", {
      method: "POST",
      body: JSON.stringify({ action: "revoke", reason }),
    }),
  regenerateSetupCode: () =>
    fetchApi<any>("/monitoring/consent/me", {
      method: "PATCH",
    }),
};
