"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ResourceData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number;
}

interface TeamMember {
  id: string;
  name: string;
  department: string;
  utilization: number;
  status: "Overallocated" | "Underutilized" | "Optimal";
}

export function ResourceUtilization() {
  const { data: session } = useSession();
  const [resourceData, setResourceData] = useState<ResourceData[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/analytics/resource-utilization");
        if (response.ok) {
          const data = await response.json();
          setResourceData(data.resources || []);
          setTeamMembers(data.teamMembers || []);
        }
      } catch (error) {
        console.error("Failed to fetch resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchResources();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[240px]">
            <Skeleton className="h-[180px] w-[180px] rounded-full" />
          </div>
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (resourceData.length === 0 && teamMembers.length === 0) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Resource Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Users className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No resource data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Resource Utilization</CardTitle>
      </CardHeader>
      <CardContent>
        {resourceData.length > 0 && (
          <div className="h-[240px] w-full relative flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }: any) => (
                    <tspan>
                      {name}{" "}
                      <tspan fontWeight="bold">{(percent * 100).toFixed(0)}%</tspan>
                    </tspan>
                  )}
                  labelLine={false}
                >
                  {resourceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke="#fff"
                      strokeWidth={2}
                      cursor="pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-background border rounded-md shadow-md p-3 text-sm min-w-[120px]">
                          <p className="font-medium text-sm">{data.name}</p>
                          <p className="text-xs mt-1">
                            <span className="font-medium">Allocation:</span> {data.value}%
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ marginTop: 10, gap: 12 }}
                  iconSize={12}
                  iconType="circle"
                  formatter={(value) => <span className="text-sm font-medium">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-sm text-muted-foreground mb-1">Total Allocation</p>
              <p className="text-2xl font-bold">
                {resourceData.reduce((acc, cur) => acc + cur.value, 0)}%
              </p>
            </div>
          </div>
        )}

        {teamMembers.length > 0 && (
          <div className="mt-6">
            <h4 className="text-md font-semibold mb-4">Team Member Utilization</h4>
            <div className="space-y-4">
              {teamMembers.map((member) => {
                const statusColor =
                  member.status === "Overallocated"
                    ? "bg-red-50 text-red-700"
                    : member.status === "Underutilized"
                    ? "bg-amber-50 text-amber-700"
                    : "bg-green-50 text-green-700";

                const progressColor =
                  member.status === "Overallocated"
                    ? "bg-red-500"
                    : member.status === "Underutilized"
                    ? "bg-amber-500"
                    : "bg-green-500";

                return (
                  <div
                    key={member.id}
                    className="p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-muted/50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">({member.department})</p>
                      </div>
                      <Badge className={statusColor}>{member.status}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={member.utilization}
                        className={`flex-1 h-2 rounded-full ${progressColor}`}
                      />
                      <span className="text-xs font-medium w-10 text-right">
                        {member.utilization}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
