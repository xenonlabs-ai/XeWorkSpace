"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "./status-badge";
import { LiveIndicator } from "./live-indicator";
import { Monitor, Clock, Camera, Activity } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface EmployeeCardProps {
  session: {
    id: string;
    status: "ONLINE" | "OFFLINE" | "IDLE" | "STREAMING";
    deviceName: string;
    lastActive: string;
    ipAddress?: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string;
      department?: string;
      jobTitle?: string;
      email?: string;
    };
    _count: {
      screenshots: number;
      activityLogs: number;
    };
  };
  onClick: () => void;
}

export function EmployeeCard({ session, onClick }: EmployeeCardProps) {
  const { user, status, deviceName, lastActive, _count } = session;
  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const isActive = status === "ONLINE" || status === "STREAMING";

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all hover:border-primary/50 relative group"
      onClick={onClick}
    >
      {isActive && (
        <div className="absolute top-3 right-3">
          <LiveIndicator size="sm" />
        </div>
      )}

      <CardHeader className="flex flex-row items-center gap-4 pb-3">
        <Avatar className="h-12 w-12 border-2 border-background shadow">
          <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {user.jobTitle || user.department || "Team Member"}
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center justify-between">
          <StatusBadge status={status} />
          <span className="text-xs text-muted-foreground">
            {user.department}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Monitor className="h-4 w-4 flex-shrink-0" />
          <span className="truncate">{deviceName}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 flex-shrink-0" />
          <span>
            {status === "OFFLINE"
              ? "Last seen "
              : "Active "}
            {formatDistanceToNow(new Date(lastActive), { addSuffix: true })}
          </span>
        </div>

        <div className="flex gap-4 pt-3 border-t">
          <div className="flex items-center gap-1.5">
            <Camera className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{_count.screenshots}</span>
            <span className="text-xs text-muted-foreground">shots</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{_count.activityLogs}</span>
            <span className="text-xs text-muted-foreground">activities</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
