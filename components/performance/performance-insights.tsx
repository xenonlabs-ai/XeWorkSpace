import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertTriangle,
    ArrowUpRight,
    Lightbulb,
    TrendingUp,
} from "lucide-react";

export function PerformanceInsights() {
  const insights: {
    id: number;
    type: "positive" | "opportunity" | "attention";
    title: string;
    description: string;
    icon: typeof TrendingUp;
  }[] = [
    {
      id: 1,
      type: "positive",
      title: "Productivity Increase",
      description:
        "Team productivity has increased by 12% compared to last month, primarily in the development department.",
      icon: TrendingUp,
    },
    {
      id: 2,
      type: "opportunity",
      title: "Skill Development Opportunity",
      description:
        "Investing in TypeScript training could improve code quality and reduce bugs by an estimated 15%.",
      icon: Lightbulb,
    },
    {
      id: 3,
      type: "attention",
      title: "Task Completion Delays",
      description:
        "The design team is experiencing delays in task completion. Consider redistributing workload or adding resources.",
      icon: AlertTriangle,
    },
  ];

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
            return (
              <div
                key={insight.id}
                className={`p-4 rounded-lg border ${styles.borderColor} ${styles.bgColor} hover:shadow-md transition-shadow duration-200`}
              >
                <div className="flex gap-3 items-start">
                  <div
                    className={`shrink-0 mt-1 p-2 rounded-full bg-white shadow-sm ${styles.iconColor}`}
                  >
                    <insight.icon className="h-5 w-5" />
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
