"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Figma, LineChart, Megaphone } from "lucide-react";
import { useState } from "react";

type TaskCategory = {
  category: string;
  count: number;
  color: string;
  icon: React.ReactNode;
};

export function TaskDistributionWidget() {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const distributionData: TaskCategory[] = [
    {
      category: "Development",
      count: 14,
      color: "bg-blue-500/90",
      icon: <Code className="h-5 w-5" />,
    },
    {
      category: "Design",
      count: 8,
      color: "bg-indigo-500/90",
      icon: <Figma className="h-5 w-5" />,
    },
    {
      category: "Research",
      count: 6,
      color: "bg-purple-500/90",
      icon: <LineChart className="h-5 w-5" />,
    },
    {
      category: "Marketing",
      count: 4,
      color: "bg-pink-500/90",
      icon: <Megaphone className="h-5 w-5" />,
    },
  ];

  const total = distributionData.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Distribution</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {distributionData.map((item: TaskCategory) => {
            const percentage = Math.round((item.count / total) * 100);
            const isHovered = hoveredCategory === item.category;

            return (
              <div
                key={item.category}
                className="space-y-3 transition-all duration-200"
                onMouseEnter={() => setHoveredCategory(item.category)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`${item.color} rounded-md p-2.5 text-white transition-transform duration-200`}
                    >
                      {item.icon}
                    </div>

                    <span
                      className={`font-medium text-sm ${
                        isHovered ? "text-black" : "text-gray-700"
                      }`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-gray-500">
                    <span className="tabular-nums">{item.count}</span> tasks
                    <span className="ml-1 font-semibold text-gray-700">
                      ({percentage}%)
                    </span>
                  </div>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`${
                      item.color
                    } rounded-full h-1.5 transition-all duration-300 ease-in-out ${
                      isHovered ? "shadow-md" : ""
                    }`}
                    style={{
                      width: `${percentage}%`,
                      transform: isHovered ? "scaleY(1.3)" : "scaleY(1)",
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
