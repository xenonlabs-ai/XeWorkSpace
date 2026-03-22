"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AppWindow } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface AppUsage {
  name: string;
  count: number;
  totalDuration: number;
}

interface AppUsageChartProps {
  apps: AppUsage[];
  isLoading?: boolean;
}

const COLORS = [
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f97316", // orange
  "#22c55e", // green
  "#06b6d4", // cyan
  "#eab308", // yellow
  "#ef4444", // red
  "#6366f1", // indigo
  "#14b8a6", // teal
];

export function AppUsageChart({ apps, isLoading }: AppUsageChartProps) {
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${mins}m`;
  };

  const chartData = apps.slice(0, 10).map((app, index) => ({
    name: app.name || "Unknown",
    usage: app.count,
    duration: app.totalDuration,
    color: COLORS[index % COLORS.length],
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppWindow className="h-5 w-5" />
            Top Applications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (apps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AppWindow className="h-5 w-5" />
            Top Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <AppWindow className="h-12 w-12 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">No application data yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AppWindow className="h-5 w-5" />
          Top Applications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis
              dataKey="name"
              type="category"
              width={75}
              tick={{ fontSize: 12 }}
              tickFormatter={(value) =>
                value.length > 12 ? `${value.substring(0, 12)}...` : value
              }
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-popover border rounded-lg shadow-lg p-3">
                      <p className="font-medium">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.usage} switches
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatDuration(data.duration)} total
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="usage" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 grid grid-cols-2 gap-2">
          {chartData.slice(0, 6).map((app, index) => (
            <div
              key={app.name}
              className="flex items-center gap-2 text-sm"
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: app.color }}
              />
              <span className="truncate">{app.name}</span>
              <span className="text-muted-foreground ml-auto">
                {formatDuration(app.duration)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
