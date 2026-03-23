"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrendData {
  month: string;
  productivity: number;
  quality: number;
  efficiency: number;
}

export function PerformanceTrends() {
  const { data: session } = useSession();
  const [data, setData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch("/api/performance/trends");
        if (response.ok) {
          const result = await response.json();
          setData(result.trends || []);
        }
      } catch (error) {
        console.error("Failed to fetch performance trends:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchTrends();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const colors = {
    productivity: "var(--primary)",
    quality: "#3b82f6",
    efficiency: "#10b981",
  };

  if (isLoading) {
    return (
      <Card className="col-span-2 bg-background border-border">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className="col-span-2 bg-background border-border">
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <TrendingUp className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No trend data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 bg-background border-border">
      <CardHeader>
        <CardTitle>Performance Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 20, bottom: 10, left: -50 }}
            >
              <defs>
                <linearGradient
                  id="colorProductivity"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={colors.productivity}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.productivity}
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={colors.quality}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.quality}
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="colorEfficiency"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={colors.efficiency}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset="95%"
                    stopColor={colors.efficiency}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <XAxis dataKey="month" stroke="var(--muted-foreground)" />

              <YAxis
                stroke="transparent"
                axisLine={true}
                tick={false}
                tickLine={false}
              />
              <CartesianGrid stroke="transparent" />

              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />

              <Area
                type="monotone"
                dataKey="productivity"
                stroke={colors.productivity}
                fill="url(#colorProductivity)"
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="quality"
                stroke={colors.quality}
                fill="url(#colorQuality)"
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="efficiency"
                stroke={colors.efficiency}
                fill="url(#colorEfficiency)"
                strokeWidth={2}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
