"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, BarChart, CheckSquare, Clock, LucideIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TaskStat {
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  color: string;
  bg: string;
}

const iconMap: Record<string, LucideIcon> = {
  BarChart: BarChart,
  CheckSquare: CheckSquare,
  AlertTriangle: AlertTriangle,
  Clock: Clock,
};

export function TaskStatsCards() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<TaskStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/tasks/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats || []);
        }
      } catch (error) {
        console.error("Failed to fetch task stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchStats();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-9 w-9 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="col-span-full">
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <BarChart className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No task statistics available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((item, i) => {
        const Icon = iconMap[item.icon] || BarChart;
        return (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div
                className={`p-2 rounded-full ${item.bg} ${item.color} transition-all duration-300`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {item.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
