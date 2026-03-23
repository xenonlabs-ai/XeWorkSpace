import { Tray, Menu, nativeImage, app, BrowserWindow } from 'electron';
import * as path from 'path';

let tray: Tray | null = null;
let settingsWindow: BrowserWindow | null = null;

interface TrayCallbacks {
  onStartMonitoring: () => void;
  onStopMonitoring: () => void;
  onStartStreaming: () => void;
  onStopStreaming: () => void;
  onOpenSettings: () => void;
  isMonitoring: () => boolean;
  isStreaming: () => boolean;
}

export function createTray(callbacks: TrayCallbacks): Tray {
  // Create a simple icon (in production, use proper icon files)
  const iconPath = path.join(__dirname, '../../assets/icons/icon.png');

  // Create a simple 16x16 icon if icon file doesn't exist
  let icon: nativeImage;
  try {
    icon = nativeImage.createFromPath(iconPath);
    if (icon.isEmpty()) {
      // Create a simple colored icon
      icon = nativeImage.createFromBuffer(
        Buffer.from(
          'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAABSSURBVDiN7dMxDoAgDAXQn3h/bqLr3p1wJSwOLiYuLoY0MoGP/RIGXpI2bQCtgK3AwQ9YBfaWJEnSFxJJ+olN+gDPkPTuCSEBuALXO0n+6gH4AmVJDIgdqTKJAAAAAElFTkSuQmCC',
          'base64'
        )
      );
    }
  } catch {
    // Create a fallback icon
    icon = nativeImage.createEmpty();
  }

  tray = new Tray(icon);
  tray.setToolTip('XeWorkspace Desktop Agent');

  const updateMenu = () => {
    const isMonitoring = callbacks.isMonitoring();
    const isStreaming = callbacks.isStreaming();

    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'XeWorkspace Agent',
        enabled: false,
      },
      { type: 'separator' },
      {
        label: isStreaming
          ? '🔴 Live Streaming'
          : isMonitoring
          ? '● Monitoring Active'
          : '○ Monitoring Paused',
        enabled: false,
      },
      { type: 'separator' },
      {
        label: isMonitoring ? 'Stop Monitoring' : 'Start Monitoring',
        click: () => {
          if (isMonitoring) {
            callbacks.onStopMonitoring();
          } else {
            callbacks.onStartMonitoring();
          }
          setTimeout(updateMenu, 100);
        },
      },
      {
        label: isStreaming ? 'Stop Live Stream' : 'Start Live Stream',
        enabled: isMonitoring, // Only enable if monitoring is active
        click: () => {
          if (isStreaming) {
            callbacks.onStopStreaming();
          } else {
            callbacks.onStartStreaming();
          }
          setTimeout(updateMenu, 100);
        },
      },
      { type: 'separator' },
      {
        label: 'Settings',
        click: callbacks.onOpenSettings,
      },
      { type: 'separator' },
      {
        label: 'Quit',
        click: () => {
          callbacks.onStopStreaming();
          callbacks.onStopMonitoring();
          app.quit();
        },
      },
    ]);

    tray?.setContextMenu(contextMenu);
  };

  updateMenu();

  // Update menu when clicked
  tray.on('click', () => {
    updateMenu();
  });

  return tray;
}

export function updateTrayTooltip(status: string): void {
  if (tray) {
    tray.setToolTip(`XeWorkspace Agent - ${status}`);
  }
}

export function showSettingsWindow(): void {
  if (settingsWindow) {
    settingsWindow.focus();
    return;
  }

  const preloadPath = path.join(__dirname, '../preload/index.js');
  const htmlPath = path.join(__dirname, '../renderer/index.html');

  console.log('Creating settings window...');
  console.log('Preload path:', preloadPath);
  console.log('HTML path:', htmlPath);

  try {
    settingsWindow = new BrowserWindow({
      width: 450,
      height: 650,
      title: 'XeWorkspace Agent Settings',
      resizable: false,
      show: false, // Don't show until ready
      webPreferences: {
        preload: preloadPath,
        nodeIntegration: false,
        contextIsolation: true,
      },
    });

    settingsWindow.loadFile(htmlPath);

    settingsWindow.once('ready-to-show', () => {
      console.log('Settings window ready to show');
      settingsWindow?.show();
    });

    settingsWindow.on('closed', () => {
      console.log('Settings window closed');
      settingsWindow = null;
    });

    settingsWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
      console.error('Failed to load settings window:', errorCode, errorDescription);
    });

    settingsWindow.webContents.on('did-finish-load', () => {
      console.log('Settings window finished loading');
    });

    settingsWindow.webContents.on('crashed', () => {
      console.error('Settings window renderer crashed');
    });

    settingsWindow.on('unresponsive', () => {
      console.error('Settings window became unresponsive');
    });

    // Open DevTools in development
    if (process.env.NODE_ENV === 'development') {
      settingsWindow.webContents.openDevTools();
    }
  } catch (error) {
    console.error('Error creating settings window:', error);
  }
}

export function destroyTray(): void {
  if (tray) {
    tray.destroy();
    tray = null;
  }
}
