"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface PerformanceData {
  month: string;
  value: number;
}

export function TeamPerformanceWidget() {
  const { data: session } = useSession();
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPerformance = async () => {
      try {
        const response = await fetch("/api/analytics/team-performance");
        if (response.ok) {
          const data = await response.json();
          setPerformanceData(data.performance || []);
        }
      } catch (error) {
        console.error("Failed to fetch team performance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchPerformance();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const average = performanceData.length > 0
    ? Math.round(
        performanceData.reduce((sum, item) => sum + item.value, 0) /
          performanceData.length
      )
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <Skeleton key={i} className="w-2 flex-1" style={{ height: `${Math.random() * 150 + 50}px` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (performanceData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No performance data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="md:w-full overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent h-full">
            <div className="flex items-end justify-between min-w-[100px] sm:min-w-0 gap-1 pb-1">
              {performanceData.map((item) => (
                <div
                  key={item.month}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className="bg-primary rounded-full w-1 md:w-2 transition-all duration-300 hover:opacity-80"
                    style={{ height: `${item.value * 2.8}px` }}
                  />
                  <div className="text-xs mt-2 text-muted-foreground">
                    {item.month}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="justify-between items-center mt-7 hidden md:flex xl:hidden">
          <div className="text-sm text-muted-foreground">Yearly Average</div>
          <div className="text-xl font-bold">{average}%</div>
        </div>
      </CardContent>
    </Card>
  );
}
