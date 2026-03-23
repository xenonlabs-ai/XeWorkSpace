"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, CheckCircle2, Clock, FolderKanban, XCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Project {
  id: string;
  name: string;
  status: "On Track" | "At Risk" | "Completed" | "Delayed";
  progress: number;
  dueDate: string;
}

const statusConfig = {
  "On Track": { color: "green", icon: CheckCircle2 },
  "At Risk": { color: "amber", icon: AlertTriangle },
  "Completed": { color: "blue", icon: CheckCircle2 },
  "Delayed": { color: "red", icon: XCircle },
};

export function ProjectStatusWidget() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects/status");
        if (response.ok) {
          const data = await response.json();
          setProjects(data.projects || []);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchProjects();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-3 p-4 border rounded-xl">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-1.5 w-full" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FolderKanban className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No projects yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {projects.map((p) => {
          const config = statusConfig[p.status] || statusConfig["On Track"];
          const Icon = config.icon;
          const colorClass = config.color;

          return (
            <div
              key={p.id}
              className="group flex items-start gap-2 rounded-xl border border-border/50 p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-muted">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>

              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-sm truncate text-foreground">
                    {p.name}
                  </h4>
                  <Badge variant="secondary" className="text-xs font-medium px-1.5 py-0.25 capitalize">
                    {p.status}
                  </Badge>
                </div>

                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{p.progress}% Complete</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {p.dueDate}
                  </span>
                </div>

                <div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden mt-1">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${p.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
