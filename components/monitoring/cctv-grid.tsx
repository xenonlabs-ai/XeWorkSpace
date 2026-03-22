"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CCTVFeed, CCTVFeedSkeleton } from "./cctv-feed";
import { LiveViewer } from "./live-viewer";
import {
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Grid3X3,
  LayoutGrid,
  RefreshCw,
  Tv,
} from "lucide-react";
import { io, Socket } from "socket.io-client";

interface StreamSession {
  sessionId: string;
  userId: string;
  deviceName: string;
  userName: string;
  status: "STREAMING" | "ONLINE" | "IDLE" | "OFFLINE";
  lastFrame: string | null;
  lastUpdate: number;
  fps: number;
  viewers: number;
  avatar?: string;
}

interface CCTVGridProps {
  sessionsPerPage?: number;
}

export function CCTVGrid({ sessionsPerPage = 6 }: CCTVGridProps) {
  const [sessions, setSessions] = useState<StreamSession[]>([]);
  const [frames, setFrames] = useState<Record<string, { frame: string; timestamp: number }>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [gridSize, setGridSize] = useState<4 | 6 | 9>(6);
  const [isLoading, setIsLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedSession, setSelectedSession] = useState<StreamSession | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Calculate pagination
  const totalPages = Math.ceil(sessions.length / gridSize);
  const startIndex = (currentPage - 1) * gridSize;
  const visibleSessions = sessions.slice(startIndex, startIndex + gridSize);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io({
      path: "/api/socket",
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("Connected to streaming server");
      // Request session list
      newSocket.emit("sessions:list", (sessionList: StreamSession[]) => {
        setSessions(sessionList);
        setIsLoading(false);
      });
    });

    newSocket.on("frame", (data: { sessionId: string; frame: string; timestamp: number }) => {
      setFrames((prev) => ({
        ...prev,
        [data.sessionId]: { frame: data.frame, timestamp: data.timestamp },
      }));

      // Update session status
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === data.sessionId
            ? { ...s, status: "STREAMING", lastUpdate: data.timestamp, lastFrame: data.frame }
            : s
        )
      );
    });

    newSocket.on("grid:frames", (framesData: Record<string, { frame: string; timestamp: number } | null>) => {
      const newFrames: Record<string, { frame: string; timestamp: number }> = {};
      Object.entries(framesData).forEach(([sessionId, data]) => {
        if (data) {
          newFrames[sessionId] = data;
        }
      });
      setFrames((prev) => ({ ...prev, ...newFrames }));
    });

    newSocket.on("stream:ended", (data: { sessionId: string }) => {
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === data.sessionId ? { ...s, status: "OFFLINE", lastFrame: null } : s
        )
      );
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from streaming server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Subscribe to visible sessions
  useEffect(() => {
    if (!socket || visibleSessions.length === 0) return;

    const sessionIds = visibleSessions.map((s) => s.sessionId);
    socket.emit("viewer:subscribe-grid", { sessionIds });
  }, [socket, visibleSessions.map((s) => s.sessionId).join(",")]);

  // Poll for session updates
  useEffect(() => {
    if (!autoRefresh || !socket) return;

    const interval = setInterval(() => {
      socket.emit("sessions:list", (sessionList: StreamSession[]) => {
        setSessions(sessionList);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [socket, autoRefresh]);

  // Also use HTTP fallback for frames
  useEffect(() => {
    if (!autoRefresh) return;

    const fetchFrames = async () => {
      try {
        const response = await fetch("/api/monitoring/stream");
        if (response.ok) {
          const data = await response.json();
          if (data.sessions) {
            setSessions(data.sessions);
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error("Error fetching stream sessions:", error);
      }
    };

    fetchFrames();
    const interval = setInterval(fetchFrames, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = useCallback(() => {
    if (socket) {
      socket.emit("sessions:list", (sessionList: StreamSession[]) => {
        setSessions(sessionList);
      });
    }
  }, [socket]);

  const handleSelectSession = (session: StreamSession) => {
    setSelectedSession(session);
  };

  const getGridCols = () => {
    switch (gridSize) {
      case 4:
        return "md:grid-cols-2";
      case 6:
        return "md:grid-cols-2 lg:grid-cols-3";
      case 9:
        return "md:grid-cols-3";
      default:
        return "md:grid-cols-2 lg:grid-cols-3";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tv className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Live CCTV Feed</h2>
          </div>
        </div>
        <div className={`grid gap-4 grid-cols-1 ${getGridCols()}`}>
          {Array.from({ length: gridSize }).map((_, i) => (
            <CCTVFeedSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Tv className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Live Feeds</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No employees are currently streaming. Live feeds will appear here
            when employees enable streaming mode in their desktop agent.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Tv className="h-5 w-5 text-red-500" />
            <h2 className="text-lg font-semibold">Live CCTV Feed</h2>
            <span className="text-sm text-muted-foreground">
              ({sessions.filter((s) => s.status === "STREAMING").length} streaming)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Grid size selector */}
            <div className="flex items-center border rounded-lg p-1">
              <Button
                variant={gridSize === 4 ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridSize(4)}
              >
                <Grid2X2 className="h-4 w-4" />
              </Button>
              <Button
                variant={gridSize === 6 ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridSize(6)}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={gridSize === 9 ? "secondary" : "ghost"}
                size="icon"
                className="h-8 w-8"
                onClick={() => setGridSize(9)}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
            </div>

            <Button variant="outline" size="icon" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* CCTV Grid */}
        <div className={`grid gap-4 grid-cols-1 ${getGridCols()}`}>
          {visibleSessions.map((session) => (
            <CCTVFeed
              key={session.sessionId}
              sessionId={session.sessionId}
              userId={session.userId}
              userName={session.userName}
              deviceName={session.deviceName}
              avatar={session.avatar}
              status={session.status}
              frame={frames[session.sessionId]?.frame || session.lastFrame}
              lastUpdate={frames[session.sessionId]?.timestamp || session.lastUpdate}
              onClick={() => handleSelectSession(session)}
              isSelected={selectedSession?.sessionId === session.sessionId}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 pt-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Full screen viewer */}
      <LiveViewer
        session={selectedSession}
        isOpen={!!selectedSession}
        onClose={() => setSelectedSession(null)}
      />
    </>
  );
}
