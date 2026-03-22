import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Clock } from "lucide-react";

export function UpcomingDeadlines() {
  const deadlines = [
    {
      task: "Website redesign homepage",
      dueDate: "Today",
      priority: "High",
      assignee: "Alex J.",
    },
    {
      task: "Content creation for blog",
      dueDate: "Tomorrow",
      priority: "Medium",
      assignee: "Emily R.",
    },
    {
      task: "Fix navigation bug",
      dueDate: "In 2 days",
      priority: "High",
      assignee: "Michael C.",
    },
    {
      task: "Client presentation",
      dueDate: "In 3 days",
      priority: "Medium",
      assignee: "Samantha L.",
    },
    {
      task: "Client presentation",
      dueDate: "In 3 days",
      priority: "Medium",
      assignee: "Samantha L.",
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex items-center justify-between pb-2">
        <CardTitle>Upcoming Deadlines</CardTitle>
        <Button variant="ghost" size="sm" className="gap-1 text-xs">
          View all <ArrowRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {deadlines.map((item, index) => (
          <div
            key={index}
            className="flex items-start flex-wrap gap-3 py-3 px-1 rounded-lg border border-muted/30 hover:shadow-md transition-shadow bg-background"
          >
            <div className="shrink-0 bg-primary/10 p-2 rounded-full flex items-center justify-center">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <h4 className="font-medium text-sm truncate">{item.task}</h4>
                  <div className="text-xs text-muted-foreground">
                    Due: {item.dueDate} • Assigned to: {item.assignee}
                  </div>
                </div>
                <Badge
                  variant={
                    item.priority === "High" ? "destructive" : "secondary"
                  }
                  className="text-xs md:ml-auto mt-1 md:mt-0"
                >
                  {item.priority}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
