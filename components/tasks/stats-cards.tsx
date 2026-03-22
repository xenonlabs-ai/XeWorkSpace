import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BarChart, CheckSquare, Clock } from "lucide-react";

const stats = [
  {
    title: "Total Tasks",
    value: "42",
    subtitle: "+8 from last week",
    icon: BarChart,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    title: "Completed",
    value: "24",
    subtitle: "57% completion rate",
    icon: CheckSquare,
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    title: "Overdue",
    value: "5",
    subtitle: "-2 from last week",
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10",
  },
  {
    title: "Due Soon",
    value: "8",
    subtitle: "Due in the next 48 hours",
    icon: Clock,
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
];

export function TaskStatsCards() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      {stats.map((item, i) => {
        const Icon = item.icon;
        return (
          <Card
            key={i}
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <div
                className={`p-2 rounded-full ${item.bg} ${item.color} transition-all duration-300`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {item.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.subtitle}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
