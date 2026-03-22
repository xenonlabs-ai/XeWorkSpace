"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveIndicator } from "./live-indicator";
import { StatusBadge } from "./status-badge";
import { Monitor, Maximize2, Signal, SignalZero } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface CCTVFeedProps {
  sessionId: string;
  userId: string;
  userName: string;
  deviceName: string;
  avatar?: string;
  status: "STREAMING" | "ONLINE" | "IDLE" | "OFFLINE";
  frame: string | null;
  lastUpdate: number;
  onClick: () => void;
  isSelected?: boolean;
}

export function CCTVFeed({
  sessionId,
  userId,
  userName,
  deviceName,
  avatar,
  status,
  frame,
  lastUpdate,
  onClick,
  isSelected,
}: CCTVFeedProps) {
  const [isHovered, setIsHovered] = useState(false);
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const isLive = status === "STREAMING" && frame && Date.now() - lastUpdate < 10000;
  const isStale = frame && Date.now() - lastUpdate > 5000;

  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all group",
        "hover:ring-2 hover:ring-primary hover:shadow-xl",
        isSelected && "ring-2 ring-primary",
        !frame && "bg-muted/50"
      )}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Video Feed Area */}
      <div className="aspect-video bg-black relative">
        {frame ? (
          <img
            src={`data:image/png;base64,${frame}`}
            alt={`${userName}'s screen`}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <Monitor className="h-12 w-12 mb-2 opacity-50" />
            <span className="text-sm">No Feed</span>
          </div>
        )}

        {/* Live indicator overlay */}
        {isLive && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
            <LiveIndicator size="sm" className="[&>span]:bg-white" />
            LIVE
          </div>
        )}

        {/* Stale warning */}
        {isStale && !isLive && frame && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-amber-600 text-white px-2 py-1 rounded text-xs font-semibold">
            <SignalZero className="h-3 w-3" />
            DELAYED
          </div>
        )}

        {/* Connection quality indicator */}
        {isLive && (
          <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Signal className="h-3 w-3 text-green-400" />
            <span>{Math.round(1000 / Math.max(1, Date.now() - lastUpdate))} fps</span>
          </div>
        )}

        {/* Expand overlay on hover */}
        {(isHovered || isSelected) && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
              <Maximize2 className="h-6 w-6 text-white" />
            </div>
          </div>
        )}

        {/* Timestamp */}
        {lastUpdate > 0 && (
          <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-xs">
            {formatDistanceToNow(new Date(lastUpdate), { addSuffix: true })}
          </div>
        )}
      </div>

      {/* Info Bar */}
      <div className="p-3 flex items-center gap-3 bg-card">
        <Avatar className="h-8 w-8 border">
          <AvatarImage src={avatar} />
          <AvatarFallback className="text-xs">{initials}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{userName}</p>
          <p className="text-xs text-muted-foreground truncate">{deviceName}</p>
        </div>

        <StatusBadge status={status as any} size="sm" />
      </div>
    </Card>
  );
}

// Loading skeleton for CCTV feed
export function CCTVFeedSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="aspect-video" />
      <div className="p-3 flex items-center gap-3">
        <Skeleton className="h-8 w-8 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </Card>
  );
}
