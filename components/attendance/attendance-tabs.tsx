
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface AttendanceRecord {
  id: string;
  name: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Late" | "Absent" | "Half Day";
  hours: string;
}

interface AttendanceTabsProps {
  attendanceRecords: AttendanceRecord[];
  isLoading?: boolean;
}

// Reusable status badge for mobile & desktop
function StatusBadge({ status }: { status: AttendanceRecord["status"] }) {
  let colorClass = "";
  switch (status) {
    case "Present":
      colorClass = "bg-green-100 text-green-800";
      break;
    case "Late":
      colorClass = "bg-amber-100 text-amber-800";
      break;
    case "Absent":
      colorClass = "bg-red-100 text-red-800";
      break;
    case "Half Day":
      colorClass = "bg-blue-100 text-blue-800";
      break;
    default:
      colorClass = "bg-muted";
  }
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
}

export function AttendanceTabs({ attendanceRecords, isLoading }: AttendanceTabsProps) {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle>Daily Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          <div>
            <CardTitle>Daily Attendance</CardTitle>
            <CardDescription>
              Attendance records for May 18, 2025 
            </CardDescription>
          </div>

          {/* Summary Legend */}
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span>Present: 5</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Late: 1</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span>Absent: 1</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto focus:border-ring">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="present">Present</SelectItem>
              <SelectItem value="late">Late</SelectItem>
              <SelectItem value="absent">Absent</SelectItem>
              <SelectItem value="half-day">Half Day</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {/* DESKTOP TABLE */}
        <div className="hidden sm:block overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent mt-4">
          <Table className="w-full table-auto">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Check In</TableHead>
                <TableHead>Check Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Hours</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.name}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.checkIn}</TableCell>
                  <TableCell>{record.checkOut}</TableCell>
                  <TableCell>
                    <StatusBadge status={record.status} />
                  </TableCell>
                  <TableCell>{record.hours}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* MOBILE STACKED CARDS */}
        <div className="block sm:hidden mt-4 space-y-3">
          {attendanceRecords.map((record) => (
            <div
              key={record.id}
              className="relative rounded-lg border border-border bg-background p-3 flex flex-col gap-2 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-sm">{record.name}</span>
                <StatusBadge status={record.status} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Date:</span>{" "}
                  {record.date}
                </div>
                <div>
                  <span className="font-medium text-foreground">Check In:</span>{" "}
                  {record.checkIn}
                </div>
                <div>
                  <span className="font-medium text-foreground">
                    Check Out:
                  </span>{" "}
                  {record.checkOut}
                </div>
                <div>
                  <span className="font-medium text-foreground">Hours:</span>{" "}
                  {record.hours}
                </div>
              </div>
              <div className="flex justify-end mt-1">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
