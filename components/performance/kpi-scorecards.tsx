import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Equal } from "lucide-react"

type KPI = {
  name: string
  value: number
  target: number
  change: number
  trend: "up" | "down" | "stable"
  format?: "rating" | "hours"
  inverted?: boolean
}

const KPI_STYLE: Record<
  string,
  { bg: string; text: string; iconBg: string; iconText: string }
> = {
  "Productivity Index": {
    bg: "bg-blue-50 dark:bg-blue-900/30",
    text: "text-blue-900 dark:text-blue-100",
    iconBg: "bg-blue-200 dark:bg-blue-800",
    iconText: "text-blue-600 dark:text-blue-200"
  },
  "Quality Score": {
    bg: "bg-green-50 dark:bg-green-900/25",
    text: "text-green-900 dark:text-green-100",
    iconBg: "bg-green-200 dark:bg-green-800",
    iconText: "text-green-600 dark:text-green-200"
  },
  "Task Completion Rate": {
    bg: "bg-amber-50 dark:bg-amber-900/25",
    text: "text-amber-900 dark:text-amber-100",
    iconBg: "bg-amber-200 dark:bg-amber-800",
    iconText: "text-amber-600 dark:text-amber-200"
  },
  "Team Satisfaction": {
    bg: "bg-yellow-50 dark:bg-yellow-900/25",
    text: "text-yellow-900 dark:text-yellow-100",
    iconBg: "bg-yellow-200 dark:bg-yellow-800",
    iconText: "text-yellow-600 dark:text-yellow-200"
  },
  "Average Response Time": {
    bg: "bg-purple-50 dark:bg-purple-900/25",
    text: "text-purple-900 dark:text-purple-100",
    iconBg: "bg-purple-200 dark:bg-purple-800",
    iconText: "text-purple-600 dark:text-purple-200"
  },
  "Resource Utilization": {
    bg: "bg-cyan-50 dark:bg-cyan-900/25",
    text: "text-cyan-900 dark:text-cyan-100",
    iconBg: "bg-cyan-200 dark:bg-cyan-800",
    iconText: "text-cyan-600 dark:text-cyan-200"
  },
}

export function KPIScorecard() {
  const kpis: KPI[] = [
    {
      name: "Productivity Index",
      value: 87,
      target: 85,
      change: 5.2,
      trend: "up",
    },
    { name: "Quality Score", value: 92, target: 90, change: 2.8, trend: "up" },
    {
      name: "Task Completion Rate",
      value: 78,
      target: 80,
      change: -1.5,
      trend: "down",
    },
    {
      name: "Team Satisfaction",
      value: 4.2,
      target: 4.0,
      change: 0.3,
      trend: "up",
      format: "rating",
    },
    // {
    //   name: "Average Response Time",
    //   value: 2.4,
    //   target: 2.0,
    //   change: -0.2,
    //   trend: "down",
    //   format: "hours",
    //   inverted: true,
    // },
    // {
    //   name: "Resource Utilization",
    //   value: 85,
    //   target: 85,
    //   change: 0,
    //   trend: "stable",
    // },
  ]

  const formatValue = (kpi: KPI): string => {
    if (kpi.format === "rating") return `${kpi.value}/5`
    if (kpi.format === "hours") return `${kpi.value}h`
    return `${kpi.value}%`
  }

  const formatTarget = (kpi: KPI): string => {
    if (kpi.format === "rating") return `${kpi.target}/5`
    if (kpi.format === "hours") return `${kpi.target}h`
    return `${kpi.target}%`
  }

  const isMeetingTarget = (kpi: KPI): boolean =>
    kpi.inverted ? kpi.value <= kpi.target : kpi.value >= kpi.target

  // Trend icon, color matches text for legibility
  const renderTrendIcon = (trend: KPI["trend"], inverted = false, iconColor = "text-gray-400") => {
    const baseClass = "h-4 w-4"
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
        )
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
        )
      default:
        return (
          <Equal
            className={`${baseClass} ${iconColor}`}
            aria-label="Stable"
            strokeWidth={2.2}
            style={{ marginLeft: "1px" }}
          />
        )
    }
  }

  return (
    <Card className="border-none bg-transparent p-0">
      <CardHeader className="pb-3 px-0 pb-0">
        <CardTitle>
          KPI Scorecard
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 pt-0 pb-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((kpi) => {
            const positive = isMeetingTarget(kpi)
            const style = KPI_STYLE[kpi.name] ?? {
              bg: "bg-muted/50",
              text: "text-foreground",
              iconBg: "bg-muted/70",
              iconText: "text-muted-foreground"
            }
            return (
              <div
                key={kpi.name}
                className={`relative rounded-2xl ${style.bg} flex flex-col px-5 py-4 border border-border min-h-[124px] justify-between transition-colors`}
                style={{
                  boxShadow: "none",
                }}
              >
                {/* Top right icon & trend */}
                <div className="absolute right-4 top-4 rtl:left-4 rtl:right-auto">
                  <div
                    className={`flex items-center justify-center rounded-full shadow-sm ${style.iconBg} p-1.5`}
                  >
                    {renderTrendIcon(
                      kpi.trend,
                      kpi.inverted,
                      // Always match icon color to box theme for visibility
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
                    {/* change number color matches trend */}
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
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
