"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Mail, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ScheduledReport {
  id: string;
  name: string;
  frequency: string;
  recipients: number;
  nextRun: string;
  delivery: string;
}

export function ReportScheduling() {
  const { data: session } = useSession();
  const [scheduledReports, setScheduledReports] = useState<ScheduledReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScheduledReports = async () => {
      try {
        const response = await fetch("/api/reports/scheduled");
        if (response.ok) {
          const data = await response.json();
          setScheduledReports(data.reports || []);
        }
      } catch (error) {
        console.error("Failed to fetch scheduled reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchScheduledReports();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <CardTitle>Scheduled Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                <Skeleton className="h-9 w-9 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (scheduledReports.length === 0) {
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
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No scheduled reports</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              key={report.id}
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
