import Store from 'electron-store';
import { v4 as uuidv4 } from 'uuid';

interface ConfigSchema {
  serverUrl: string;
  email: string;
  agentKey: string;
  token: string | null;
  sessionId: string | null;
  deviceId: string;
  captureInterval: number; // in minutes
  idleThreshold: number; // in seconds
  autoStart: boolean;
  minimizeToTray: boolean;
}

const defaults: ConfigSchema = {
  serverUrl: 'http://localhost:3000',
  email: '',
  agentKey: '',
  token: null,
  sessionId: null,
  deviceId: uuidv4(),
  captureInterval: 2, // 2 minutes
  idleThreshold: 300, // 5 minutes
  autoStart: true,
  minimizeToTray: true,
};

class ConfigStore {
  private store: Store<ConfigSchema>;

  constructor() {
    this.store = new Store<ConfigSchema>({
      name: 'xe-agent-config',
      defaults,
      encryptionKey: 'xe-agent-secure-key-2024',
    });
  }

  get<K extends keyof ConfigSchema>(key: K): ConfigSchema[K] {
    return this.store.get(key);
  }

  set<K extends keyof ConfigSchema>(key: K, value: ConfigSchema[K]): void {
    this.store.set(key, value);
  }

  getDeviceId(): string {
    let deviceId = this.store.get('deviceId');
    if (!deviceId) {
      deviceId = uuidv4();
      this.store.set('deviceId', deviceId);
    }
    return deviceId;
  }

  isConfigured(): boolean {
    return !!(this.get('email') && this.get('agentKey') && this.get('serverUrl'));
  }

  getAll(): ConfigSchema {
    return this.store.store;
  }

  clear(): void {
    const deviceId = this.getDeviceId();
    this.store.clear();
    this.store.set('deviceId', deviceId);
  }
}

export const configStore = new ConfigStore();
export type { ConfigSchema };
