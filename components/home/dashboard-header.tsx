"use client";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker"; // ✅ Import this

export function DashboardHeader() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2025, 4, 11),
    to: new Date(2025, 4, 18),
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  //   const [selectedRange, setSelectedRange] = useState("Last 7 days");

  //   const dateRanges = [
  //     { name: "Today", value: "today" },
  //     { name: "Yesterday", value: "yesterday" },
  //     { name: "Last 7 days", value: "last7days" },
  //     { name: "Last 30 days", value: "last30days" },
  //     { name: "This month", value: "thismonth" },
  //     { name: "Last month", value: "lastmonth" },
  //     { name: "Custom range", value: "custom" },
  //   ];

  const handleRangeSelect = (rangeName: string) => {
    // setSelectedRange(rangeName);
    setIsCalendarOpen(rangeName === "Custom range");
  };

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0 mb-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team Dashboard</h1>
        
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start text-left font-normal"
            >
              <Calendar className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "d-M-yy")} to {format(date.to, "d-M-yy")}
                  </>
                ) : (
                  format(date.from, "d-M-yy")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={(newDate: DateRange | undefined) => {
                setDate(newDate);
                if (newDate?.to) {
                  setIsCalendarOpen(false);
                }
              }}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>

        {/* <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {selectedRange}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {dateRanges.map((range) => (
              <DropdownMenuItem
                key={range.value}
                onClick={() => handleRangeSelect(range.name)}
                className={cn(
                  "cursor-pointer",
                  selectedRange === range.name && "font-medium"
                )}
              >
                {range.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu> */}
        <Button size="sm">Export</Button>
      </div>
    </div>
  );
}
