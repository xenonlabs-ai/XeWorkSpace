"use client";

import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonitoringHeader } from "./header";
import { MonitoringStatsCards } from "./stats-cards";
import { EmployeeGrid } from "./employee-grid";
import { EmployeeDetailDialog } from "./employee-detail-dialog";
import { CCTVGrid } from "./cctv-grid";
import { ConsentManagement } from "./consent-management";
import { DailyReport } from "./daily-report";
import { monitoringApi } from "@/lib/api";
import { Tv, Users, Settings, BarChart3 } from "lucide-react";

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

interface Stats {
  overview: {
    totalUsers: number;
    onlineCount: number;
    idleCount: number;
    offlineCount: number;
  };
  today: {
    screenshots: number;
    activities: number;
    totalIdleMinutes: number;
  };
  weekly: {
    screenshots: number;
    activities: number;
  };
  topApps: Array<{ name: string; count: number; totalDuration: number }>;
  recentSessions: Session[];
}

export function MonitoringContent() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>();
  const [pollingInterval, setPollingInterval] = useState(30000); // 30 seconds default

  const fetchData = useCallback(async () => {
    try {
      const [sessionsData, statsData] = await Promise.all([
        monitoringApi.getSessions(),
        monitoringApi.getStats(),
      ]);
      setSessions(sessionsData.sessions);
      setStats(statsData);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching monitoring data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and polling
  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, pollingInterval);
    return () => clearInterval(interval);
  }, [fetchData, pollingInterval]);

  const handleRefresh = () => {
    setIsLoading(true);
    fetchData();
  };

  return (
    <>
      <MonitoringHeader
        onRefresh={handleRefresh}
        pollingInterval={pollingInterval}
        onPollingChange={setPollingInterval}
        lastUpdated={lastUpdated}
        isLoading={isLoading}
      />

      <MonitoringStatsCards stats={stats} isLoading={isLoading} />

      <Tabs defaultValue="live" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="live" className="gap-2">
            <Tv className="h-4 w-4" />
            Live Feed
          </TabsTrigger>
          <TabsTrigger value="sessions" className="gap-2">
            <Users className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Daily Reports
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="live">
          <CCTVGrid sessionsPerPage={6} />
        </TabsContent>

        <TabsContent value="sessions">
          <EmployeeGrid
            sessions={sessions}
            isLoading={isLoading}
            onSelectEmployee={setSelectedEmployee}
          />
        </TabsContent>

        <TabsContent value="reports">
          <DailyReport />
        </TabsContent>

        <TabsContent value="settings">
          <ConsentManagement />
        </TabsContent>
      </Tabs>

      <EmployeeDetailDialog
        session={selectedEmployee}
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
      />
    </>
  );
}

// Re-export components for external use
export { EmployeeMonitoringDetail } from "./employee-detail";
export { StatusBadge } from "./status-badge";
export { LiveIndicator } from "./live-indicator";
export { ScreenshotGallery } from "./screenshot-gallery";
export { ActivityTimeline } from "./activity-timeline";
export { AppUsageChart } from "./app-usage-chart";
export { CCTVGrid } from "./cctv-grid";
export { CCTVFeed } from "./cctv-feed";
export { LiveViewer } from "./live-viewer";
export { ConsentManagement } from "./consent-management";
export { DailyReport } from "./daily-report";
