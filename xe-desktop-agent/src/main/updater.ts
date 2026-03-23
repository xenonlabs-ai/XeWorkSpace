import { autoUpdater, UpdateInfo } from 'electron-updater';
import { app, dialog, Notification } from 'electron';

class AutoUpdater {
  private isChecking: boolean = false;
  private updateAvailable: boolean = false;

  initialize(): void {
    // Configure auto-updater
    autoUpdater.autoDownload = true;
    autoUpdater.autoInstallOnAppQuit = true;

    // Set up event handlers
    autoUpdater.on('checking-for-update', () => {
      console.log('[AutoUpdater] Checking for updates...');
      this.isChecking = true;
    });

    autoUpdater.on('update-available', (info: UpdateInfo) => {
      console.log(`[AutoUpdater] Update available: v${info.version}`);
      this.updateAvailable = true;
      this.isChecking = false;

      // Show notification
      if (Notification.isSupported()) {
        const notification = new Notification({
          title: 'Update Available',
          body: `XeWorkspace Agent v${info.version} is downloading...`,
        });
        notification.show();
      }
    });

    autoUpdater.on('update-not-available', () => {
      console.log('[AutoUpdater] No updates available');
      this.isChecking = false;
    });

    autoUpdater.on('download-progress', (progress) => {
      console.log(`[AutoUpdater] Download progress: ${Math.round(progress.percent)}%`);
    });

    autoUpdater.on('update-downloaded', (info: UpdateInfo) => {
      console.log(`[AutoUpdater] Update downloaded: v${info.version}`);

      // Show notification with option to restart
      if (Notification.isSupported()) {
        const notification = new Notification({
          title: 'Update Ready',
          body: `XeWorkspace Agent v${info.version} will be installed on restart.`,
        });
        notification.on('click', () => {
          this.quitAndInstall();
        });
        notification.show();
      }
    });

    autoUpdater.on('error', (error) => {
      console.error('[AutoUpdater] Error:', error.message);
      this.isChecking = false;
    });

    // Check for updates after a short delay (allow app to fully initialize)
    setTimeout(() => {
      this.checkForUpdates();
    }, 10000); // 10 seconds after startup

    // Check for updates every 4 hours
    setInterval(() => {
      this.checkForUpdates();
    }, 4 * 60 * 60 * 1000);
  }

  async checkForUpdates(): Promise<void> {
    if (this.isChecking) {
      console.log('[AutoUpdater] Already checking for updates');
      return;
    }

    try {
      await autoUpdater.checkForUpdates();
    } catch (error: any) {
      console.error('[AutoUpdater] Failed to check for updates:', error.message);
    }
  }

  quitAndInstall(): void {
    console.log('[AutoUpdater] Quitting and installing update...');
    autoUpdater.quitAndInstall(false, true);
  }

  isUpdateAvailable(): boolean {
    return this.updateAvailable;
  }
}

export const appUpdater = new AutoUpdater();
