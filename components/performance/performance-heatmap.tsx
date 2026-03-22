import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

type HeatmapCell = { week: number; value: number };
type HeatmapRow = { day: string; values: HeatmapCell[] };

export function PerformanceHeatmap() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeks = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate random sample data
  const generateHeatmapData = (): HeatmapRow[] =>
    days.map((day) => ({
      day,
      values: weeks.map((week) => ({
        week,
        value: Math.floor(Math.random() * 100),
      })),
    }));

  const data = generateHeatmapData();

  // Modern, subtle color scale (blue-green gradient)
  const getCellColor = (value: number): string => {
    if (value >= 90) return "bg-emerald-600";
    if (value >= 75) return "bg-emerald-500";
    if (value >= 60) return "bg-teal-400";
    if (value >= 45) return "bg-cyan-400";
    if (value >= 30) return "bg-sky-300";
    if (value >= 15) return "bg-blue-300";
    return "bg-slate-300";
  };

  const HeatmapGrid: React.FC<{ data: HeatmapRow[] }> = ({ data }) => (
    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
      <div className="min-w-[600px]">
        {/* Week header */}
        <div className="grid grid-cols-[45px_repeat(12,1fr)] gap-1 mb-2">
          <div />
          {weeks.map((w) => (
            <div
              key={w}
              className="text-xs text-muted-foreground text-center font-medium"
            >
              W{w}
            </div>
          ))}
        </div>

        {/* Heatmap rows */}
        {data.map((row) => (
          <div
            key={row.day}
            className="grid grid-cols-[45px_repeat(12,1fr)] gap-1 mb-1"
          >
            <div className="text-xs text-muted-foreground flex items-center justify-center font-medium">
              {row.day}
            </div>
            {row.values.map((cell) => (
              <div
                key={cell.week}
                className={`h-7 rounded-md ${getCellColor(
                  cell.value
                )} transition-all duration-300 hover:scale-105`}
                title={`${row.day}, Week ${cell.week}: ${cell.value}%`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const Legend = () => (
    <div className="flex justify-center mt-4 items-center gap-2 text-xs text-muted-foreground">
      <span>Low</span>
      <div className="flex gap-1">
        <div className="w-4 h-4 bg-slate-300 rounded" />
        <div className="w-4 h-4 bg-blue-300 rounded" />
        <div className="w-4 h-4 bg-sky-300 rounded" />
        <div className="w-4 h-4 bg-cyan-400 rounded" />
        <div className="w-4 h-4 bg-teal-400 rounded" />
        <div className="w-4 h-4 bg-emerald-500 rounded" />
        <div className="w-4 h-4 bg-emerald-600 rounded" />
      </div>
      <span>High</span>
    </div>
  );

  return (
    <Card className="border border-border/50 shadow-none">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Performance Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <HeatmapGrid data={data} />
        <Legend />
      </CardContent>
    </Card>
  );
}
