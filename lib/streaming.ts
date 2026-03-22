// In-memory store for live streaming frames
// In production, use Redis for multi-instance support

interface StreamFrame {
  sessionId: string;
  userId: string;
  frame: string; // Base64 encoded image
  timestamp: number;
  deviceName: string;
  userName: string;
}

interface StreamSession {
  sessionId: string;
  userId: string;
  deviceName: string;
  userName: string;
  status: "STREAMING" | "PAUSED" | "OFFLINE";
  lastFrame: string | null;
  lastUpdate: number;
  fps: number;
  viewers: number;
}

class StreamingStore {
  private frames: Map<string, StreamFrame> = new Map();
  private sessions: Map<string, StreamSession> = new Map();
  private frameListeners: Map<string, Set<(frame: StreamFrame) => void>> = new Map();
  private readonly MAX_FRAME_AGE = 10000; // 10 seconds

  // Update a session's frame
  updateFrame(
    sessionId: string,
    frame: string,
    metadata: {
      userId: string;
      deviceName: string;
      userName: string;
    }
  ): void {
    const now = Date.now();

    const streamFrame: StreamFrame = {
      sessionId,
      userId: metadata.userId,
      frame,
      timestamp: now,
      deviceName: metadata.deviceName,
      userName: metadata.userName,
    };

    this.frames.set(sessionId, streamFrame);

    // Update or create session
    const existingSession = this.sessions.get(sessionId);
    this.sessions.set(sessionId, {
      sessionId,
      userId: metadata.userId,
      deviceName: metadata.deviceName,
      userName: metadata.userName,
      status: "STREAMING",
      lastFrame: frame,
      lastUpdate: now,
      fps: existingSession ? this.calculateFps(existingSession.lastUpdate, now) : 1,
      viewers: existingSession?.viewers || 0,
    });

    // Notify listeners
    const listeners = this.frameListeners.get(sessionId);
    if (listeners) {
      listeners.forEach((callback) => callback(streamFrame));
    }
  }

  // Get latest frame for a session
  getFrame(sessionId: string): StreamFrame | null {
    const frame = this.frames.get(sessionId);
    if (!frame) return null;

    // Check if frame is too old
    if (Date.now() - frame.timestamp > this.MAX_FRAME_AGE) {
      return null;
    }

    return frame;
  }

  // Get all active streaming sessions
  getActiveSessions(): StreamSession[] {
    const now = Date.now();
    const activeSessions: StreamSession[] = [];

    this.sessions.forEach((session, sessionId) => {
      // Mark as offline if no update in 10 seconds
      if (now - session.lastUpdate > this.MAX_FRAME_AGE) {
        session.status = "OFFLINE";
        session.lastFrame = null;
      }
      activeSessions.push(session);
    });

    // Sort by status (streaming first) then by name
    return activeSessions.sort((a, b) => {
      if (a.status === "STREAMING" && b.status !== "STREAMING") return -1;
      if (b.status === "STREAMING" && a.status !== "STREAMING") return 1;
      return a.userName.localeCompare(b.userName);
    });
  }

  // Get frames for multiple sessions (for CCTV grid)
  getFrames(sessionIds: string[]): Map<string, StreamFrame | null> {
    const result = new Map<string, StreamFrame | null>();
    sessionIds.forEach((id) => {
      result.set(id, this.getFrame(id));
    });
    return result;
  }

  // Subscribe to frame updates for a session
  subscribe(sessionId: string, callback: (frame: StreamFrame) => void): () => void {
    if (!this.frameListeners.has(sessionId)) {
      this.frameListeners.set(sessionId, new Set());
    }
    this.frameListeners.get(sessionId)!.add(callback);

    // Increment viewer count
    const session = this.sessions.get(sessionId);
    if (session) {
      session.viewers++;
    }

    // Return unsubscribe function
    return () => {
      this.frameListeners.get(sessionId)?.delete(callback);
      const session = this.sessions.get(sessionId);
      if (session && session.viewers > 0) {
        session.viewers--;
      }
    };
  }

  // Mark session as offline
  setOffline(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.status = "OFFLINE";
      session.lastFrame = null;
    }
    this.frames.delete(sessionId);
  }

  // Clean up old frames and sessions
  cleanup(): void {
    const now = Date.now();
    const staleThreshold = 60000; // 1 minute

    this.sessions.forEach((session, sessionId) => {
      if (now - session.lastUpdate > staleThreshold) {
        this.sessions.delete(sessionId);
        this.frames.delete(sessionId);
        this.frameListeners.delete(sessionId);
      }
    });
  }

  private calculateFps(lastUpdate: number, now: number): number {
    const diff = now - lastUpdate;
    if (diff <= 0) return 1;
    return Math.min(30, Math.round(1000 / diff));
  }
}

// Singleton instance
export const streamingStore = new StreamingStore();

// Cleanup interval
if (typeof setInterval !== "undefined") {
  setInterval(() => streamingStore.cleanup(), 30000);
}
