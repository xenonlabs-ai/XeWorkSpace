

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TaskCardProps {
  index: number;
}

export function TaskCard({ index }: TaskCardProps) {
  const taskTitles = [
  "Website redesign",
  "Content creation",
  "Bug fixes",
  "Feature implementation",
  "Client meeting",
  "Project deployment"
];

const taskDescriptions = [
  "High priority task that needs immediate attention",
  "Medium priority task to be completed this week",
  "Low priority task that can be scheduled later",
  "Task assigned by the project manager",
  "Regular maintenance task",
  "Final deployment and review process"
];


  const dueDates = [
    "Today",
    "Tomorrow",
    "In 3 days",
    "Next week",
    "In 2 weeks",
  ];

  const statusColors = [
    "text-red-500",
    "text-amber-500",
    "text-green-500",
    "text-blue-500",
  ];
  const statuses = ["Overdue", "At risk", "On track", "Completed"];

  const dotColors = ["bg-red-500", "bg-amber-500", "bg-green-500"];

  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap flex-col xl:flex-row items-start justify-between gap-4 sm:space-y-4 md:space-y-0">
          <div className="flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${dotColors[index % 3]}`}
              ></div>
              <h3 className="font-medium">
                Task #{index + 1}: {taskTitles[index % taskTitles.length]}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {taskDescriptions[index % taskDescriptions.length]}
            </p>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs">
              <span className="text-muted-foreground">
                Assigned to: Team Member {(index % 3) + 1}
              </span>
              <span className="text-muted-foreground">
                Due: {dueDates[index % dueDates.length]}
              </span>
              <span className={statusColors[index % statusColors.length]}>
                {statuses[index % statuses.length]}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button variant="outline" size="sm">
              Complete
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
