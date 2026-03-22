import { desktopCapturer, screen } from 'electron';
import { EventEmitter } from 'events';
import { io, Socket } from 'socket.io-client';
import { configStore } from '../store/config';

interface StreamConfig {
  serverUrl: string;
  sessionId: string;
  userId: string;
  deviceName: string;
  userName: string;
  frameRate: number; // frames per second
  quality: number; // JPEG quality 0-100
}

class Streamer extends EventEmitter {
  private socket: Socket | null = null;
  private isStreaming: boolean = false;
  private captureInterval: NodeJS.Timeout | null = null;
  private config: StreamConfig | null = null;
  private frameCount: number = 0;
  private lastFpsUpdate: number = Date.now();
  private currentFps: number = 0;

  async start(config: StreamConfig): Promise<boolean> {
    if (this.isStreaming) {
      console.log('Already streaming');
      return true;
    }

    this.config = config;

    try {
      // Connect to WebSocket server
      this.socket = io(config.serverUrl, {
        path: '/api/socket',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      return new Promise((resolve) => {
        this.socket!.on('connect', () => {
          console.log('Connected to streaming server');

          // Notify server we're starting to stream
          this.socket!.emit('stream:start', {
            sessionId: config.sessionId,
            userId: config.userId,
            deviceName: config.deviceName,
            userName: config.userName,
          });

          this.isStreaming = true;
          this.startCapturing();
          this.emit('started');
          resolve(true);
        });

        this.socket!.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          this.emit('error', error);
          resolve(false);
        });

        this.socket!.on('disconnect', () => {
          console.log('Disconnected from streaming server');
          this.emit('disconnected');
        });

        // Handle viewer count updates
        this.socket!.on('viewers:update', (data: { count: number }) => {
          this.emit('viewers', data.count);
        });
      });
    } catch (error) {
      console.error('Failed to start streaming:', error);
      this.emit('error', error);
      return false;
    }
  }

  stop(): void {
    if (!this.isStreaming) return;

    console.log('Stopping stream...');

    // Stop capture interval
    if (this.captureInterval) {
      clearInterval(this.captureInterval);
      this.captureInterval = null;
    }

    // Notify server
    if (this.socket && this.config) {
      this.socket.emit('stream:stop', { sessionId: this.config.sessionId });
      this.socket.disconnect();
      this.socket = null;
    }

    this.isStreaming = false;
    this.config = null;
    this.emit('stopped');
  }

  private startCapturing(): void {
    if (!this.config) return;

    const intervalMs = Math.round(1000 / this.config.frameRate);

    this.captureInterval = setInterval(async () => {
      await this.captureAndSendFrame();
    }, intervalMs);

    // Capture first frame immediately
    this.captureAndSendFrame();
  }

  private async captureAndSendFrame(): Promise<void> {
    if (!this.isStreaming || !this.socket || !this.config) return;

    try {
      const sources = await desktopCapturer.getSources({
        types: ['screen'],
        thumbnailSize: {
          width: 1280, // Reduced resolution for streaming
          height: 720,
        },
      });

      if (sources.length === 0) return;

      const primarySource = sources[0];
      const image = primarySource.thumbnail;

      if (!image || image.isEmpty()) return;

      // Convert to JPEG for smaller size (quality 60-80 for streaming)
      const jpegBuffer = image.toJPEG(this.config.quality);
      const base64Frame = jpegBuffer.toString('base64');

      // Send frame via WebSocket
      this.socket.emit('stream:frame', {
        sessionId: this.config.sessionId,
        userId: this.config.userId,
        frame: base64Frame,
        deviceName: this.config.deviceName,
        userName: this.config.userName,
      });

      // Update FPS counter
      this.frameCount++;
      const now = Date.now();
      if (now - this.lastFpsUpdate >= 1000) {
        this.currentFps = this.frameCount;
        this.frameCount = 0;
        this.lastFpsUpdate = now;
        this.emit('fps', this.currentFps);
      }
    } catch (error) {
      console.error('Frame capture error:', error);
    }
  }

  isActive(): boolean {
    return this.isStreaming;
  }

  getFps(): number {
    return this.currentFps;
  }

  setFrameRate(fps: number): void {
    if (this.config) {
      this.config.frameRate = Math.max(1, Math.min(30, fps));

      // Restart capture with new frame rate
      if (this.captureInterval) {
        clearInterval(this.captureInterval);
        this.startCapturing();
      }
    }
  }

  setQuality(quality: number): void {
    if (this.config) {
      this.config.quality = Math.max(10, Math.min(100, quality));
    }
  }
}

export const streamer = new Streamer();
