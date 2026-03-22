"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeCard } from "./employee-card";
import { Monitor, Users } from "lucide-react";

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

interface EmployeeGridProps {
  sessions: Session[];
  isLoading: boolean;
  onSelectEmployee: (session: Session) => void;
}

export function EmployeeGrid({
  sessions,
  isLoading,
  onSelectEmployee,
}: EmployeeGridProps) {
  const onlineSessions = sessions.filter(
    (s) => s.status === "ONLINE" || s.status === "STREAMING"
  );
  const idleSessions = sessions.filter((s) => s.status === "IDLE");
  const offlineSessions = sessions.filter((s) => s.status === "OFFLINE");
  const allActive = [...onlineSessions, ...idleSessions];

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Monitor className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Active Sessions</h3>
          <p className="text-muted-foreground text-center max-w-md">
            No employees are currently being monitored. Sessions will appear here
            once employees start the desktop monitoring agent.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="active" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="active" className="gap-2">
          <Users className="h-4 w-4" />
          Active ({allActive.length})
        </TabsTrigger>
        <TabsTrigger value="online" className="gap-2">
          <span className="w-2 h-2 bg-green-500 rounded-full" />
          Online ({onlineSessions.length})
        </TabsTrigger>
        <TabsTrigger value="idle" className="gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full" />
          Idle ({idleSessions.length})
        </TabsTrigger>
        <TabsTrigger value="offline" className="gap-2">
          <span className="w-2 h-2 bg-gray-400 rounded-full" />
          Offline ({offlineSessions.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="active">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allActive.map((session) => (
            <EmployeeCard
              key={session.id}
              session={session}
              onClick={() => onSelectEmployee(session)}
            />
          ))}
        </div>
        {allActive.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No active sessions at the moment
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="online">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {onlineSessions.map((session) => (
            <EmployeeCard
              key={session.id}
              session={session}
              onClick={() => onSelectEmployee(session)}
            />
          ))}
        </div>
        {onlineSessions.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No employees currently online
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="idle">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {idleSessions.map((session) => (
            <EmployeeCard
              key={session.id}
              session={session}
              onClick={() => onSelectEmployee(session)}
            />
          ))}
        </div>
        {idleSessions.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No idle sessions
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="offline">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {offlineSessions.map((session) => (
            <EmployeeCard
              key={session.id}
              session={session}
              onClick={() => onSelectEmployee(session)}
            />
          ))}
        </div>
        {offlineSessions.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No offline sessions
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  );
}
