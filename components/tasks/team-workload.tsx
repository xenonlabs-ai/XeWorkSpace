"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  tasks: number;
  completed: number;
}

export function TeamWorkload() {
  const { data: session } = useSession();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWorkload = async () => {
      try {
        const response = await fetch("/api/tasks/team-workload");
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.members || []);
        }
      } catch (error) {
        console.error("Failed to fetch team workload:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchWorkload();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                  <Skeleton className="h-1.5 w-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Workload</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No team workload data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Workload</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {teamMembers.map((member) => {
            const completionPercentage =
              member.tasks > 0 ? (member.completed / member.tasks) * 100 : 0;

            const barGradient =
              completionPercentage < 30
                ? "bg-gradient-to-r from-red-500 to-red-400"
                : completionPercentage < 70
                ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                : "bg-gradient-to-r from-green-500 to-emerald-400";

            return (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-lg transition-all duration-300"
              >
                <Avatar className="h-9 w-9 ring-2 ring-muted">
                  <AvatarImage
                    src={member.avatar || `/images/users/${member.id}.jpg`}
                    alt={member.name}
                  />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium truncate">
                      {member.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {member.completed}/{member.tasks} tasks
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full ${barGradient} shadow-sm`}
                      style={{
                        width: `${completionPercentage}%`,
                        boxShadow: "0 0 6px rgba(0,0,0,0.15)",
                      }}
                    ></div>
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
