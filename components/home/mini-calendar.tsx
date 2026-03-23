"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

export function MiniCalendarWidget() {
  const { data: session } = useSession();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [taskDays, setTaskDays] = useState<TaskDay[]>([]);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    const fetchTaskDays = async () => {
      try {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth() + 1;
        const response = await fetch(`/api/calendar/tasks?year=${year}&month=${month}`);
        if (response.ok) {
          const data = await response.json();
          setTaskDays(data.taskDays || []);
        }
      } catch (error) {
        console.error("Failed to fetch task days:", error);
      }
    };

    if (session) {
      fetchTaskDays();
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
      const dateObj = new Date(
        year,
        month,
        totalDays + (days.length - startDay - totalDays + 1)
      );
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

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Calendar</CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={goToPrevMonth} className="h-5 w-5">
            <ChevronLeft className="h-3 w-3 rtl:rotate-180" />
          </Button>
          <span className="text-sm font-medium px-2">
            {currentMonth.toLocaleString("default", { month: "long" })}{" "}
            {currentMonth.getFullYear()}
          </span>
          <Button variant="outline" size="icon" onClick={goToNextMonth} className="h-5 w-5">
            <ChevronRight className="h-3 w-3 rtl:rotate-180" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-2 pt-2">
        <div className="hidden md:grid grid-cols-7 gap-1 text-center mb-1 text-[10px] font-semibold uppercase text-muted-foreground">
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-3 text-center">
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
                  setSelectedDate(
                    new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day.date)
                  )
                }
                className={`relative flex flex-col items-center justify-start min-h-[62px] md:min-h-[49px] xl:min-h-[62px] px-1.5 py-1.5 rounded-lg text-xs transition-all border cursor-pointer
                  ${day.isCurrentMonth ? "bg-background" : "bg-muted/30 text-muted-foreground"}
                  ${day.isToday ? "ring-2 ring-primary bg-primary/5" : ""}
                  ${isSelected ? "ring-2 ring-primary bg-primary/10" : ""}
                `}
              >
                <div className="block md:hidden text-[10px] text-muted-foreground mb-0.5">
                  {day.weekDay}
                </div>

                <div
                  className={`self-center text-[11px] font-medium ${
                    isSelected ? "text-primary font-semibold" : ""
                  }`}
                >
                  {day.date}
                </div>

                {day.hasTasks && day.isCurrentMonth && (
                  <div
                    className={`mt-auto w-full text-center text-[9px] ${taskColor} px-1.5 py-px rounded-md truncate`}
                  >
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
