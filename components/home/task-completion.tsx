"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface CompletionData {
  label: string;
  value: number;
  color: string;
}

export function TaskCompletionWidget() {
  const { data: session } = useSession();
  const [completionData, setCompletionData] = useState<CompletionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompletion = async () => {
      try {
        const response = await fetch("/api/tasks/completion-stats");
        if (response.ok) {
          const data = await response.json();
          setCompletionData(data.stats || []);
        }
      } catch (error) {
        console.error("Failed to fetch task completion:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchCompletion();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  // Generate conic-gradient dynamically
  const conicGradient = (() => {
    if (completionData.length === 0) return "conic-gradient(#d1d5db 0deg 360deg)";
    let currentAngle = 0;
    return `conic-gradient(${completionData
      .map((item) => {
        const start = currentAngle;
        const end = currentAngle + (item.value / 100) * 360;
        currentAngle = end;
        return `${item.color} ${start}deg ${end}deg`;
      })
      .join(", ")})`;
  })();

  const completedValue = completionData.find(d => d.label === "Completed")?.value || 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6">
            <Skeleton className="h-40 w-40 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <Skeleton className="h-3 w-3 rounded-full mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (completionData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <PieChart className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No task data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Completion</CardTitle>
      </CardHeader>

      <CardContent>
        {/* Chart */}
        <div className="flex items-center justify-center py-6">
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 lg:h-40 lg:w-40">
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: conicGradient }}
            />
            <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  {completedValue}%
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  Completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 mt-4 sm:mt-5 text-center">
          {completionData.map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mb-1"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-[10px] sm:text-xs font-medium truncate">
                {item.label}
              </div>
              <div className="text-xs sm:text-sm font-bold">{item.value}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
