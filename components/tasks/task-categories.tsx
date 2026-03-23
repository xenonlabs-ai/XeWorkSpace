"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FolderKanban } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Category {
  name: string;
  count: number;
  color: string;
}

export function TaskCategories() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/tasks/categories");
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to fetch task categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchCategories();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-1.5 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Task Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FolderKanban className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No categories available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const total = categories.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Categories</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {categories.map((category) => {
            const percentage = total > 0 ? Math.round((category.count / total) * 100) : 0;

            return (
              <div key={category.name} className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-foreground/90">
                    {category.name}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {category.count} tasks ({percentage}%)
                  </span>
                </div>

                {/* Animated Progress Bar */}
                <div className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute left-0 top-0 h-1.5 rounded-full transition-all duration-700 ease-in-out"
                    style={{
                      width: `${percentage}%`,
                      background: category.color,
                      boxShadow: `0 0 10px ${category.color}66`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total Summary */}
        <div className="pt-5 text-center border-t">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{total}</span> total
            tasks distributed across categories
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
