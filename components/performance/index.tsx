import { GoalTracking } from "./goal-tracking";
import { PerformanceHeader } from "./header";
import { KPIScorecard } from "./kpi-scorecards";
import { MetricCards } from "./metric-cards";
import { PerformanceHeatmap } from "./performance-heatmap";
import { PerformanceTrends } from "./performance-trends";
import { TeamComparison } from "./team-comparison";

export function PerformanceContent() {
  return (
    <>
      <PerformanceHeader />

      {/* Enhanced metric cards */}
      <MetricCards />

      {/* KPI Scorecard */}
      <div className="mt-6">
        <KPIScorecard />
      </div>

      {/* Performance trends and insights */}
      <div className="grid gap-6 mt-6 lg:grid-cols-2">
        <PerformanceTrends />
        {/* <PerformanceInsights /> */}
      </div>

      {/* Team comparison and goal tracking */}
      <div className="grid gap-6 mt-6 xl:grid-cols-2">
        <TeamComparison />
        <GoalTracking />
      </div>

      {/* Performance heatmap and skill assessment */}
      <div className="hidden md:grid gap-6 mt-6 grid-cols-1">
        <PerformanceHeatmap />
        {/* <SkillAssessment /> */}
      </div>
    </>
  );
}
