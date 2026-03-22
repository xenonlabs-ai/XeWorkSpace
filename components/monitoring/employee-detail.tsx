"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "./status-badge";
import { LiveIndicator } from "./live-indicator";
import { ScreenshotGallery } from "./screenshot-gallery";
import { ActivityTimeline } from "./activity-timeline";
import { AppUsageChart } from "./app-usage-chart";
import { monitoringApi } from "@/lib/api";
import {
  ArrowLeft,
  Monitor,
  MapPin,
  Mail,
  Calendar,
  Camera,
  Activity,
  Clock,
  RefreshCw,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface EmployeeMonitoringDetailProps {
  userId: string;
}

export function EmployeeMonitoringDetail({
  userId,
}: EmployeeMonitoringDetailProps) {
  const router = useRouter();
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchUserStats();
  }, [userId]);

  const fetchUserStats = async () => {
    try {
      const stats = await monitoringApi.getUserStats(userId);
      setUserStats(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchUserStats();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-3">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  if (!userStats) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Monitor className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">User Not Found</h3>
        <p className="text-muted-foreground mb-4">
          Could not find monitoring data for this user.
        </p>
        <Button onClick={() => router.push("/monitoring")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Monitoring
        </Button>
      </div>
    );
  }

  const { user, currentSession, stats, topApps, recentScreenshots } = userStats;
  const initials = `${user.firstName[0]}${user.lastName[0]}`;
  const isActive =
    currentSession?.status === "ONLINE" ||
    currentSession?.status === "STREAMING";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/monitoring">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Employee Monitoring</h1>
            <p className="text-muted-foreground">
              Detailed activity and productivity insights
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* User Profile Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
              </Avatar>
              {isActive && (
                <div className="absolute -bottom-1 -right-1">
                  <LiveIndicator size="lg" />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                {currentSession && (
                  <StatusBadge status={currentSession.status} />
                )}
              </div>
              <p className="text-muted-foreground mb-3">
                {user.jobTitle || "Team Member"}
                {user.department && ` · ${user.department}`}
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {user.email && (
                  <a
                    href={`mailto:${user.email}`}
                    className="flex items-center gap-1.5 hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </a>
                )}
                {currentSession && (
                  <>
                    <div className="flex items-center gap-1.5">
                      <Monitor className="h-4 w-4" />
                      {currentSession.deviceName}
                    </div>
                    {currentSession.ipAddress && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" />
                        {currentSession.ipAddress}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      Last active{" "}
                      {formatDistanceToNow(new Date(currentSession.lastActive), {
                        addSuffix: true,
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Screenshots
            </CardTitle>
            <Camera className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalScreenshots}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayScreenshots} today · {stats.weeklyScreenshots} this
              week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Activities
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayActivities} today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Time Today
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.activeMinutesToday}m
            </div>
            <p className="text-xs text-muted-foreground">Tracked activity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top App Today
            </CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              {topApps[0]?.name || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              {topApps[0]?.count || 0} switches
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Details */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ScreenshotGallery
          screenshots={recentScreenshots || []}
          title="Recent Screenshots"
        />
        <AppUsageChart apps={topApps || []} />
      </div>

      {/* Activity Timeline - Full Width */}
      <ActivityTimeline
        activities={userStats.recentActivities || []}
        maxHeight="500px"
      />
    </div>
  );
}
