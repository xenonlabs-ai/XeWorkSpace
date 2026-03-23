"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ActivityData {
  week: string;
  activity: number;
}

interface TeamActivityData {
  percentage: string;
  change: string;
  chartData: ActivityData[];
}

export function TeamActivityCard() {
  const { data: session } = useSession();
  const [data, setData] = useState<TeamActivityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/team-activity");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch team activity:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Team Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32 mb-4" />
          <Skeleton className="h-[120px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Team Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[120px] text-center">
            <Activity className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No activity data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Team Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.percentage}</div>
        <p className="text-xs text-muted-foreground">{data.change}</p>
        <div className="h-[120px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chartData}>
              <XAxis dataKey="week" hide />
              <YAxis hide />
              <Tooltip cursor={{ stroke: "transparent" }} />
              <Line
                type="monotone"
                dataKey="activity"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
