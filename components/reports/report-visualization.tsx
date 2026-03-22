"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const taskData = [
  {
    month: "Jan",
    productivity: 35,
    tasksCompleted: 70,
    totalTasks: 100,
    attendance: 90,
    quality: 80,
  },
  {
    month: "Feb",
    productivity: 40,
    tasksCompleted: 60,
    totalTasks: 80,
    attendance: 85,
    quality: 75,
  },
  {
    month: "Mar",
    productivity: 30,
    tasksCompleted: 50,
    totalTasks: 70,
    attendance: 95,
    quality: 78,
  },
  {
    month: "Apr",
    productivity: 45,
    tasksCompleted: 80,
    totalTasks: 90,
    attendance: 88,
    quality: 82,
  },
  {
    month: "May",
    productivity: 50,
    tasksCompleted: 90,
    totalTasks: 100,
    attendance: 92,
    quality: 85,
  },
  {
    month: "Jun",
    productivity: 38,
    tasksCompleted: 65,
    totalTasks: 85,
    attendance: 87,
    quality: 80,
  },
  {
    month: "Jul",
    productivity: 42,
    tasksCompleted: 75,
    totalTasks: 95,
    attendance: 91,
    quality: 83,
  },
  {
    month: "Aug",
    productivity: 48,
    tasksCompleted: 85,
    totalTasks: 100,
    attendance: 89,
    quality: 86,
  },
  {
    month: "Sep",
    productivity: 36,
    tasksCompleted: 60,
    totalTasks: 80,
    attendance: 86,
    quality: 79,
  },
];

const barColors = {
  tasksCompleted: "var(--chart-2)",
  totalTasks: "var(--chart-5)",
};

const pieData = [
  { name: "Present", value: 90, color: "var(--primary)" },
  { name: "Absent", value: 10, color: "#f59e0b" },
];

export function ReportVisualization() {
  const [activeTab, setActiveTab] = useState("line");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Management Reports</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="line">Area</TabsTrigger>
            <TabsTrigger value="bar">Bar</TabsTrigger>
            <TabsTrigger value="pie">Pie</TabsTrigger>
          </TabsList>

          <div className="relative h-[300px] w-full">
            {/* AREA CHART - Productivity Over Time */}
            <div
              className={`absolute inset-0 ${
                activeTab === "line" ? "block" : "hidden"
              }`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={taskData}
                  margin={{ top: 10, right: 10, bottom: 10, left: -50 }}
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
                        stopColor="var(--primary)"
                        stopOpacity={0.4}
                      />
                      <stop
                        offset="95%"
                        stopColor="var(--primary)"
                        stopOpacity={0.05}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray={"0 3"} stroke="var(--border)" />
                  <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--transparent)" tick={false} />
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
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorProductivity)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* BAR CHART */}
            <div
              className={`absolute inset-0 ${
                activeTab === "bar" ? "block" : "hidden"
              }`}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={taskData}
                  margin={{ top: 10, right: 10, bottom: 10, left: -50 }}
                  barCategoryGap={16}
                  barGap={2}
                >
                  <CartesianGrid vertical={false} stroke="var(--transparent)" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    stroke="var(--muted-foreground)"
                  />
                  <YAxis stroke="var(--transparent)" tick={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--card)",
                      border: "1px solid var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                  <Bar
                    dataKey="tasksCompleted"
                    fill={barColors.tasksCompleted}
                    radius={10}
                  />
                  <Bar
                    dataKey="totalTasks"
                    fill={barColors.totalTasks}
                    radius={10}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* PIE CHART */}
            <div
              className={`absolute inset-0 ${
                activeTab === "pie" ? "block" : "hidden"
              } flex items-center justify-center`}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        color: "var(--foreground)",
                      }}
                    />
                  </PieChart>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xl font-bold">90%</span>
                    <span className="text-sm text-muted-foreground">
                      Attendance
                    </span>
                  </div>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
