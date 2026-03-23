"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, TrendingDown, TrendingUp, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TeamMember {
  id: string;
  name: string;
  image?: string;
  role: string;
  productivity: number;
  quality: number;
  efficiency: number;
  trend: "up" | "down" | "stable";
}

export function TeamComparison() {
  const { data: session } = useSession();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTeamComparison = async () => {
      try {
        const response = await fetch("/api/performance/team-comparison");
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data.members || []);
        }
      } catch (error) {
        console.error("Failed to fetch team comparison:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchTeamComparison();
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

  const renderTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Member Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-3 rounded-md border space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-8 w-full" />
                  ))}
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
          <CardTitle>Team Member Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No team data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Member Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="p-3 rounded-md border hover:bg-muted/20 transition space-y-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={member.image || `/images/users/${member.id}.jpg`}
                    alt={member.name}
                  />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{member.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {member.role}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Productivity</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        {member.productivity}%
                      </span>
                      {renderTrendIcon(member.trend)}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-primary rounded-full h-1.5"
                      style={{ width: `${member.productivity}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Quality</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{member.quality}%</span>
                      {renderTrendIcon(member.trend)}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-blue-500 rounded-full h-1.5"
                      style={{ width: `${member.quality}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Efficiency</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{member.efficiency}%</span>
                      {renderTrendIcon(member.trend)}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-green-500 rounded-full h-1.5"
                      style={{ width: `${member.efficiency}%` }}
                    ></div>
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
