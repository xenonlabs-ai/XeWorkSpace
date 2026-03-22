
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskCard } from "./task-card";

export function TaskTabs() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Status</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        {/* Header Row */}
        {/* <TabsList className="flex flex-wrap shrink-0 h-full bg-accent p-2">
            {["all", "assigned", "completed"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="rounded-md px-2 py-2 m-2 text-sm font-medium transition-all 
                    bg-transparent border border-transparent
                    text-muted-foreground hover:text-primary hover:border-primary/20 
                    data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary"
              >
                {tab === "all"
                  ? "All Tasks"
                  : tab === "assigned"
                  ? "Assigned to Me"
                  : "Completed"}
              </TabsTrigger>
            ))}
          </TabsList> */}

        {/* Tabs Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <TaskCard key={i} index={i} />
          ))}
        </div>

        {/* <TabsContent value="assigned" className="mt-0">
            <Card className="border-dashed border-muted-foreground/20">
              <CardHeader>
                <CardTitle className="text-base">
                  Tasks Assigned to You
                </CardTitle>
                <CardDescription className="text-sm">
                  You have 3 active tasks assigned
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your assigned tasks will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="mt-0">
            <Card className="border-dashed border-muted-foreground/20">
              <CardHeader>
                <CardTitle className="text-base">Completed Tasks</CardTitle>
                <CardDescription className="text-sm">
                  Tasks that have been marked as complete
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Your completed tasks will appear here.
                </p>
              </CardContent>
            </Card>
          </TabsContent> */}
      </CardContent>
    </Card>
  );
}
