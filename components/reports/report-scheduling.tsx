import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Mail, Plus } from "lucide-react";

export function ReportScheduling() {
  // Sample scheduled reports
  const scheduledReports = [
    {
      name: "Weekly Team Summary",
      frequency: "Every Monday at 8:00 AM",
      recipients: 5,
      nextRun: "May 20, 2025",
      delivery: "Email",
    },
    {
      name: "Monthly Performance",
      frequency: "1st of each month",
      recipients: 3,
      nextRun: "June 1, 2025",
      delivery: "Email",
    },
    {
      name: "Daily Task Report",
      frequency: "Every weekday at 5:00 PM",
      recipients: 8,
      nextRun: "May 18, 2025",
      delivery: "Email",
    },
    {
      name: "Emplyee task allocated",
      frequency: "Every weekday at 5:00 PM",
      recipients: 8,
      nextRun: "May 18, 2025",
      delivery: "Email",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <CardTitle>Scheduled Reports</CardTitle>
        <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0">
          <Plus className="h-3 w-3 mr-1" />
          Schedule New
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {scheduledReports.map((report) => (
            <div
              key={report.name}
              className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 border rounded-lg"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="bg-primary/10 p-2 rounded-full shrink-0">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{report.name}</h4>
                  <div className="text-xs text-muted-foreground mt-1">
                    {report.frequency}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2.5">
                    <Badge variant="outline" className="text-xs">
                      <Mail className="h-3 w-3 mr-1" />
                      {report.recipients} recipients
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      Next: {report.nextRun}
                    </span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full sm:w-auto shrink-0">
                Edit
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
