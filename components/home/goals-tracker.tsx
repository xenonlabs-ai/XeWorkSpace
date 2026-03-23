"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2, Clock, Target } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Goal {
  id: string;
  title: string;
  progress: number;
  status: "completed" | "on-track" | "at-risk" | "pending";
  dueDate: string;
  owner: string;
  category: string;
}

const getStatus = (status: string) => {
  switch (status) {
    case "completed":
      return {
        icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        label: "Completed",
        color: "bg-green-50 text-green-700 border-green-200",
      };
    case "on-track":
      return {
        icon: <Clock className="h-4 w-4 text-blue-500" />,
        label: "On Track",
        color: "bg-blue-50 text-blue-700 border-blue-200",
      };
    case "at-risk":
      return {
        icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
        label: "At Risk",
        color: "bg-amber-50 text-amber-700 border-amber-200",
      };
    default:
      return {
        icon: <Clock className="h-4 w-4 text-gray-500" />,
        label: "Pending",
        color: "bg-gray-50 text-gray-700 border-gray-200",
      };
  }
};

export function GoalsTracker() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("/api/goals");
        if (response.ok) {
          const data = await response.json();
          setGoals(data.goals || []);
        }
      } catch (error) {
        console.error("Failed to fetch goals:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchGoals();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Goals Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border p-4">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-3 w-1/2 mb-3" />
              <Skeleton className="h-2 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Goals Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Target className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No goals set yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Goals Tracker</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {goals.map((goal) => {
          const status = getStatus(goal.status);

          return (
            <div
              key={goal.id}
              className="relative overflow-hidden rounded-xl border bg-linear-to-r from-background to-muted/50 p-4"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-medium text-[15px] truncate max-w-[200px] sm:max-w-full">
                      {goal.title}
                    </h4>
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0.5 border border-border/50 whitespace-nowrap"
                    >
                      {goal.category}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1 truncate max-w-[240px] sm:max-w-none">
                    {goal.owner} • Due: {goal.dueDate}
                  </p>
                </div>

                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 text-xs px-2 py-1 border whitespace-nowrap self-start sm:self-auto ${status.color}`}
                >
                  {status.icon}
                  {status.label}
                </Badge>
              </div>

              <div className="flex items-center gap-3 mt-1">
                <Progress
                  value={goal.progress}
                  className={`flex-1 h-2 rounded-full ${
                    goal.status === "completed"
                      ? "bg-green-100"
                      : goal.status === "at-risk"
                      ? "bg-amber-100"
                      : "bg-blue-100"
                  }`}
                />
                <span className="text-sm font-semibold text-foreground shrink-0">
                  {goal.progress}%
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
