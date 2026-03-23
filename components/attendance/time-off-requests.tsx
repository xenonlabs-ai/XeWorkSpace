"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface TimeOffRequest {
  id: string;
  employee: string;
  type: string;
  dates: string;
  status: "Approved" | "Pending" | "Rejected";
}

export function TimeOffRequests() {
  const { data: session } = useSession();
  const [requests, setRequests] = useState<TimeOffRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/attendance/time-off-requests");
        if (response.ok) {
          const data = await response.json();
          setRequests(data.requests || []);
        }
      } catch (error) {
        console.error("Failed to fetch time off requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchRequests();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Time Off Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time Off Requests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Calendar className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No time off requests</p>
            </div>
          ) : (
            requests.map((request) => (
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
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
