"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Department {
  name: string;
  productivity: number;
  tasks: number;
  quality: number;
}

export function DepartmentComparison() {
  const { data: session } = useSession();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch("/api/reports/department-comparison");
        if (response.ok) {
          const data = await response.json();
          setDepartments(data.departments || []);
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchDepartments();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full mb-4" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-2.5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (departments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Department Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Building2 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No department data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxTasks = Math.max(...departments.map((d) => d.tasks), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="productivity">
          <TabsList className="mb-4">
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
          </TabsList>

          <TabsContent value="productivity">
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dept.name}</span>
                    <span>{dept.productivity}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-secondary rounded-full h-2.5"
                      style={{ width: `${dept.productivity}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dept.name}</span>
                    <span>{dept.tasks} tasks</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary rounded-full h-2.5"
                      style={{ width: `${(dept.tasks / maxTasks) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quality">
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dept.name}</span>
                    <span>{dept.quality}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-amber-500 rounded-full h-2.5"
                      style={{ width: `${dept.quality}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
