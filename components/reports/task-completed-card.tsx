"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const data = [
  { day: "Mon", tasks: 15 },
  { day: "Tue", tasks: 18 },
  { day: "Wed", tasks: 16 },
  { day: "Thu", tasks: 10 },
  { day: "Fri", tasks: 17 },
  { day: "Sat", tasks: 14 },
  { day: "Sun", tasks: 13 },
];

export function TasksCompletedCard() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">43</div>
        <p className="text-xs text-muted-foreground">+8 from last week</p>
        <div className="h-[180px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="day" hide />
              <YAxis hide />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="tasks"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                barSize={10}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
