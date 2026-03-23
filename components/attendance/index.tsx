"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { AttendanceCalendar } from "./attendance-calendar";
import { AttendanceTabs } from "./attendance-tabs";
import { AttendanceTrends } from "./attendance-trends";
import { AttendanceHeader } from "./header";
import { LateArrivalsAnalysis } from "./late-arrivals-analysis";
import { AttendanceStatsCards } from "./stats-cards";
import { TeamAttendanceComparison } from "./team-attendance-comparison";
import { TimeOffRequests } from "./time-off-requests";
import { WorkFromHomeTracker } from "./work-from-home-tracker";

interface AttendanceRecord {
  id: string;
  name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Late" | "Absent" | "Half Day";
  hours: string;
}

export function AttendanceContent() {
  const { data: session } = useSession();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("/api/attendance");
        if (response.ok) {
          const data = await response.json();
          setAttendanceRecords(data.records || []);
        }
      } catch (error) {
        console.error("Failed to fetch attendance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchAttendance();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  return (
    <>
      <AttendanceHeader />
      <AttendanceStatsCards />

      <div className="grid gap-6 mt-6 xl:grid-cols-2">
        <AttendanceTrends />
        <TeamAttendanceComparison />
      </div>

      <div className="grid gap-6 mt-6 grid-cols-1">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          <AttendanceTabs attendanceRecords={attendanceRecords} isLoading={isLoading} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <TimeOffRequests />
        <LateArrivalsAnalysis />
      </div>

      <div className="grid gap-6 mt-6 xl:grid-cols-2">
        <AttendanceCalendar />
        <WorkFromHomeTracker />
      </div>
    </>
  );
}
