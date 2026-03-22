

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PriorityDistribution() {
  // Priority data
  const priorities = [
    { name: "High", count: 12, color: "#ef4444" }, // red-500
    { name: "Medium", count: 18, color: "#f59e0b" }, // amber-500
    { name: "Low", count: 12, color: "#22c55e" }, // green-500
  ];

  const total = priorities.reduce((sum, item) => sum + item.count, 0);

  // Build conic-gradient for accurate ring rendering
  let gradient = "";
  let accumulated = 0;
  priorities.forEach((p, i) => {
    const start = (accumulated / total) * 100;
    const end = ((accumulated + p.count) / total) * 100;
    accumulated += p.count;
    gradient += `${p.color} ${start}% ${end}%, `;
  });
  gradient = gradient.slice(0, -2); // remove trailing comma

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority Distribution</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col items-center justify-between space-y-12">
          {/* Circular Chart */}
          <div className="relative h-44 w-44 mb-4">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(${gradient})`,
              }}
            />
            <div className="absolute inset-5 bg-background rounded-full flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-foreground">{total}</div>
              <div className="text-xs text-muted-foreground">Total Tasks</div>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-3 mt-2 w-full text-center">
            {priorities.map((item) => (
              <div
                key={item.name}
                className="flex flex-col items-center justify-center"
              >
                <div
                  className="w-3 h-3 rounded-full mb-1"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-xs font-medium text-muted-foreground">
                  {item.name}
                </div>
                <div
                  className="text-sm font-semibold pt-1"
                  style={{ color: item.color }}
                >
                  {item.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
