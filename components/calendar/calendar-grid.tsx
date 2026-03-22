"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

type Day = {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasEvents: boolean;
  weekDay: string;
  eventList?: { time: string; title: string; color: string }[];
};

export function CalendarGrid() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate days dynamically
  const generateDays = (baseDate: Date): Day[] => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: Day[] = [];

    // Previous month filler
    for (let i = startDay - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({
        date: d.getDate(),
        isCurrentMonth: false,
        isToday: false,
        hasEvents: false,
        weekDay: weekDays[d.getDay()],
      });
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
      const d = new Date(year, month, i);
      const isToday =
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear();

      const hasEvents = [4, 8, 12, 15, 20, 25].includes(i);
      const eventList = hasEvents
        ? ([
            {
              time: "9:00 AM",
              title: "Team Meeting",
              color: "text-primary bg-primary/10",
            },
            i === 15
              ? {
                  time: "2:00 PM",
                  title: "Project Review",
                  color: "text-blue-500 bg-blue-500/10",
                }
              : null,
          ].filter(Boolean) as { time: string; title: string; color: string }[])
        : [];

      days.push({
        date: i,
        isCurrentMonth: true,
        isToday,
        hasEvents,
        weekDay: weekDays[d.getDay()],
        eventList,
      });
    }

    // Next month filler to complete grid
    while (days.length % 7 !== 0) {
      const d = new Date(
        year,
        month + 1,
        days.length - totalDays - startDay + 1
      );
      days.push({
        date: d.getDate(),
        isCurrentMonth: false,
        isToday: false,
        hasEvents: false,
        weekDay: weekDays[d.getDay()],
      });
    }

    return days;
  };

  const days = generateDays(currentMonth);

  const goToPrevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const goToNextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  const goToToday = () => setCurrentMonth(today);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {currentMonth.toLocaleString("default", { month: "long" })}{" "}
            {currentMonth.getFullYear()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevMonth}
              className="hover:bg-primary/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToToday}
              className="font-medium"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNextMonth}
              className="hover:bg-primary/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Show weekday header on medium+ screens */}
        <div className="hidden md:grid grid-cols-7 gap-2 text-center mb-1">
          {weekDays.map((day) => (
            <div
              key={day}
              className="py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-left">
          {days.map((day, i) => (
            <div
              key={i}
              className={`relative min-h-[100px] rounded-xl border border-border/40 p-2 transition-all flex flex-col
                ${
                  day.isCurrentMonth
                    ? "bg-background hover:bg-primary/5"
                    : "bg-muted/30 text-muted-foreground"
                }
                ${day.isToday ? "border-primary ring-1 ring-primary/50" : ""}`}
            >
              {/* Weekday on top for small screens */}
              <div className="block md:hidden text-[10px] text-muted-foreground mb-0.5 text-center">
                {day.weekDay}
              </div>

              {/* Date number */}
              <div
                className={`text-sm font-medium ${
                  day.isToday ? "text-primary" : "text-foreground"
                }`}
              >
                {day.date > 0 ? day.date : 31 + day.date}
              </div>

              {/* Events */}
              {day.hasEvents && day.isCurrentMonth && (
                <div className="mt-2 space-y-1">
                  {day.eventList?.map((event, idx) => (
                    <div
                      key={idx}
                      className={`text-[11px] px-2 py-1 rounded-md font-medium truncate ${event.color}`}
                    >
                      {event.time} — {event.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
