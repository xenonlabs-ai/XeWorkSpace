"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp } from "lucide-react";
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

interface TrendData {
  date: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export function TrendAnalysis() {
  const { data: session } = useSession();
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await fetch("/api/analytics/trends");
        if (response.ok) {
          const data = await response.json();
          setTrendData(data.trends || []);
        }
      } catch (error) {
        console.error("Failed to fetch trends:", error);
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (trendData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Trend Analysis</CardTitle>
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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Trend Analysis</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        <div className="h-[300px] pe-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={trendData}
              margin={{ top: 20, right: 20, left: -50, bottom: 5 }}
            >
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={{ stroke: "#ddd" }}
                padding={{ left: 0, right: 5 }}
              />
              <YAxis
                tickLine={false}
                tick={false}
                axisLine={{ stroke: "transparent" }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border rounded-md shadow-md p-3 text-sm">
                        <p className="font-medium mb-1">{label}</p>
                        {payload.map((entry, i) => (
                          <div key={i} className="flex items-center mt-1 gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: entry.color }}
                            />
                            <span className="font-medium">{entry.name}: </span>
                            <span>${entry.value}</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8884d8"
                strokeWidth={3}
                dot={{ r: 1 }}
                activeDot={{ r: 6, stroke: "#8884d8", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={{ r: 2 }}
                activeDot={{ r: 6, stroke: "#82ca9d", strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#ffc658"
                strokeWidth={3}
                dot={{ r: 3 }}
                activeDot={{ r: 6, stroke: "#ffc658", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
