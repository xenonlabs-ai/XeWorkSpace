"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "./status-badge";
import { ScreenshotGallery } from "./screenshot-gallery";
import { ActivityTimeline } from "./activity-timeline";
import { AppUsageChart } from "./app-usage-chart";
import { monitoringApi } from "@/lib/api";
import { ExternalLink, Mail, Monitor, MapPin } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface Session {
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
}

interface EmployeeDetailDialogProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeDetailDialog({
  session,
  isOpen,
  onClose,
}: EmployeeDetailDialogProps) {
  const [sessionDetail, setSessionDetail] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && session) {
      fetchDetails();
    }
  }, [isOpen, session?.id]);

  const fetchDetails = async () => {
    if (!session) return;

    setIsLoading(true);
    try {
      const [detail, stats] = await Promise.all([
        monitoringApi.getSession(session.id),
        monitoringApi.getUserStats(session.user.id),
      ]);
      setSessionDetail(detail);
      setUserStats(stats);
    } catch (error) {
      console.error("Error fetching session details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  const { user } = session;
  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 border-2">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">
                  {user.firstName} {user.lastName}
                </DialogTitle>
                <p className="text-muted-foreground">
                  {user.jobTitle || "Team Member"}
                  {user.department && ` · ${user.department}`}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={session.status} />
                  {user.email && (
                    <a
                      href={`mailto:${user.email}`}
                      className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                    >
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </a>
                  )}
                </div>
              </div>
            </div>
            <Link href={`/monitoring/${user.id}`}>
              <Button variant="outline" size="sm" className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Full Details
              </Button>
            </Link>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 py-4 border-y">
          <div className="text-center">
            <p className="text-2xl font-bold">
              {userStats?.stats?.todayScreenshots ?? session._count.screenshots}
            </p>
            <p className="text-sm text-muted-foreground">Screenshots Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {userStats?.stats?.todayActivities ?? session._count.activityLogs}
            </p>
            <p className="text-sm text-muted-foreground">Activities Today</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">
              {userStats?.stats?.activeMinutesToday ?? 0}m
            </p>
            <p className="text-sm text-muted-foreground">Active Time</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground py-2">
          <div className="flex items-center gap-1.5">
            <Monitor className="h-4 w-4" />
            <span>{session.deviceName}</span>
          </div>
          {session.ipAddress && (
            <div className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4" />
              <span>{session.ipAddress}</span>
            </div>
          )}
          <div className="ml-auto">
            Last active:{" "}
            {format(new Date(session.lastActive), "MMM d, h:mm a")}
          </div>
        </div>

        <Tabs defaultValue="screenshots" className="mt-4">
          <TabsList>
            <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="apps">App Usage</TabsTrigger>
          </TabsList>

          <TabsContent value="screenshots" className="mt-4">
            <ScreenshotGallery
              screenshots={sessionDetail?.screenshots || userStats?.recentScreenshots || []}
              isLoading={isLoading}
              title="Recent Screenshots"
            />
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            <ActivityTimeline
              activities={sessionDetail?.activityLogs || []}
              isLoading={isLoading}
              maxHeight="350px"
            />
          </TabsContent>

          <TabsContent value="apps" className="mt-4">
            <AppUsageChart
              apps={userStats?.topApps || []}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
