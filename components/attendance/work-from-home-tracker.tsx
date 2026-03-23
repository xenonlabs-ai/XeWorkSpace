"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, Home, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface WorkDay {
  date: string;
  location: "Office" | "Remote";
}

interface TeamMember {
  id: string;
  name: string;
  image?: string;
  location: "Office" | "Remote";
  days: WorkDay[];
}

export function WorkFromHomeTracker() {
  const { data: session } = useSession();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchWfhData = async () => {
      try {
        const response = await fetch("/api/attendance/work-from-home");
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.members || []);
        }
      } catch (error) {
        console.error("Failed to fetch WFH data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchWfhData();
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

  const locationBg = {
    Office: "bg-blue-50 dark:bg-blue-950",
    Remote: "bg-green-50 dark:bg-green-950",
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Work From Home Tracker
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-1.5 w-full" />
          <div className="pt-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-5 p-2">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-8 w-full" />
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
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">
              Work From Home Tracker
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Home className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No work location data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalMembers = teamMembers.length;
  const remoteCount = teamMembers.filter((m) => m.location === "Remote").length;
  const officeCount = totalMembers - remoteCount;
  const officePercentage = totalMembers > 0 ? Math.round((officeCount / totalMembers) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Work From Home Tracker
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Update
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="flex justify-between items-center text-sm font-semibold">
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-blue-600" />
            <span className="text-blue-900 dark:text-blue-200">
              Office: <span className="font-extrabold">{officeCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-green-600" />
            <span className="text-green-900 dark:text-green-200">
              Remote: <span className="font-extrabold">{remoteCount}</span>
            </span>
          </div>
        </div>

        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-500 h-1.5 transition-all"
            style={{ width: `${officePercentage}%` }}
          ></div>
        </div>

        <div className="pt-4 space-y-3">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className={`flex items-start gap-5 p-2 rounded-lg hover:bg-muted/40 transition-colors ${locationBg[member.location]}`}
            >
              <Avatar className="h-10 w-10 md:h-14 md:w-14 shrink-0 border border-border/50 shadow">
                <AvatarImage
                  src={member.image || `/images/users/${member.id}.jpg`}
                  alt={member.name}
                />
                <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-medium truncate leading-snug text-foreground">
                    {member.name}
                  </span>
                  <Badge
                    variant={
                      member.location === "Office" ? "outline" : "secondary"
                    }
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full
                      ${
                        member.location === "Office"
                          ? "border-blue-400 text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-200"
                          : "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                      }`}
                  >
                    {member.location === "Office" ? (
                      <Building className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Home className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium">{member.location}</span>
                  </Badge>
                </div>

                {member.days && member.days.length > 0 && (
                  <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
                    {member.days.map((day, index) => (
                      <div
                        key={index}
                        className={`text-xs px-3 py-1 rounded-md flex items-center whitespace-nowrap font-semibold
                          ${
                            day.location === "Office"
                              ? "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200"
                              : "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-200"
                          }`}
                        style={{ minWidth: "52px" }}
                      >
                        {day.location === "Office" ? (
                          <Building className="h-3 w-3 mr-1" />
                        ) : (
                          <Home className="h-3 w-3 mr-1" />
                        )}
                        <span>{day.date.split(",")[0]}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
