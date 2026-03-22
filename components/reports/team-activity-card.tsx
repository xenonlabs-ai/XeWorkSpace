"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as LineChartIcon } from "lucide-react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { week: "W1", activity: 72 },
  { week: "W2", activity: 81 },
  { week: "W3", activity: 31 },
  { week: "W4", activity: 16 },
];

export function TeamActivityCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Team Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">87%</div>
        <p className="text-xs text-muted-foreground">+12% from last month</p>
        <div className="h-[120px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
