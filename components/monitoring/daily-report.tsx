"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  Clock,
  Monitor,
  Globe,
  TrendingUp,
  Coffee,
  ChevronLeft,
  ChevronRight,
  Download,
  Users,
  BarChart3,
} from "lucide-react";

interface Application {
  name: string;
  count: number;
  duration: number;
  category: string;
}

interface Website {
  name: string;
  count: number;
  duration: number;
}

interface UserReport {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
    department?: string;
    jobTitle?: string;
  };
  date: string;
  totalActiveMinutes: number;
  totalIdleMinutes: number;
  screenshotCount: number;
  applications: Application[];
  websites: Website[];
  productivityScore: number;
  firstActivity: string | null;
  lastActivity: string | null;
}

interface DailyReportData {
  date: string;
  reports: UserReport[];
  summary: {
    totalUsers: number;
    totalActiveMinutes: number;
    totalIdleMinutes: number;
    averageProductivity: number;
  };
}

export function DailyReport() {
  const [data, setData] = useState<DailyReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({ date: selectedDate });
      if (selectedUser !== "all") {
        params.set("userId", selectedUser);
      }

      const res = await fetch(`/api/monitoring/reports/daily?${params}`);
      if (!res.ok) throw new Error("Failed to fetch report");

      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching daily report:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate, selectedUser]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const goToDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTime = (isoString: string | null) => {
    if (!isoString) return "-";
    return new Date(isoString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "development":
        return "bg-blue-500";
      case "productive":
        return "bg-green-500";
      case "browser":
        return "bg-yellow-500";
      case "entertainment":
        return "bg-red-500";
      case "system":
        return "bg-gray-500";
      default:
        return "bg-purple-500";
    }
  };

  const getProductivityColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Daily Activity Report
          </h2>
          <p className="text-muted-foreground">
            Detailed breakdown of employee activity
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => goToDate(-1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none outline-none"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => goToDate(1)}
            disabled={selectedDate >= new Date().toISOString().split("T")[0]}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {data && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-2xl font-bold">{data.summary.totalUsers}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Active Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold">
                  {formatDuration(data.summary.totalActiveMinutes)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Idle Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-orange-500" />
                <span className="text-2xl font-bold">
                  {formatDuration(data.summary.totalIdleMinutes)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg Productivity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <span className={`text-2xl font-bold ${getProductivityColor(data.summary.averageProductivity)}`}>
                  {data.summary.averageProductivity}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Employee Reports */}
      {data && data.reports.length > 0 ? (
        <div className="space-y-4">
          {data.reports.map((report) => (
            <Card key={report.user.id} className="overflow-hidden">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() =>
                  setExpandedUser(
                    expandedUser === report.user.id ? null : report.user.id
                  )
                }
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={report.user.avatar} />
                      <AvatarFallback>
                        {report.user.firstName[0]}
                        {report.user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">
                        {report.user.firstName} {report.user.lastName}
                      </CardTitle>
                      <CardDescription>
                        {report.user.jobTitle || report.user.department || report.user.email}
                      </CardDescription>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="text-muted-foreground">Active</p>
                      <p className="font-semibold text-green-600">
                        {formatDuration(report.totalActiveMinutes)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Idle</p>
                      <p className="font-semibold text-orange-600">
                        {formatDuration(report.totalIdleMinutes)}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Screenshots</p>
                      <p className="font-semibold">{report.screenshotCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Productivity</p>
                      <p className={`font-semibold ${getProductivityColor(report.productivityScore)}`}>
                        {report.productivityScore}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-muted-foreground">Hours</p>
                      <p className="font-semibold text-xs">
                        {formatTime(report.firstActivity)} - {formatTime(report.lastActivity)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Productivity Progress Bar */}
                <div className="mt-4">
                  <Progress
                    value={report.productivityScore}
                    className="h-2"
                  />
                </div>
              </CardHeader>

              {/* Expanded Details */}
              {expandedUser === report.user.id && (
                <CardContent className="border-t bg-muted/30">
                  <Tabs defaultValue="apps" className="mt-4">
                    <TabsList>
                      <TabsTrigger value="apps" className="gap-2">
                        <Monitor className="h-4 w-4" />
                        Applications
                      </TabsTrigger>
                      <TabsTrigger value="websites" className="gap-2">
                        <Globe className="h-4 w-4" />
                        Websites
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="apps" className="mt-4">
                      {report.applications.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Application</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead className="text-right">Duration</TableHead>
                              <TableHead className="text-right">Switches</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {report.applications.slice(0, 15).map((app, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">{app.name}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className={`${getCategoryColor(app.category)} text-white`}
                                  >
                                    {app.category}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatDuration(Math.round(app.duration / 60))}
                                </TableCell>
                                <TableCell className="text-right">{app.count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No application data available
                        </p>
                      )}
                    </TabsContent>

                    <TabsContent value="websites" className="mt-4">
                      {report.websites.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Website</TableHead>
                              <TableHead className="text-right">Duration</TableHead>
                              <TableHead className="text-right">Visits</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {report.websites.map((site, idx) => (
                              <TableRow key={idx}>
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                    {site.name}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right">
                                  {formatDuration(Math.round(site.duration / 60))}
                                </TableCell>
                                <TableCell className="text-right">{site.count}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <p className="text-muted-foreground text-center py-8">
                          No website data available
                        </p>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No activity data available for this date</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
