import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { streamingStore } from "./streaming";

let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: HTTPServer): SocketIOServer {
  if (io) return io;

  io = new SocketIOServer(httpServer, {
    path: "/api/socket",
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    let currentRoom: string | null = null;
    let unsubscribe: (() => void) | null = null;

    // Agent sends frames
    socket.on(
      "stream:frame",
      (data: {
        sessionId: string;
        userId: string;
        frame: string;
        deviceName: string;
        userName: string;
      }) => {
        // Store frame
        streamingStore.updateFrame(data.sessionId, data.frame, {
          userId: data.userId,
          deviceName: data.deviceName,
          userName: data.userName,
        });

        // Broadcast to room
        socket.to(`stream:${data.sessionId}`).emit("frame", {
          sessionId: data.sessionId,
          frame: data.frame,
          timestamp: Date.now(),
        });
      }
    );

    // Agent starts streaming
    socket.on(
      "stream:start",
      (data: { sessionId: string; userId: string; deviceName: string; userName: string }) => {
        socket.join(`agent:${data.sessionId}`);
        console.log(`Agent started streaming: ${data.sessionId}`);
      }
    );

    // Agent stops streaming
    socket.on("stream:stop", (data: { sessionId: string }) => {
      streamingStore.setOffline(data.sessionId);
      socket.leave(`agent:${data.sessionId}`);
      io?.to(`stream:${data.sessionId}`).emit("stream:ended", { sessionId: data.sessionId });
      console.log(`Agent stopped streaming: ${data.sessionId}`);
    });

    // Viewer subscribes to a session
    socket.on("viewer:subscribe", (data: { sessionId: string }) => {
      // Leave previous room
      if (currentRoom) {
        socket.leave(currentRoom);
        unsubscribe?.();
      }

      currentRoom = `stream:${data.sessionId}`;
      socket.join(currentRoom);

      // Send last frame immediately if available
      const lastFrame = streamingStore.getFrame(data.sessionId);
      if (lastFrame) {
        socket.emit("frame", {
          sessionId: data.sessionId,
          frame: lastFrame.frame,
          timestamp: lastFrame.timestamp,
        });
      }

      console.log(`Viewer subscribed to: ${data.sessionId}`);
    });

    // Viewer subscribes to multiple sessions (CCTV grid)
    socket.on("viewer:subscribe-grid", (data: { sessionIds: string[] }) => {
      // Leave all previous rooms
      if (currentRoom) {
        socket.leave(currentRoom);
      }

      // Join all session rooms
      data.sessionIds.forEach((sessionId) => {
        socket.join(`stream:${sessionId}`);
      });

      // Send last frames for all sessions
      const frames = streamingStore.getFrames(data.sessionIds);
      const framesData: Record<string, { frame: string; timestamp: number } | null> = {};

      frames.forEach((frame, sessionId) => {
        framesData[sessionId] = frame
          ? { frame: frame.frame, timestamp: frame.timestamp }
          : null;
      });

      socket.emit("grid:frames", framesData);
      console.log(`Viewer subscribed to grid: ${data.sessionIds.length} sessions`);
    });

    // Viewer unsubscribes
    socket.on("viewer:unsubscribe", () => {
      if (currentRoom) {
        socket.leave(currentRoom);
        unsubscribe?.();
        currentRoom = null;
        unsubscribe = null;
      }
    });

    // Get active sessions
    socket.on("sessions:list", (callback: (sessions: any[]) => void) => {
      const sessions = streamingStore.getActiveSessions();
      callback(sessions);
    });

    socket.on("disconnect", () => {
      if (currentRoom) {
        unsubscribe?.();
      }
      console.log("Client disconnected:", socket.id);
    });
  });

  console.log("Socket.IO server initialized");
  return io;
}

export function getSocketServer(): SocketIOServer | null {
  return io;
}

export function broadcastFrame(
  sessionId: string,
  frame: string,
  timestamp: number
): void {
  if (io) {
    io.to(`stream:${sessionId}`).emit("frame", {
      sessionId,
      frame,
      timestamp,
    });
  }
}
