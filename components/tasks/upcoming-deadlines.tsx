"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Clock } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Deadline {
  id: string;
  task: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  assignee: string;
}

export function UpcomingDeadlines() {
  const { data: session } = useSession();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeadlines = async () => {
      try {
        const response = await fetch("/api/tasks/deadlines");
        if (response.ok) {
          const data = await response.json();
          setDeadlines(data.deadlines || []);
        }
      } catch (error) {
        console.error("Failed to fetch upcoming deadlines:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchDeadlines();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-start gap-3 py-3 px-1">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (deadlines.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle>Upcoming Deadlines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No upcoming deadlines</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle>Upcoming Deadlines</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          View all <ArrowRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {deadlines.map((item) => (
          <div
            key={item.id}
            className="flex items-start flex-wrap gap-3 py-3 px-1 rounded-lg border border-muted/30 hover:shadow-md transition-shadow bg-background"
          >
            <div className="shrink-0 bg-primary/10 p-2 rounded-full flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h4 className="font-medium text-sm truncate">{item.task}</h4>
                  <div className="text-xs text-muted-foreground">
                    Due: {item.dueDate} • Assigned to: {item.assignee}
                  </div>
                </div>
                <Badge
                  variant={
                    item.priority === "High" ? "destructive" : "secondary"
                  }
                  className="text-xs md:ml-auto mt-1 md:mt-0"
                >
                  {item.priority}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
