import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function TimeOffRequests() {
  // Sample time off requests
  const requests = [
    {
      id: 1,
      employee: "Sarah Johnson",
      type: "Vacation",
      dates: "May 25-28, 2025",
      status: "Approved",
    },
    {
      id: 2,
      employee: "Michael Brown",
      type: "Sick Leave",
      dates: "May 20, 2025",
      status: "Pending",
    },
    {
      id: 3,
      employee: "Emily Davis",
      type: "Personal",
      dates: "Jun 5-6, 2025",
      status: "Pending",
    },
    {
      id: 4,
      employee: "Stuart Lee",
      type: "Sick Leave",
      dates: "May 20, 2025",
      status: "Pending",
    },
    {
      id: 5,
      employee: "Kalim Dad",
      type: "Personal",
      dates: "Jun 5-6, 2025",
      status: "Pending",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Off Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="flex items-start gap-3 p-3 border rounded-lg"
            >
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h4 className="font-medium text-sm">{request.employee}</h4>
                    <div className="text-xs text-muted-foreground">
                      {request.type} • {request.dates}
                    </div>
                  </div>
                  <Badge
                    variant={
                      request.status === "Approved"
                        ? "outline"
                        : request.status === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className="text-xs self-start sm:self-center"
                  >
                    {request.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}

          {requests.length === 0 && (
            <div className="text-center py-4 text-muted-foreground">
              No time off requests
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
