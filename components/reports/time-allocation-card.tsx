"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface AllocationData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface TimeAllocationData {
  totalHours: string;
  subtitle: string;
  allocations: AllocationData[];
}

export default function TimeAllocationCard() {
  const { data: session } = useSession();
  const [data, setData] = useState<TimeAllocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/reports/time-allocation");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Failed to fetch time allocation:", error);
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
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Time Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-3 w-40 mb-4" />
          <Skeleton className="h-[150px] w-full rounded-full mx-auto" style={{ maxWidth: "150px" }} />
        </CardContent>
      </Card>
    );
  }

  if (!data || data.allocations.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Time Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[150px] text-center">
            <Clock className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No time allocation data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Time Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.totalHours}</div>
        <p className="text-xs text-muted-foreground">{data.subtitle}</p>

        <div className="relative h-[150px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.allocations}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={60}
                paddingAngle={3}
              >
                {data.allocations.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={14}
                fontWeight={600}
                fill="var(--primary)"
              >
                Time
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
