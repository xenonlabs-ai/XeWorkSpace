import { EventEmitter } from 'events';
import { powerMonitor } from 'electron';
import { configStore } from '../store/config';

class IdleDetector extends EventEmitter {
  private idleThreshold: number;
  private checkInterval: NodeJS.Timeout | null = null;
  private isCurrentlyIdle: boolean = false;
  private isDetecting: boolean = false;

  constructor() {
    super();
    this.idleThreshold = configStore.get('idleThreshold') || 300; // 5 minutes default
  }

  start(): void {
    if (this.isDetecting) return;

    this.isDetecting = true;
    this.checkInterval = setInterval(() => this.checkIdleState(), 5000); // Check every 5 seconds
    console.log('Idle detector started');
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isDetecting = false;
    console.log('Idle detector stopped');
  }

  private checkIdleState(): void {
    const idleTime = powerMonitor.getSystemIdleTime();
    const wasIdle = this.isCurrentlyIdle;
    this.isCurrentlyIdle = idleTime >= this.idleThreshold;

    if (!wasIdle && this.isCurrentlyIdle) {
      console.log('User went idle');
      this.emit('idle-start', { idleTime });
    } else if (wasIdle && !this.isCurrentlyIdle) {
      console.log('User resumed activity');
      this.emit('idle-end', { idleTime });
    }
  }

  isIdle(): boolean {
    return this.isCurrentlyIdle;
  }

  getIdleTime(): number {
    return powerMonitor.getSystemIdleTime();
  }

  setThreshold(seconds: number): void {
    this.idleThreshold = seconds;
  }
}

export const idleDetector = new IdleDetector();
