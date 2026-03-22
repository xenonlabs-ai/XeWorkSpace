import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function DepartmentComparison() {
  // Sample department data
  const departments = [
    { name: "Development", productivity: 87, tasks: 42, quality: 92 },
    { name: "Design", productivity: 85, tasks: 28, quality: 95 },
    { name: "Marketing", productivity: 82, tasks: 35, quality: 88 },
    { name: "Sales", productivity: 78, tasks: 30, quality: 85 },
    { name: "Support", productivity: 90, tasks: 48, quality: 91 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="productivity">
          <TabsList className="mb-4">
            <TabsTrigger value="productivity">Productivity</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
          </TabsList>

          <TabsContent value="productivity">
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dept.name}</span>
                    <span>{dept.productivity}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-secondary rounded-full h-2.5"
                      style={{ width: `${dept.productivity}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tasks">
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dept.name}</span>
                    <span>{dept.tasks} tasks</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-primary rounded-full h-2.5"
                      style={{ width: `${(dept.tasks / 50) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="quality">
            <div className="space-y-4">
              {departments.map((dept) => (
                <div key={dept.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dept.name}</span>
                    <span>{dept.quality}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5">
                    <div
                      className="bg-amber-500 rounded-full h-2.5"
                      style={{ width: `${dept.quality}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
