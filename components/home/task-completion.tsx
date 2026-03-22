import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TaskCompletionWidget() {
  const completionData = [
    { label: "Completed", value: 68, color: "#22c55e" }, // green
    { label: "In Progress", value: 24, color: "#3b82f6" }, // blue
    { label: "Not Started", value: 8, color: "#d1d5db" }, // gray
  ];

  // Generate conic-gradient dynamically
  const conicGradient = (() => {
    let currentAngle = 0;
    return `conic-gradient(${completionData
      .map((item) => {
        const start = currentAngle;
        const end = currentAngle + (item.value / 100) * 360;
        currentAngle = end;
        return `${item.color} ${start}deg ${end}deg`;
      })
      .join(", ")})`;
  })();

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Task Completion
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Chart */}
        <div className="flex items-center justify-center py-6">
          <div className="relative h-28 w-28 sm:h-36 sm:w-36 md:h-40 md:w-40 lg:h-40 lg:w-40">
            {/* Outer circle (progress) */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: conicGradient,
              }}
            />

            {/* Inner circle (donut center) */}
            <div className="absolute inset-4 bg-background rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-foreground">
                  68%
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground">
                  Completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-2 mt-4 sm:mt-5 text-center">
          {completionData.map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <div
                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full mb-1"
                style={{ backgroundColor: item.color }}
              />
              <div className="text-[10px] sm:text-xs font-medium truncate">
                {item.label}
              </div>
              <div className="text-xs sm:text-sm font-bold">{item.value}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
