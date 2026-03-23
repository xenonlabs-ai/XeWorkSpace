"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TaskData {
  day: string;
  tasks: number;
}

interface TasksCompletedData {
  total: number;
  change: string;
  chartData: TaskData[];
}

export function TasksCompletedCard() {
  const { data: session } = useSession();
  const [data, setData] = useState<TasksCompletedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/tasks-completed");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch tasks completed:", error);
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
          <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32 mb-4" />
          <Skeleton className="h-[180px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.chartData.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[180px] text-center">
            <CheckSquare className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No task data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.total}</div>
        <p className="text-xs text-muted-foreground">{data.change}</p>
        <div className="h-[180px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.chartData}>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="tasks"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
