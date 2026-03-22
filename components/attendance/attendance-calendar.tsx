"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function AttendanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Handle month navigation
  function handlePrevMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  }
  function handleNextMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  }
  function handleResetToToday() {
    setCurrentDate(new Date());
  }

  // Generate days for the calendar grid
  function generateDays(baseDate: Date) {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = startDay;
    const totalCells = 35;

    return Array.from({ length: totalCells }, (_, i) => {
      const dayNum = i - prevMonthDays + 1;
      const isCurrentMonth = dayNum > 0 && dayNum <= daysInMonth;
      const date = new Date(year, month, dayNum);
      return {
        date,
        isCurrentMonth,
        status: isCurrentMonth ? getRandomStatus(date) : null,
        isToday: isToday(date),
      };
    });
  }

  function isToday(date: Date) {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  // Random attendance status
  function getRandomStatus(date: Date): string | null {
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    const rand = Math.random();
    if (isWeekend) {
      if (rand < 0.6) return "absent";
      if (rand < 0.8) return "half-day";
      return "present";
    } else {
      if (rand < 0.75) return "present";
      if (rand < 0.85) return "late";
      if (rand < 0.9) return "half-day";
      return "absent";
    }
  }

  function getStatusColor(status: string | null) {
    switch (status) {
      case "present":
        return "bg-green-500/15 text-green-600";
      case "late":
        return "bg-amber-500/15 text-amber-600";
      case "half-day":
        return "bg-blue-500/15 text-blue-600";
      case "absent":
        return "bg-red-500/15 text-red-600";
      default:
        return "bg-muted text-muted-foreground";
    }
  }

  const days = generateDays(currentDate);
  const shortMonth = currentDate.toLocaleString("default", { month: "short" });
  const year = currentDate.getFullYear();

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Calendar
          </CardTitle>
          <div className="flex items-center gap-2 self-end sm:self-auto rtl:flex-row-reverse">
            <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetToToday}
              className="font-medium"
            >
              {shortMonth} {year}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Desktop view */}
        <div className="hidden sm:grid grid-cols-7 gap-2 text-center">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide"
            >
              {day}
            </div>
          ))}

          {days.map((dayObj, i) => (
            <div
              key={i}
              className={`relative min-h-[60px] rounded-xl border border-border/40 p-2 text-left transition-all
								${
                  dayObj.isCurrentMonth
                    ? "bg-background hover:bg-primary/5"
                    : "bg-muted/30 text-muted-foreground"
                }
								${dayObj.isToday ? "border-primary ring-1 ring-primary/50" : ""}
							`}
            >
              <div className="text-sm font-medium">{dayObj.date.getDate()}</div>

              {dayObj.status && (
                <div
                  className={`mt-2 text-xs px-2 py-1 rounded-md font-medium truncate ${getStatusColor(
                    dayObj.status
                  )}`}
                >
                  {dayObj.status === "half-day"
                    ? "Half Day"
                    : dayObj.status.charAt(0).toUpperCase() +
                      dayObj.status.slice(1)}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile view */}
        <div className="grid sm:hidden grid-cols-2 gap-2 mt-4">
          {days
            .filter((d) => d.isCurrentMonth)
            .map((dayObj, i) => {
              const weekday = weekDays[dayObj.date.getDay()];
              return (
                <div
                  key={i}
                  className={`p-3 rounded-lg border transition-all ${
                    dayObj.isToday
                      ? "border-primary ring-1 ring-primary/40"
                      : "border-border"
                  }`}
                >
                  <div className="text-xs text-muted-foreground font-medium">
                    {weekday}
                  </div>
                  <div className="text-base font-semibold">
                    {dayObj.date.getDate()}
                  </div>
                  {dayObj.status && (
                    <div
                      className={`mt-1 text-xs px-2 py-1 rounded-md font-medium inline-block ${getStatusColor(
                        dayObj.status
                      )}`}
                    >
                      {dayObj.status === "half-day"
                        ? "Half Day"
                        : dayObj.status.charAt(0).toUpperCase() +
                          dayObj.status.slice(1)}
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center mt-5 gap-4 text-xs">
          {[
            { color: "bg-green-500", label: "Present" },
            { color: "bg-amber-500", label: "Late" },
            { color: "bg-blue-500", label: "Half Day" },
            { color: "bg-red-500", label: "Absent" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
