"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export function PerformanceTrends() {
  const data = [
    { month: "Jan", productivity: 35, quality: 25, efficiency: 30 },
    { month: "Feb", productivity: 30, quality: 20, efficiency: 28 },
    { month: "Mar", productivity: 25, quality: 15, efficiency: 25 },
    { month: "Apr", productivity: 28, quality: 10, efficiency: 20 },
    { month: "May", productivity: 20, quality: 12, efficiency: 22 },
    { month: "Jun", productivity: 15, quality: 8, efficiency: 18 },
    { month: "Jul", productivity: 18, quality: 10, efficiency: 15 },
    { month: "Aug", productivity: 12, quality: 5, efficiency: 12 },
    { month: "Sep", productivity: 10, quality: 8, efficiency: 10 },
    { month: "Oct", productivity: 8, quality: 6, efficiency: 8 },
    { month: "Nov", productivity: 5, quality: 4, efficiency: 5 },
    { month: "Dec", productivity: 5, quality: 4, efficiency: 5 },
  ];

  const colors = {
    productivity: "var(--primary)",
    quality: "#3b82f6",
    efficiency: "#10b981",
  };

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

              {/* X axis only */}
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />

              {/* Hide Y axis and grid */}
              <YAxis
                stroke="transparent" // keep the vertical line
                axisLine={true} // show the axis line
                tick={false} // hide labels
                tickLine={false} // hide small ticks
              />
              <CartesianGrid stroke="transparent" />

              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />

              {/* Three datasets */}
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
