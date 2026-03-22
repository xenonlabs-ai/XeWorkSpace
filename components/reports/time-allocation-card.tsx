"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Dev", value: 65 },
  { name: "Time", value: 20 },
  { name: "Plan", value: 15 },
];

const COLORS = ["var(--primary)", "#3B82F6", "#F59E0B"];

export default function TimeAllocationCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Time Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">160 hrs</div>
        <p className="text-xs text-muted-foreground">
          Total hours tracked this month
        </p>

        <div className="relative h-[150px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              {/* Center Text */}
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={14}
                fontWeight={600}
                fill="var(--primary)"
              >
                Attendance
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              ></div>
              <span>{item.name}</span>
            </div>
          ))}
        </div> */}
      </CardContent>
    </Card>
  );
}
