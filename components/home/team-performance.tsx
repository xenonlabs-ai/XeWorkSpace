import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TeamPerformanceWidget() {
  const performanceData = [
    { month: "Jan", value: 65 },
    { month: "Feb", value: 78 },
    { month: "Mar", value: 82 },
    { month: "Apr", value: 75 },
    { month: "May", value: 90 },
    { month: "Jun", value: 70 },
    { month: "Jul", value: 60 },
    { month: "Aug", value: 85 },
    { month: "Sep", value: 68 },
    // { month: "Oct", value: 95 },
    // { month: "Nov", value: 88 },
    // { month: "Dec", value: 72 },
  ];

  const average = Math.round(
    performanceData.reduce((sum, item) => sum + item.value, 0) /
      performanceData.length
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Wrapper that hides scrollbar until hover */}
        <div className="relative">
          <div
            className="md:w-full
              overflow-x-auto
              scrollbar-thin scrollbar-thumb-muted-foreground/40 scrollbar-track-transparent
              h-full
            "
          >
            <div className="flex items-end justify-between min-w-[100px] sm:min-w-0 gap-1 pb-1">
              {performanceData.map((item) => (
                <div
                  key={item.month}
                  className="flex flex-col items-center flex-1"
                >
                  <div
                    className="bg-primary rounded-full w-1 md:w-2 transition-all duration-300 hover:opacity-80"
                    style={{ height: `${item.value * 2.8}px` }}
                  />
                  <div className="text-xs mt-2 text-muted-foreground">
                    {item.month}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="justify-between items-center mt-7 hidden md:flex xl:hidden">
          <div className="text-sm text-muted-foreground">Yearly Average</div>
          <div className="text-xl font-bold">{average}%</div>
        </div>
      </CardContent>
    </Card>
  );
}
