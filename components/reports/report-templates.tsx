import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, CheckSquare, Users } from "lucide-react";

export function ReportTemplates() {
  // Sample report templates
  const templates = [
    {
      name: "Team Performance",
      description: "Overall team productivity and performance metrics",
      icon: BarChart3,
      color: "bg-blue-100 text-blue-700",
    },
    {
      name: "Attendance Summary",
      description: "Team attendance and time tracking analysis",
      icon: Calendar,
      color: "bg-green-100 text-green-700",
    },
    {
      name: "Task Completion",
      description: "Task completion rates and timelines",
      icon: CheckSquare,
      color: "bg-amber-100 text-amber-700",
    },
    {
      name: "Team Member Analysis",
      description: "Individual performance and contribution metrics",
      icon: Users,
      color: "bg-purple-100 text-purple-700",
    },
    {
      name: "Job Allocation",
      description: "Team attendance and time tracking analysis",
      icon: Calendar,
      color: "bg-green-100 text-green-700",
    },
    {
      name: "New Product Launched",
      description: "Team attendance and time tracking analysis",
      icon: Calendar,
      color: "bg-green-100 text-green-700",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {templates.map((template) => (
            <div
              key={template.name}
              className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className={`p-2 rounded-md ${template.color} shrink-0`}>
                  <template.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{template.name}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0">
                Use
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
