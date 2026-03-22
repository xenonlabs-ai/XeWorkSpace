"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Monitor, Camera, Activity, Clock } from "lucide-react";

interface MonitoringStatsCardsProps {
  stats?: {
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
  } | null;
  isLoading: boolean;
}

export function MonitoringStatsCards({
  stats,
  isLoading,
}: MonitoringStatsCardsProps) {
  const cards = [
    {
      title: "Online Now",
      value: stats?.overview.onlineCount ?? 0,
      description: `${stats?.overview.idleCount ?? 0} idle, ${stats?.overview.offlineCount ?? 0} offline`,
      icon: Users,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-500",
    },
    {
      title: "Active Sessions",
      value: (stats?.overview.onlineCount ?? 0) + (stats?.overview.idleCount ?? 0),
      description: `${stats?.overview.totalUsers ?? 0} total users tracked`,
      icon: Monitor,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-500",
    },
    {
      title: "Screenshots Today",
      value: stats?.today.screenshots ?? 0,
      description: "Captured across all sessions",
      icon: Camera,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-500",
    },
    {
      title: "Activities Today",
      value: stats?.today.activities ?? 0,
      description: `${stats?.today.totalIdleMinutes ?? 0} min idle time`,
      icon: Activity,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-500",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mt-6">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${card.iconBg}`}>
              <card.icon className={`h-4 w-4 ${card.iconColor}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {card.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
