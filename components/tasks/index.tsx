import { TasksHeader } from "./header";
import { PriorityDistribution } from "./priority-distribution";
import { TaskStatsCards } from "./stats-cards";
import { TaskCalendarView } from "./task-calendar-view";
import { TaskCategories } from "./task-categories";
import { TaskTabs } from "./task-tabs";
import { TeamWorkload } from "./team-workload";
import { UpcomingDeadlines } from "./upcoming-deadlines";

export function TasksContent() {
  return (
    <>
      <TasksHeader />
      <TaskStatsCards />

      <div className="grid gap-6 mb-6 md:grid-cols-2 xl:grid-cols-3">
        <PriorityDistribution />
        <TaskCategories />
        <div className="md:col-span-2 xl:col-span-1">
          <TeamWorkload />
        </div>
      </div>

      <div className="grid gap-6 mb-6 md:grid-cols-2">
        <UpcomingDeadlines />
        <TaskCalendarView />
      </div>

      <TaskTabs />
    </>
  );
}
