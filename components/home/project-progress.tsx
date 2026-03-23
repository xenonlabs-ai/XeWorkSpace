"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, Milestone } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface MilestoneData {
  id: string;
  name: string;
  completed: boolean;
  date: string;
}

export function ProjectProgressWidget() {
  const { data: session } = useSession();
  const [milestones, setMilestones] = useState<MilestoneData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await fetch("/api/projects/milestones");
        if (response.ok) {
          const data = await response.json();
          setMilestones(data.milestones || []);
        }
      } catch (error) {
        console.error("Failed to fetch milestones:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchMilestones();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const completedCount = milestones.filter((m) => m.completed).length;
  const progressPercentage = milestones.length > 0
    ? Math.round((completedCount / milestones.length) * 100)
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-4 w-full" />
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (milestones.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Milestone className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No milestones yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Overall Progress Bar */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm text-muted-foreground font-medium">
              Overall Progress
            </span>
            <span className="text-sm font-semibold text-foreground">
              {progressPercentage}%
            </span>
          </div>

          <div className="relative w-full h-1.5 rounded-full bg-muted overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-primary transition-all duration-700 ease-in-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="relative mt-2">
          <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-muted"></div>

          <div className="space-y-7">
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                className="relative flex items-start gap-3 pl-10 group"
              >
                <div
                  className={`absolute left-0 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    milestone.completed
                      ? "bg-primary border-primary text-primary-foreground"
                      : "bg-background border-muted text-muted-foreground group-hover:border-primary/50"
                  }`}
                >
                  {milestone.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Circle className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1">
                  <p
                    className={`text-sm font-medium transition-colors ${
                      milestone.completed
                        ? "text-foreground"
                        : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {milestone.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {milestone.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
