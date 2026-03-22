"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const trendData = [
  { date: "Jan", revenue: 4500, expenses: 3700, profit: 800 },
  { date: "Feb", revenue: 5200, expenses: 4100, profit: 1100 },
  { date: "Mar", revenue: 4800, expenses: 3900, profit: 900 },
  { date: "Apr", revenue: 6000, expenses: 4200, profit: 1800 },
  { date: "May", revenue: 5700, expenses: 4300, profit: 1400 },
  { date: "Jun", revenue: 6500, expenses: 4500, profit: 2000 },
  { date: "Jul", revenue: 7200, expenses: 4800, profit: 2400 },
  { date: "Aug", revenue: 7800, expenses: 5100, profit: 2700 },
  { date: "Sep", revenue: 8400, expenses: 5300, profit: 3100 },
  { date: "Oct", revenue: 9100, expenses: 5600, profit: 3500 },
  { date: "Nov", revenue: 9800, expenses: 5900, profit: 3900 },
  { date: "Dec", revenue: 10500, expenses: 6200, profit: 4300 },
];

const keyMetrics = [
  {
    name: "Revenue",
    value: "$10,500",
    change: 8.3,
    trend: "up",
    color: "#8884d8",
  },
  {
    name: "Expenses",
    value: "$6,200",
    change: 5.1,
    trend: "up",
    color: "#82ca9d",
  },
  {
    name: "Profit",
    value: "$4,300",
    change: 10.2,
    trend: "up",
    color: "#ffc658",
  },
];

export function TrendAnalysis() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Trend Analysis</CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Line Chart */}
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
