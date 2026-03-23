"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  ArrowUpRight,
  Lightbulb,
  LucideIcon,
  TrendingUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Insight {
  id: string;
  type: "positive" | "opportunity" | "attention";
  title: string;
  description: string;
  icon: string;
}

const iconMap: Record<string, LucideIcon> = {
  TrendingUp: TrendingUp,
  Lightbulb: Lightbulb,
  AlertTriangle: AlertTriangle,
};

export function PerformanceInsights() {
  const { data: session } = useSession();
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await fetch("/api/performance/insights");
        if (response.ok) {
          const data = await response.json();
          setInsights(data.insights || []);
        }
      } catch (error) {
        console.error("Failed to fetch insights:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchInsights();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const getInsightStyles = (type: "positive" | "opportunity" | "attention") => {
    switch (type) {
      case "positive":
        return {
          bgColor: "bg-green-50",
          iconColor: "text-green-500",
          borderColor: "border-green-200",
        };
      case "opportunity":
        return {
          bgColor: "bg-blue-50",
          iconColor: "text-blue-500",
          borderColor: "border-blue-200",
        };
      case "attention":
        return {
          bgColor: "bg-amber-50",
          iconColor: "text-amber-500",
          borderColor: "border-amber-200",
        };
      default:
        return {
          bgColor: "bg-gray-50",
          iconColor: "text-gray-500",
          borderColor: "border-gray-200",
        };
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-lg border">
                <div className="flex gap-3 items-start">
                  <Skeleton className="h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card>
        <CardHeader className="flex items-center justify-between pb-2">
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Lightbulb className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No insights available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle>Performance Insights</CardTitle>
        <button className="text-sm text-primary flex items-center gap-1 hover:underline">
          View All <ArrowUpRight className="h-3 w-3" />
        </button>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {insights.map((insight) => {
            const styles = getInsightStyles(insight.type);
            const Icon = iconMap[insight.icon] || Lightbulb;
            return (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border ${styles.borderColor} ${styles.bgColor} hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex gap-3 items-start">
                  <div
                    className={`shrink-0 mt-1 p-2 rounded-full bg-white shadow-sm ${styles.iconColor}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium">{insight.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      {insight.description}
                    </p>
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
