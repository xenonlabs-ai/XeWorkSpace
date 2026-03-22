"use client";

import { useState } from "react";
import { DepartmentComparison } from "./department-comparison";
import { ReportsHeader } from "./header";
import { NewReportDialog } from "./new-report-dialog";
import { ReportExportOptions } from "./report-export-options";
import { ReportScheduling } from "./report-scheduling";
import { ReportTemplates } from "./report-templates";
import { ReportVisualization } from "./report-visualization";
import { ReportsTabs } from "./reports-tabs";
import { TasksCompletedCard } from "./task-completed-card";
import { TeamActivityCard } from "./team-activity-card";
import TimeAllocationCard from "./time-allocation-card";

export function ReportsContent() {
  const [isNewReportOpen, setIsNewReportOpen] = useState(false);
  const reports = [
    {
      id: 1,
      name: "Weekly Activity Summary",
      description: "Summary of team activities for the past week",
      date: "May 12, 2025",
      type: "Weekly",
    },
    {
      id: 2,
      name: "Monthly Performance Report",
      description: "Team performance metrics for April 2025",
      date: "May 1, 2025",
      type: "Monthly",
    },
    {
      id: 3,
      name: "Project Completion Report",
      description: "Analysis of completed projects in Q1 2025",
      date: "April 15, 2025",
      type: "Quarterly",
    },
    {
      id: 4,
      name: "Team Productivity Insights",
      description: "Productivity trends and insights for the team",
      date: "April 10, 2025",
      type: "Monthly",
    },
    {
      id: 5,
      name: "Resource Allocation Report",
      description: "How team resources were allocated in April",
      date: "May 5, 2025",
      type: "Monthly",
    },
    {
      id: 6,
      name: "Attendance & Time Tracking",
      description: "Summary of attendance and hours worked",
      date: "May 10, 2025",
      type: "Weekly",
    },
  ];

  return (
    <>
      <ReportsHeader onNewReportClick={() => setIsNewReportOpen(true)} />
      <div className="grid gap-6 mt-6 md:grid-cols-3">
        <TasksCompletedCard />
        <TeamActivityCard />
        <TimeAllocationCard />
      </div>

      <div className="grid gap-6 mt-6 md:grid-cols-2">
        <ReportVisualization />
        <DepartmentComparison />
      </div>

      <div className="grid gap-6 mt-6 grid-cols-1 lg:grid-cols-2">
        <ReportTemplates />
        <ReportScheduling />
        <div className="lg:col-span-2">
          <ReportExportOptions />
        </div>
      </div>

      {/* <div className="mt-6">
        <CustomReportBuilder />
      </div> */}

      <div className="mt-6">
        <ReportsTabs reports={reports} />
      </div>

      <NewReportDialog
        isOpen={isNewReportOpen}
        onClose={() => setIsNewReportOpen(false)}
      />
    </>
  );
}
