"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3, Calendar, CheckSquare, FileText, LucideIcon, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const iconMap: Record<string, LucideIcon> = {
  BarChart3: BarChart3,
  Calendar: Calendar,
  CheckSquare: CheckSquare,
  Users: Users,
  FileText: FileText,
};

export function ReportTemplates() {
  const { data: session } = useSession();
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch("/api/reports/templates");
        if (response.ok) {
          const data = await response.json();
          setTemplates(data.templates || []);
        }
      } catch (error) {
        console.error("Failed to fetch report templates:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchTemplates();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 border rounded-lg">
                <Skeleton className="h-8 w-8 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (templates.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Report Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No report templates available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Report Templates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {templates.map((template) => {
            const Icon = iconMap[template.icon] || FileText;
            return (
              <div
                key={template.id}
                className="flex flex-col sm:flex-row sm:items-start gap-3 p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`p-2 rounded-md ${template.color} shrink-0`}>
                    <Icon className="h-4 w-4" />
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
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
