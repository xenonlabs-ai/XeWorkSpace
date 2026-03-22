import { EventEmitter } from 'events';

// Note: active-win is an ESM module, we'll use dynamic import
let activeWin: any = null;

interface WindowInfo {
  appName: string;
  windowTitle: string;
}

interface WindowChangeEvent {
  previousApp: string | null;
  previousTitle: string | null;
  appName: string;
  windowTitle: string;
  duration: number;
}

class WindowTracker extends EventEmitter {
  private currentApp: string | null = null;
  private currentTitle: string | null = null;
  private appStartTime: Date | null = null;
  private checkInterval: NodeJS.Timeout | null = null;
  private isTracking: boolean = false;

  async initialize(): Promise<void> {
    try {
      // Dynamic import for ESM module
      const module = await import('active-win');
      activeWin = module.default || module.activeWindow;
    } catch (error) {
      console.error('Failed to load active-win:', error);
    }
  }

  async start(): Promise<void> {
    if (this.isTracking || !activeWin) return;

    this.isTracking = true;
    this.checkInterval = setInterval(() => this.checkActiveWindow(), 1000);
    console.log('Window tracker started');
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isTracking = false;
    console.log('Window tracker stopped');
  }

  private async checkActiveWindow(): Promise<void> {
    if (!activeWin) return;

    try {
      const window = await activeWin();

      if (window) {
        const appName = window.owner?.name || 'Unknown';
        const windowTitle = window.title || '';

        if (appName !== this.currentApp || windowTitle !== this.currentTitle) {
          const duration = this.appStartTime
            ? Math.floor((Date.now() - this.appStartTime.getTime()) / 1000)
            : 0;

          if (this.currentApp) {
            const event: WindowChangeEvent = {
              previousApp: this.currentApp,
              previousTitle: this.currentTitle,
              appName,
              windowTitle,
              duration,
            };

            this.emit('change', event);
          }

          this.currentApp = appName;
          this.currentTitle = windowTitle;
          this.appStartTime = new Date();
        }
      }
    } catch (error) {
      // Silently ignore errors (window might be closed, etc.)
    }
  }

  getCurrentWindow(): WindowInfo | null {
    if (!this.currentApp) return null;
    return {
      appName: this.currentApp,
      windowTitle: this.currentTitle || '',
    };
  }
}

export const windowTracker = new WindowTracker();
