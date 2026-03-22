"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs } from "@/components/ui/tabs";
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const teamPerformanceData = [
  { name: "Jan", Productivity: 67, Engagement: 78, Quality: 82 },
  { name: "Feb", Productivity: 72, Engagement: 75, Quality: 85 },
  { name: "Mar", Productivity: 70, Engagement: 82, Quality: 83 },
  { name: "Apr", Productivity: 76, Engagement: 80, Quality: 88 },
  { name: "May", Productivity: 85, Engagement: 85, Quality: 90 },
  { name: "Jun", Productivity: 82, Engagement: 87, Quality: 91 },
];

const metricDefinitions = {
  Productivity: "Measures output relative to time invested",
  Engagement: "Indicates team involvement and participation",
  Quality: "Reflects the standard of work delivered",
  Performance: "Overall effectiveness in achieving goals",
  Efficiency: "Resource utilization and process optimization",
  Satisfaction: "Team happiness and contentment levels",
};

export function TeamAnalytics() {
  const performanceColors = {
    Productivity: "#6366F1", // Indigo
    Engagement: "#10B981", // Emerald
    Quality: "#F59E0B", // Amber
  };

  return (
    <Card className="col-span-full xl:col-span-8">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Team Analytics</CardTitle>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="performance" className="space-y-6">
          <div className="h-[310px]">
            <ResponsiveContainer>
              <BarChart
                data={teamPerformanceData}
                margin={{ top: 10, right: 20, left: -50, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  axisLine={{ stroke: "#ddd" }}
                />
                <YAxis tickLine={false} axisLine={{ stroke: "transparent" }} tick={false} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background text-center border rounded-md shadow-md p-3 text-sm">
                          <p className="font-medium mb-1">{label}</p>
                          {payload.map((entry, i) => (
                            <div
                              key={i}
                              className="flex items-center mt-1 gap-2"
                            >
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                              />
                              <span className="font-medium">{entry.name}:</span>
                              <span>{entry.value}</span>
                            </div>
                          ))}
                          <div className="text-xs text-muted-foreground mt-2">
                            {payload[0] &&
                              metricDefinitions[
                                payload[0]
                                  .name as keyof typeof metricDefinitions
                              ]}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />

                {/* Rounded bar style */}
                <Bar
                  dataKey="Productivity"
                  fill={performanceColors.Productivity}
                  radius={[6, 6, 6, 6]}
                  barSize={16}
                />
                <Bar
                  dataKey="Engagement"
                  fill={performanceColors.Engagement}
                  radius={[6, 6, 6, 6]}
                  barSize={16}
                />
                <Bar
                  dataKey="Quality"
                  fill={performanceColors.Quality}
                  radius={[6, 6, 6, 6]}
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Legend - Centered */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: performanceColors.Productivity }}
              />
              <span className="text-sm text-muted-foreground">
                Productivity
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: performanceColors.Engagement }}
              />
              <span className="text-sm text-muted-foreground">
                Engagement
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: performanceColors.Quality }}
              />
              <span className="text-sm text-muted-foreground">
                Quality
              </span>
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
