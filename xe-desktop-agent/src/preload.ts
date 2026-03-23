import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config: any) => ipcRenderer.invoke('save-config', config),
  testConnection: (config: any) => ipcRenderer.invoke('test-connection', config),
  getStatus: () => ipcRenderer.invoke('get-status'),
  // Setup with code (plug-and-play)
  setupWithCode: (serverUrl: string, setupCode: string) =>
    ipcRenderer.invoke('setup-with-code', serverUrl, setupCode),
  // Consent methods
  submitConsent: () => ipcRenderer.invoke('submit-consent'),
  consentComplete: (accepted: boolean) => ipcRenderer.invoke('consent-complete', accepted),
});
