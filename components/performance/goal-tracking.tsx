"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export function GoalTracking() {
  const goals = [
    {
      id: 1,
      name: "Increase Team Productivity",
      target: "90%",
      current: "87%",
      progress: 87,
      status: "on-track",
      dueDate: "Jun 30, 2025",
    },
    {
      id: 2,
      name: "Reduce Task Completion Time",
      target: "2 days",
      current: "2.4 days",
      progress: 75,
      status: "at-risk",
      dueDate: "Jul 15, 2025",
    },
    {
      id: 3,
      name: "Improve Code Quality Score",
      target: "95%",
      current: "92%",
      progress: 92,
      status: "on-track",
      dueDate: "Jun 15, 2025",
    },
    {
      id: 4,
      name: "Complete Project Milestones",
      target: "100%",
      current: "65%",
      progress: 65,
      status: "on-track",
      dueDate: "Aug 1, 2025",
    },
  ];

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
