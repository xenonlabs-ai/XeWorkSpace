"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownRight, ArrowUpRight, BarChart3, Equal } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type KPI = {
  name: string;
  value: number;
  target: number;
  change: number;
  trend: "up" | "down" | "stable";
  format?: "rating" | "hours";
  inverted?: boolean;
};

const KPI_STYLE: Record<
  string,
  { bg: string; text: string; iconBg: string; iconText: string }
> = {
  "Productivity Index": {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-900 dark:text-blue-100",
    iconBg: "bg-blue-200 dark:bg-blue-800",
    iconText: "text-blue-600 dark:text-blue-200",
  },
  "Quality Score": {
    bg: "bg-green-50 dark:bg-green-900/25",
    text: "text-green-900 dark:text-green-100",
    iconBg: "bg-green-200 dark:bg-green-800",
    iconText: "text-green-600 dark:text-green-200",
  },
  "Task Completion Rate": {
    bg: "bg-amber-50 dark:bg-amber-900/25",
    text: "text-amber-900 dark:text-amber-100",
    iconBg: "bg-amber-200 dark:bg-amber-800",
    iconText: "text-amber-600 dark:text-amber-200",
  },
  "Team Satisfaction": {
    bg: "bg-yellow-50 dark:bg-yellow-900/25",
    text: "text-yellow-900 dark:text-yellow-100",
    iconBg: "bg-yellow-200 dark:bg-yellow-800",
    iconText: "text-yellow-600 dark:text-yellow-200",
  },
  "Average Response Time": {
    bg: "bg-purple-50 dark:bg-purple-900/25",
    text: "text-purple-900 dark:text-purple-100",
    iconBg: "bg-purple-200 dark:bg-purple-800",
    iconText: "text-purple-600 dark:text-purple-200",
  },
  "Resource Utilization": {
    bg: "bg-cyan-50 dark:bg-cyan-900/25",
    text: "text-cyan-900 dark:text-cyan-100",
    iconBg: "bg-cyan-200 dark:bg-cyan-800",
    iconText: "text-cyan-600 dark:text-cyan-200",
  },
};

export function KPIScorecard() {
  const { data: session } = useSession();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const response = await fetch("/api/performance/kpis");
        if (response.ok) {
          const data = await response.json();
          setKpis(data.kpis || []);
        }
      } catch (error) {
        console.error("Failed to fetch KPIs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchKPIs();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  const formatValue = (kpi: KPI): string => {
    if (kpi.format === "rating") return `${kpi.value}/5`;
    if (kpi.format === "hours") return `${kpi.value}h`;
    return `${kpi.value}%`;
  };

  const formatTarget = (kpi: KPI): string => {
    if (kpi.format === "rating") return `${kpi.target}/5`;
    if (kpi.format === "hours") return `${kpi.target}h`;
    return `${kpi.target}%`;
  };

  const renderTrendIcon = (
    trend: KPI["trend"],
    inverted = false,
    iconColor = "text-gray-400"
  ) => {
    const baseClass = "h-4 w-4";
    switch (trend) {
      case "up":
        return (
          <ArrowUpRight
            className={`${baseClass} ${
              inverted ? "text-red-500" : iconColor
            }`}
            aria-label="Trending Up"
            strokeWidth={2.2}
            style={{ marginTop: "-1px" }}
          />
        );
      case "down":
        return (
          <ArrowDownRight
            className={`${baseClass} ${
              inverted ? "text-green-600" : iconColor
            }`}
            aria-label="Trending Down"
            strokeWidth={2.2}
            style={{ marginBottom: "-1px" }}
          />
        );
      default:
        return (
          <Equal
            className={`${baseClass} ${iconColor}`}
            aria-label="Stable"
            strokeWidth={2.2}
            style={{ marginLeft: "1px" }}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <Card className="border-none bg-transparent p-0">
        <CardHeader className="pb-3 px-0 pb-0">
          <CardTitle>KPI Scorecard</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-0">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-2xl border p-5 min-h-[124px]">
                <Skeleton className="h-3 w-24 mb-3" />
                <Skeleton className="h-10 w-20 mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-10" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (kpis.length === 0) {
    return (
      <Card className="border-none bg-transparent p-0">
        <CardHeader className="pb-3 px-0 pb-0">
          <CardTitle>KPI Scorecard</CardTitle>
        </CardHeader>
        <CardContent className="px-0 pt-0 pb-0">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <BarChart3 className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No KPI data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none bg-transparent p-0">
      <CardHeader className="pb-3 px-0 pb-0">
        <CardTitle>KPI Scorecard</CardTitle>
      </CardHeader>
      <CardContent className="px-0 pt-0 pb-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => {
            const style = KPI_STYLE[kpi.name] ?? {
              bg: "bg-muted/50",
              text: "text-foreground",
              iconBg: "bg-muted/70",
              iconText: "text-muted-foreground",
            };
            return (
              <div
                key={kpi.name}
                className={`relative rounded-2xl ${style.bg} flex flex-col px-5 py-4 border border-border min-h-[124px] justify-between transition-colors`}
                style={{
                  boxShadow: "none",
                }}
              >
                <div className="absolute right-4 top-4 rtl:left-4 rtl:right-auto">
                  <div
                    className={`flex items-center justify-center rounded-full shadow-sm ${style.iconBg} p-1.5`}
                  >
                    {renderTrendIcon(
                      kpi.trend,
                      kpi.inverted,
                      kpi.trend === "up"
                        ? kpi.inverted
                          ? "text-red-500"
                          : style.iconText
                        : kpi.trend === "down"
                        ? kpi.inverted
                          ? "text-green-600"
                          : "text-red-500"
                        : style.iconText
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-0.5 mb-3 pt-1">
                  <span
                    className={`text-[11px] font-medium uppercase tracking-widest leading-tight select-none ${style.text} opacity-80`}
                  >
                    {kpi.name}
                  </span>
                  <span
                    className={`text-[2rem] font-extrabold leading-tight break-words ${style.text}`}
                    style={{ minHeight: "2.2rem" }}
                  >
                    {formatValue(kpi)}
                  </span>
                </div>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Target:{" "}
                    <span className={`font-semibold ${style.text}`}>
                      {formatTarget(kpi)}
                    </span>
                  </span>
                  <span className="flex items-center gap-1 min-w-[64px]">
                    <span
                      className={`text-xs font-bold tracking-wide ml-0.5 ${
                        kpi.trend === "up"
                          ? kpi.inverted
                            ? "text-red-500"
                            : style.iconText
                          : kpi.trend === "down"
                          ? kpi.inverted
                            ? "text-green-600"
                            : "text-red-500"
                          : "text-gray-500"
                      }`}
                    >
                      {kpi.change > 0 ? "+" : ""}
                      {kpi.change}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
