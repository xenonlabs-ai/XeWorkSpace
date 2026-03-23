"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TaskCategory {
  name: string;
  value: number;
  color: string;
}

interface MetricsData {
  teamProductivity: {
    value: number;
    change: string;
    bars: number[];
  };
  tasksCompleted: {
    value: number;
    change: string;
    categories: TaskCategory[];
  };
  timeAllocation: {
    totalHours: string;
    subtitle: string;
    allocations: { name: string; color: string }[];
  };
  qualityScore: {
    value: number;
    change: string;
    codeReviews: number;
    bugRate: number;
  };
}

export function MetricCards() {
  const { data: session } = useSession();
  const [data, setData] = useState<MetricsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/performance/metrics");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch metrics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchMetrics();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32 mb-4" />
              <Skeleton className="h-[200px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <BarChart3 className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No metrics data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {/* Team Productivity */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Team Productivity</CardTitle>
        </CardHeader>
        <CardContent className="relative overflow-hidden">
          <div className="text-2xl font-bold">{data.teamProductivity.value}%</div>
          <div className="flex items-center text-xs text-green-500 font-medium">
            <TrendingUp className="h-3 w-3 mr-1" />
            {data.teamProductivity.change}
          </div>

          <div className="mt-4 h-[200px] bg-primary/5 rounded-md flex items-end justify-between p-2">
            {data.teamProductivity.bars.map((height, i) => (
              <div
                key={i}
                className="bg-primary/70 group-hover:bg-primary w-4 rounded-t-sm relative transition-all"
                style={{ height: `${height}px` }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {Math.round(height)}%
                </div>
              </div>
            ))}
          </div>

          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-xl"></div>
        </CardContent>
      </Card>

      {/* Tasks Completed */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Tasks Completed</CardTitle>
        </CardHeader>
        <CardContent className="relative overflow-hidden">
          <div className="text-2xl font-bold">{data.tasksCompleted.value}</div>
          <div className="flex items-center text-xs text-green-500 font-medium">
            <TrendingUp className="h-3 w-3 mr-1" />
            {data.tasksCompleted.change}
          </div>

          <div className="mt-4 space-y-4">
            {data.tasksCompleted.categories.map((task) => (
              <div key={task.name}>
                <div className="flex justify-between text-xs">
                  <span>{task.name}</span>
                  <span>{task.value}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mt-1">
                  <div
                    className={`${task.color} h-2 rounded-full transition-all`}
                    style={{ width: `${task.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/5 rounded-full blur-xl"></div>
        </CardContent>
      </Card>

      {/* Time Allocation */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Time Allocation</CardTitle>
        </CardHeader>
        <CardContent className="relative overflow-hidden">
          <div className="text-2xl font-bold">{data.timeAllocation.totalHours}</div>
          <p className="text-xs text-muted-foreground">{data.timeAllocation.subtitle}</p>

          <div className="mt-4 relative flex items-center justify-center h-45">
            <div className="absolute w-30 h-30 rounded-full border-8 border-primary/70" />
            <div className="absolute w-25 h-25 rounded-full border-8 border-blue-500/60 rotate-45" />
            <div className="absolute w-20 h-20 rounded-full border-8 border-amber-500/70 rotate-90" />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-1 text-xs">
            {data.timeAllocation.allocations.map((item, i) => (
              <div key={i} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${item.color}`}></span> {item.name}
              </div>
            ))}
          </div>

          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/5 rounded-full blur-xl"></div>
        </CardContent>
      </Card>

      {/* Quality Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>Quality Score</CardTitle>
        </CardHeader>
        <CardContent className="relative overflow-hidden">
          <div className="text-2xl font-bold">{data.qualityScore.value}%</div>
          <div className="flex items-center text-xs text-green-500 font-medium">
            <TrendingUp className="h-3 w-3 mr-1" /> {data.qualityScore.change}
          </div>

          <div className="mt-4 h-[150px] bg-muted/30 rounded-md flex items-center justify-center relative overflow-hidden">
            <svg
              viewBox="0 0 100 40"
              className="w-[90%] h-full stroke-2 drop-shadow-sm"
            >
              <defs>
                <linearGradient
                  id="qualityBlueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              <path
                d="M0,30 L10,20 L20,18 L30,15 L40,10 L50,8 L60,10 L70,12 L80,9 L90,11 L100,10"
                fill="none"
                stroke="url(#qualityBlueGradient)"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <path
                d="M0,40 L0,30 L10,20 L20,18 L30,15 L40,10 L50,8 L60,10 L70,12 L80,9 L90,11 L100,10 L100,40 Z"
                fill="url(#qualityBlueGradient)"
                fillOpacity="0.2"
              />
            </svg>

            <div className="absolute inset-0 bg-linear-to-t from-primary/10 to-transparent pointer-events-none"></div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-muted/40 p-2 rounded-md">
              <div className="text-muted-foreground">Code Reviews</div>
              <div className="font-medium text-sm">{data.qualityScore.codeReviews}%</div>
            </div>
            <div className="bg-muted/40 p-2 rounded-md">
              <div className="text-muted-foreground">Bug Rate</div>
              <div className="font-medium text-sm">{data.qualityScore.bugRate}%</div>
            </div>
          </div>

          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/5 rounded-full blur-xl"></div>
        </CardContent>
      </Card>
    </div>
  );
}
