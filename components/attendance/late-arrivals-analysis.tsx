"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface LateArrivalData {
  day: string;
  count: number;
}

export function LateArrivalsAnalysis() {
  const { data: session } = useSession();
  const [lateArrivalsData, setLateArrivalsData] = useState<LateArrivalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLateArrivals = async () => {
      try {
        const response = await fetch("/api/attendance/late-arrivals");
        if (response.ok) {
          const data = await response.json();
          setLateArrivalsData(data.lateArrivals || []);
        }
      } catch (error) {
        console.error("Failed to fetch late arrivals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchLateArrivals();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Late Arrivals Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
            <div className="space-y-5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-8 w-full" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (lateArrivalsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Late Arrivals Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No late arrivals data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalLateArrivals = lateArrivalsData.reduce(
    (sum, day) => sum + day.count,
    0
  );
  const averageLateArrivals = (
    totalLateArrivals / lateArrivalsData.length
  ).toFixed(1);
  const maxLateArrivals = Math.max(...lateArrivalsData.map((day) => day.count));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Late Arrivals Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{totalLateArrivals}</div>
              <div className="text-xs text-muted-foreground">
                Total Late Arrivals
              </div>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{averageLateArrivals}</div>
              <div className="text-xs text-muted-foreground">Daily Average</div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-sm font-medium mb-3">Late Arrivals by Day</div>
            <div className="space-y-5">
              {lateArrivalsData.map((day) => (
                <div key={day.day} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{day.day}</span>
                    <span>{day.count} late arrivals</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`rounded-full h-2 ${
                        day.count <= 2
                          ? "bg-green-500"
                          : day.count <= 4
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${maxLateArrivals > 0 ? (day.count / maxLateArrivals) * 100 : 0}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
