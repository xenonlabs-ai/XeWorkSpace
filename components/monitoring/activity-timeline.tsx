"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Activity,
  AppWindow,
  Coffee,
  Play,
  Monitor,
  MousePointer,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface ActivityLog {
  id: string;
  activityType: string;
  appName?: string;
  windowTitle?: string;
  duration?: number;
  createdAt: string;
}

interface ActivityTimelineProps {
  activities: ActivityLog[];
  isLoading?: boolean;
  maxHeight?: string;
}

export function ActivityTimeline({
  activities,
  isLoading,
  maxHeight = "400px",
}: ActivityTimelineProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "app_switch":
        return <AppWindow className="h-4 w-4" />;
      case "idle_start":
        return <Coffee className="h-4 w-4" />;
      case "idle_end":
        return <Play className="h-4 w-4" />;
      case "session_start":
        return <Monitor className="h-4 w-4" />;
      default:
        return <MousePointer className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "app_switch":
        return "bg-blue-500";
      case "idle_start":
        return "bg-amber-500";
      case "idle_end":
        return "bg-green-500";
      case "session_start":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case "app_switch":
        return "Switched App";
      case "idle_start":
        return "Went Idle";
      case "idle_end":
        return "Resumed";
      case "session_start":
        return "Started Session";
      default:
        return type.replace(/_/g, " ");
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activity Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <Activity className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No activity recorded yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Timeline
          <span className="text-sm font-normal text-muted-foreground ml-2">
            ({activities.length} events)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea style={{ height: maxHeight }}>
          <div className="p-6 pt-0">
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

              <div className="space-y-6">
                {activities.map((activity, index) => (
                  <div key={activity.id} className="relative flex gap-4">
                    {/* Timeline dot */}
                    <div
                      className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full ${getActivityColor(
                        activity.activityType
                      )} text-white`}
                    >
                      {getActivityIcon(activity.activityType)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium">
                          {getActivityLabel(activity.activityType)}
                        </span>
                        {activity.duration && (
                          <Badge variant="outline" className="text-xs">
                            {formatDuration(activity.duration)}
                          </Badge>
                        )}
                      </div>

                      {activity.appName && (
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">{activity.appName}</span>
                          {activity.windowTitle && (
                            <span className="text-muted-foreground/70">
                              {" - "}
                              {activity.windowTitle.length > 50
                                ? `${activity.windowTitle.substring(0, 50)}...`
                                : activity.windowTitle}
                            </span>
                          )}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(activity.createdAt), "h:mm:ss a")}
                        <span className="mx-1">·</span>
                        {formatDistanceToNow(new Date(activity.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
