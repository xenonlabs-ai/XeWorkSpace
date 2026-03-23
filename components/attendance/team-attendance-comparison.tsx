"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  avatar?: string;
  attendance: number;
  punctuality: number;
  streak: number;
  status: "Present" | "Late" | "Absent";
}

export function TeamAttendanceComparison() {
  const { data: session } = useSession();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamAttendance = async () => {
      try {
        const response = await fetch("/api/attendance/team-comparison");
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.members || []);
        }
      } catch (error) {
        console.error("Failed to fetch team attendance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchTeamAttendance();
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
          <CardTitle>Team Attendance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-2 w-full" />
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
          <CardTitle>Team Attendance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No team attendance data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Attendance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-12">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage
                  src={member.avatar || `/images/users/${member.id}.jpg`}
                  alt={member.name}
                />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{member.name}</span>
                    <Badge
                      variant={
                        member.status === "Present"
                          ? "outline"
                          : member.status === "Late"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {member.status}
                    </Badge>
                  </div>
                  {member.streak > 0 && (
                    <div className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center">
                      <span className="mr-1">🔥</span> {member.streak} day
                      streak
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Attendance</span>
                      <span>{member.attendance}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className={`rounded-full h-1.5 ${
                          member.attendance >= 95
                            ? "bg-green-500"
                            : member.attendance >= 85
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${member.attendance}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Punctuality</span>
                      <span>{member.punctuality}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className={`rounded-full h-1.5 ${
                          member.punctuality >= 95
                            ? "bg-green-500"
                            : member.punctuality >= 85
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${member.punctuality}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
