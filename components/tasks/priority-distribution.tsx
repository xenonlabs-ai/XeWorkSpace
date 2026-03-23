"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface PriorityData {
  name: string;
  count: number;
  color: string;
}

export function PriorityDistribution() {
  const { data: session } = useSession();
  const [priorities, setPriorities] = useState<PriorityData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPriorities = async () => {
      try {
        const response = await fetch("/api/tasks/priority-distribution");
        if (response.ok) {
          const data = await response.json();
          setPriorities(data.priorities || []);
        }
      } catch (error) {
        console.error("Failed to fetch priority distribution:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchPriorities();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center space-y-12">
            <Skeleton className="h-44 w-44 rounded-full" />
            <div className="grid grid-cols-3 gap-3 w-full">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (priorities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Priority Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PieChart className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No priority data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = priorities.reduce((sum, item) => sum + item.count, 0);

  // Build conic-gradient for accurate ring rendering
  let gradient = "";
  let accumulated = 0;
  priorities.forEach((p) => {
    const start = (accumulated / total) * 100;
    const end = ((accumulated + p.count) / total) * 100;
    accumulated += p.count;
    gradient += `${p.color} ${start}% ${end}%, `;
  });
  gradient = gradient.slice(0, -2); // remove trailing comma

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority Distribution</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center justify-between space-y-12">
          {/* Circular Chart */}
          <div className="relative h-44 w-44 mb-4">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(${gradient})`,
              }}
            />
            <div className="absolute inset-5 bg-background rounded-full flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-foreground">{total}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-3 mt-2 w-full text-center">
            {priorities.map((item) => (
              <div
                key={item.name}
                className="flex flex-col items-center justify-center"
              >
                <div
                  className="w-3 h-3 rounded-full mb-1"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-xs font-medium text-muted-foreground">
                  {item.name}
                </div>
                <div
                  className="text-sm font-semibold pt-1"
                  style={{ color: item.color }}
                >
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
