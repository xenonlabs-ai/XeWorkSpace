
import { Activity, CheckSquare, MessageSquare, Users } from "lucide-react";
import { DashboardHeader } from "./dashboard-header";
import { GoalsTracker } from "./goals-tracker";
import { MiniCalendarWidget } from "./mini-calendar";
import { MonitoringConsentBanner } from "./monitoring-consent-banner";
import { ProjectAnalytics } from "./project-analytics";
import { ProjectProgressWidget } from "./project-progress";
import { ProjectStatusWidget } from "./project-status";
import { ProjectTimelineWidget } from "./project-timeline";
import { StatsCard } from "./stats-card";
import { TaskCompletionWidget } from "./task-completion";
import { TaskDistributionWidget } from "./task-distribution";
import { TeamActivityWidget } from "./team-activity";
import { TeamAnalytics } from "./team-analytics";
import { TeamPerformanceWidget } from "./team-performance";
import { TrendAnalysis } from "./trend-analysis";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
    },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

export function HomeContent() {
  const stats = [
    {
      title: "Team Members",
      value: "12",
      description: "2 joined this month",
      icon: Users,
    },
    {
      title: "Active Tasks",
      value: "24",
      description: "8 due this week",
      icon: CheckSquare,
    },
    {
      title: "Team Activity",
      value: "87%",
      description: "+12% from last week",
      icon: Activity,
    },
    {
      title: "Unread Messages",
      value: "9",
      description: "3 require attention",
      icon: MessageSquare,
    },
  ];

  const recentActivities = [1, 2, 3, 4].map((i) => ({
    title: `Task #${i} was completed`,
    description: `${i} hour${i !== 1 ? "s" : ""} ago by Team Member`,
    dotColor: "bg-primary",
  }));

  const upcomingDeadlines = [1, 2, 3, 4].map((i) => ({
    title: `Project milestone #${i}`,
    description: `Due in ${i} day${i !== 1 ? "s" : ""}`,
    dotColor: "bg-destructive",
  }));

  return (
    <>
      <DashboardHeader />

      {/* Monitoring Consent Banner - shown when pending */}
      <MonitoringConsentBanner />

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
            />
          </div>
        ))}
      </div>
      <div className="grid gap-6 mt-6 xl:grid-cols-2">
        <div>
          <ProjectAnalytics />
        </div>
        {/* <div >
					<ResourceUtilization />
				</div> */}
        <div>
          <TrendAnalysis />
        </div>
      </div>
      {/* First Row of Widgets */}
      <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        <div>
          <TaskCompletionWidget />
        </div>
        <div>
          <TaskDistributionWidget />
        </div>
        <div>
          <TeamPerformanceWidget />
        </div>
        <div>
          <MiniCalendarWidget />
        </div>
        <div>
          <ProjectStatusWidget />
        </div>
        <div>
          <ProjectProgressWidget />
        </div>
      </div>

      {/* Project Timeline (Full Width) */}
      <div className="grid gap-6 mt-6 lg:grid-cols-6 xl:grid-cols-6">
        <div className="lg:col-span-3 xl:col-span-3">
          <ProjectTimelineWidget />
        </div>
        <div className="lg:col-span-3 xl:col-span-3">
          <TeamActivityWidget />
        </div>
      </div>
      {/* Activity Widgets */}
      {/* <div className="grid gap-6 mt-6 md:grid-cols-3">
        <div>
          <ActivityCard
            title="Recent Activity"
            description="Your team's latest actions"
            activities={recentActivities}
          />
        </div>
        <div >
					<ActivityCard title="Upcoming Deadlines" description="Tasks due soon" activities={upcomingDeadlines} />
				</div>
      </div> */}

      <div className="grid gap-6 mt-6 xl:grid-cols-2">
        <div>
          <TeamAnalytics />
        </div>
        <div>
          <GoalsTracker />
        </div>
      </div>
    </>
  );
}
