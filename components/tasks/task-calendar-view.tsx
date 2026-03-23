"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Day = {
  date: number;
  isCurrentMonth: boolean;
  hasTasks: boolean;
  taskCount: number;
  isToday: boolean;
  weekDay: string;
};

interface TaskDay {
  date: string;
  count: number;
}

export function TaskCalendarView() {
  const { data: session } = useSession();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [taskDays, setTaskDays] = useState<TaskDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const fetchTaskDays = async () => {
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const response = await fetch(`/api/tasks/calendar?year=${year}&month=${month}`);
        if (response.ok) {
          const data = await response.json();
          setTaskDays(data.taskDays || []);
        }
      } catch (error) {
        console.error("Failed to fetch task days:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchTaskDays();
    } else {
      setIsLoading(false);
    }
  }, [session, currentMonth]);

  const generateDays = (baseDate: Date): Day[] => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days: Day[] = [];

    // Previous month tail
    for (let i = startDay - 1; i >= 0; i--) {
      const dateObj = new Date(year, month, -i);
      days.push({
        date: dateObj.getDate(),
        isCurrentMonth: false,
        hasTasks: false,
        taskCount: 0,
        isToday: false,
        weekDay: weekDays[dateObj.getDay()],
      });
    }

    // Current month
    for (let i = 1; i <= totalDays; i++) {
      const dateObj = new Date(year, month, i);
      const isToday =
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      // Check if this day has tasks from API data
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const taskDay = taskDays.find((td) => td.date === dateStr);
      const hasTasks = taskDay ? taskDay.count > 0 : false;
      const taskCount = taskDay?.count || 0;

      days.push({
        date: i,
        isCurrentMonth: true,
        hasTasks,
        taskCount,
        isToday,
        weekDay: weekDays[dateObj.getDay()],
      });
    }

    // Next month head to fill 6 rows
    while (days.length % 7 !== 0) {
      const dateObj = new Date(year, month, totalDays + (days.length - startDay - totalDays + 1));
      days.push({
        date: dateObj.getDate(),
        isCurrentMonth: false,
        hasTasks: false,
        taskCount: 0,
        isToday: false,
        weekDay: weekDays[dateObj.getDay()],
      });
    }

    return days;
  };

  const days = generateDays(currentMonth);

  const goToPrevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  if (isLoading) {
    return (
      <Card className="w-full overflow-hidden">
        <CardHeader className="pb-3 border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" />
            <CardTitle>Task Calendar</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={i} className="h-[50px] w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-3 border-b flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          <CardTitle>Task Calendar</CardTitle>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button variant="outline" size="icon" onClick={goToPrevMonth} className="h-7 w-7 hover:bg-primary/10 rtl:rotate-180">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {currentMonth.toLocaleString("default", { month: "long" })} {currentMonth.getFullYear()}
          </span>
          <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-7 w-7 hover:bg-primary/10 rtl:rotate-180">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        {/* Weekday row only for md+ */}
        <div className="hidden md:grid grid-cols-7 gap-1 text-center mb-1 text-[11px] font-semibold uppercase text-muted-foreground">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {days.map((day, i) => {
            let taskColor =
              day.taskCount === 1
                ? "bg-green-500/20 text-green-700 dark:text-green-300"
                : day.taskCount === 2
                ? "bg-amber-500/20 text-amber-700 dark:text-amber-300"
                : "bg-red-500/20 text-red-700 dark:text-red-300";

            const isSelected =
              day.isCurrentMonth &&
              day.date === selectedDate.getDate() &&
              currentMonth.getMonth() === selectedDate.getMonth();

            return (
              <div
                key={i}
                onClick={() =>
                  day.isCurrentMonth &&
                  setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day.date))
                }
                className={`relative flex flex-col items-center justify-start min-h-[50px] p-1.5 rounded-lg text-xs transition-all border hover:shadow-sm
                  ${day.isCurrentMonth ? "bg-background" : "bg-muted/30 text-muted-foreground"}
                  ${day.isToday ? "ring-2 ring-primary bg-primary/5" : "hover:bg-primary/5"}
                  ${isSelected ? "ring-2 ring-primary bg-primary/10" : ""}
                `}
              >
                {/* Weekday name on top for small screens */}
                <div className="block md:hidden text-[10px] text-muted-foreground mb-0.5">
                  {day.weekDay}
                </div>

                {/* Day number */}
                <div className={`self-center text-[11px] font-medium ${isSelected ? "text-primary font-semibold" : ""}`}>
                  {day.date}
                </div>

                {/* Task box */}
                {day.hasTasks && day.isCurrentMonth && (
                  <div className={`mt-auto w-full text-center text-[10px] ${taskColor} px-1.5 py-0.5 rounded-md truncate`}>
                    {day.taskCount} task{day.taskCount > 1 ? "s" : ""}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
