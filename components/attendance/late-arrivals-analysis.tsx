import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function LateArrivalsAnalysis() {
  // Sample late arrivals data
  const lateArrivalsData = [
    { day: "Monday", count: 3 },
    { day: "Tuesday", count: 2 },
    { day: "Wednesday", count: 1 },
    { day: "Thursday", count: 4 },
    { day: "Friday", count: 5 },
  ];

  // Calculate total and average
  const totalLateArrivals = lateArrivalsData.reduce(
    (sum, day) => sum + day.count,
    0
  );
  const averageLateArrivals = (
    totalLateArrivals / lateArrivalsData.length
  ).toFixed(1);

  // Find the day with most late arrivals
  const maxLateArrivals = Math.max(...lateArrivalsData.map((day) => day.count));
  const worstDay = lateArrivalsData.find(
    (day) => day.count === maxLateArrivals
  )?.day;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Late Arrivals Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{totalLateArrivals}</div>
              <div className="text-xs text-muted-foreground">
                Total Late Arrivals
              </div>
            </div>
            <div className="bg-muted/30 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold">{averageLateArrivals}</div>
              <div className="text-xs text-muted-foreground">Daily Average</div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-sm font-medium mb-3">Late Arrivals by Day</div>
            <div className="space-y-5">
              {lateArrivalsData.map((day) => (
                <div key={day.day} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>{day.day}</span>
                    <span>{day.count} late arrivals</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`rounded-full h-2 ${
                        day.count <= 2
                          ? "bg-green-500"
                          : day.count <= 4
                          ? "bg-amber-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${(day.count / maxLateArrivals) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


