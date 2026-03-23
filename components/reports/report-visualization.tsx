"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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

interface TaskDataPoint {
  month: string;
  productivity: number;
  tasksCompleted: number;
  totalTasks: number;
  attendance: number;
  quality: number;
}

interface PieDataPoint {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface VisualizationData {
  taskData: TaskDataPoint[];
  pieData: PieDataPoint[];
  attendancePercentage: number;
}

const barColors = {
  tasksCompleted: "var(--chart-2)",
  totalTasks: "var(--chart-5)",
};

export function ReportVisualization() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("line");
  const [data, setData] = useState<VisualizationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/visualization");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch visualization data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Management Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data || (data.taskData.length === 0 && data.pieData.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Management Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No report data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
                  data={data.taskData}
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
                  data={data.taskData}
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
                      data={data.pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      label
                    >
                      {data.pieData.map((entry, index) => (
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
                    <span className="text-xl font-bold">{data.attendancePercentage}%</span>
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
