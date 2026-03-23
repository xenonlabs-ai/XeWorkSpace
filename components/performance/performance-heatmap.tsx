"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid3X3 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";

type HeatmapCell = { week: number; value: number };
type HeatmapRow = { day: string; values: HeatmapCell[] };

export function PerformanceHeatmap() {
  const { data: session } = useSession();
  const [data, setData] = useState<HeatmapRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

  useEffect(() => {
    const fetchHeatmapData = async () => {
      try {
        const response = await fetch("/api/performance/heatmap");
        if (response.ok) {
          const result = await response.json();
          setData(result.heatmap || []);
        }
      } catch (error) {
        console.error("Failed to fetch heatmap data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchHeatmapData();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const getCellColor = (value: number): string => {
    if (value >= 90) return "bg-emerald-600";
    if (value >= 75) return "bg-emerald-500";
    if (value >= 60) return "bg-teal-400";
    if (value >= 45) return "bg-cyan-400";
    if (value >= 30) return "bg-sky-300";
    if (value >= 15) return "bg-blue-300";
    return "bg-slate-300";
  };

  const HeatmapGrid: React.FC<{ data: HeatmapRow[] }> = ({ data }) => (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-[45px_repeat(12,1fr)] gap-1 mb-2">
          <div />
          {weeks.map((w) => (
            <div
              key={w}
              className="text-xs text-muted-foreground text-center font-medium"
            >
              W{w}
            </div>
          ))}
        </div>

        {data.map((row) => (
          <div
            key={row.day}
            className="grid grid-cols-[45px_repeat(12,1fr)] gap-1 mb-1"
          >
            <div className="text-xs text-muted-foreground flex items-center justify-center font-medium">
              {row.day}
            </div>
            {row.values.map((cell) => (
              <div
                key={cell.week}
                className={`h-7 rounded-md ${getCellColor(
                  cell.value
                )} transition-all duration-300 hover:scale-105`}
                title={`${row.day}, Week ${cell.week}: ${cell.value}%`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const Legend = () => (
    <div className="flex justify-center mt-4 items-center gap-2 text-xs text-muted-foreground">
      <span>Low</span>
      <div className="flex gap-1">
        <div className="w-4 h-4 bg-slate-300 rounded" />
        <div className="w-4 h-4 bg-blue-300 rounded" />
        <div className="w-4 h-4 bg-sky-300 rounded" />
        <div className="w-4 h-4 bg-cyan-400 rounded" />
        <div className="w-4 h-4 bg-teal-400 rounded" />
        <div className="w-4 h-4 bg-emerald-500 rounded" />
        <div className="w-4 h-4 bg-emerald-600 rounded" />
      </div>
      <span>High</span>
    </div>
  );

  if (isLoading) {
    return (
      <Card className="border border-border/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Performance Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {days.map((day) => (
              <div key={day} className="flex gap-1">
                <Skeleton className="w-[45px] h-7" />
                {weeks.map((w) => (
                  <Skeleton key={w} className="flex-1 h-7" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="border border-border/50 shadow-none">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-foreground">
            Performance Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Grid3X3 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No heatmap data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border/50 shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Performance Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <HeatmapGrid data={data} />
        <Legend />
      </CardContent>
    </Card>
  );
}
