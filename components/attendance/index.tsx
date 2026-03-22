import { AttendanceCalendar } from "./attendance-calendar";
import { AttendanceTabs } from "./attendance-tabs";
import { AttendanceTrends } from "./attendance-trends";
import { AttendanceHeader } from "./header";
import { LateArrivalsAnalysis } from "./late-arrivals-analysis";
import { AttendanceStatsCards } from "./stats-cards";
import { TeamAttendanceComparison } from "./team-attendance-comparison";
import { TimeOffRequests } from "./time-off-requests";
import { WorkFromHomeTracker } from "./work-from-home-tracker";

export function AttendanceContent() {
  const attendanceRecords: {
    id: number;
    name: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: "Present" | "Late" | "Absent" | "Half Day";
    hours: string;
  }[] = [
    {
      id: 1,
      name: "John Smith",
      date: "May 18, 2025",
      checkIn: "8:45 AM",
      checkOut: "5:30 PM",
      status: "Present",
      hours: "8h 45m",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      date: "May 18, 2025",
      checkIn: "9:05 AM",
      checkOut: "5:45 PM",
      status: "Present",
      hours: "8h 40m",
    },
    {
      id: 3,
      name: "Michael Brown",
      date: "May 18, 2025",
      checkIn: "8:30 AM",
      checkOut: "4:30 PM",
      status: "Present",
      hours: "8h 00m",
    },
    {
      id: 4,
      name: "Emily Davis",
      date: "May 18, 2025",
      checkIn: "10:15 AM",
      checkOut: "6:30 PM",
      status: "Late",
      hours: "8h 15m",
    },
    {
      id: 5,
      name: "David Wilson",
      date: "May 18, 2025",
      checkIn: "--",
      checkOut: "--",
      status: "Absent",
      hours: "--",
    },
    {
      id: 6,
      name: "Jennifer Lee",
      date: "May 18, 2025",
      checkIn: "8:55 AM",
      checkOut: "5:50 PM",
      status: "Present",
      hours: "8h 55m",
    },
    {
      id: 7,
      name: "Robert Taylor",
      date: "May 18, 2025",
      checkIn: "9:00 AM",
      checkOut: "3:30 PM",
      status: "Half Day",
      hours: "6h 30m",
    },
  ];

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
          <AttendanceTabs attendanceRecords={attendanceRecords} />
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
