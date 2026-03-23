"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock, Target } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Goal {
  id: string;
  name: string;
  target: string;
  current: string;
  progress: number;
  status: "on-track" | "at-risk" | "behind";
  dueDate: string;
}

export function GoalTracking() {
  const { data: session } = useSession();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("/api/performance/goals");
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

  const getStatusProps = (status: string) => {
    switch (status) {
      case "on-track":
        return {
          color: "green",
          icon: <CheckCircle2 className="h-7 w-7 text-white" />,
        };
      case "at-risk":
        return {
          color: "amber",
          icon: <AlertTriangle className="h-7 w-7 text-white" />,
        };
      case "behind":
        return { color: "red", icon: <Clock className="h-7 w-7 text-white" /> };
      default:
        return { color: "gray", icon: null };
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Goal Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-4 border rounded-lg space-y-4">
                <div className="flex items-start gap-2">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Goal Tracking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Target className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No goals available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Goal Tracking</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {goals.map((goal) => {
            const { color, icon } = getStatusProps(goal.status);
            return (
              <div
                key={goal.id}
                className="p-4 border hover:bg-muted/20 transition rounded-lg bg-card space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-2">
                    <div
                      className={`flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-${color}-500`}
                    >
                      {icon}
                    </div>
                    <div className="w-fit">
                      <h3 className="font-medium text-sm md:text-base grow">
                        {goal.name}
                      </h3>
                      <div className="flex items-start flex-col md:flex-row  mt-2 md:mt-0 text-xs md:text-sm text-muted-foreground space-y-1 md:space-y-0">
                        <span>Target: {goal.target}</span>
                        <span className="px-1 hidden md:block">|</span>
                        <span>Current: {goal.current}</span>
                        <span className="px-1 hidden md:block">|</span>
                        <span>Due: {goal.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`bg-${color}-50 text-${color}-700 hover:bg-${color}-50`}
                  >
                    {goal.status === "on-track"
                      ? "On Track"
                      : goal.status === "at-risk"
                      ? "At Risk"
                      : "Behind"}
                  </Badge>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">Progress</span>
                    <span>{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${goal.progress}%` }}
                      transition={{ duration: 0.8 }}
                      className={`h-1.5 rounded-full bg-${color}-500`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
