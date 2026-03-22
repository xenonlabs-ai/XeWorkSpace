import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Plus } from "lucide-react";

export interface ReportsHeaderProps {
  onNewReportClick?: () => void;
}

export function ReportsHeader({ onNewReportClick }: ReportsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Input type="search" placeholder="Search reports..." className="w-full md:w-[200px]" />
        </div>

        <Select defaultValue="may-2025">
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="may-2025">May 2025</SelectItem>
            <SelectItem value="apr-2025">April 2025</SelectItem>
            <SelectItem value="mar-2025">March 2025</SelectItem>
            <SelectItem value="q1-2025">Q1 2025</SelectItem>
          </SelectContent>
        </Select>

        {/* <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button> */}

        <Button onClick={onNewReportClick} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          New Report
        </Button>
      </div>
    </div>
  )
}
