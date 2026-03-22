import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TeamWorkload() {
  const teamMembers = [
    { id: 1, name: "Alex Johnson", tasks: 8, completed: 5 },
    { id: 2, name: "Samantha Lee", tasks: 6, completed: 4 },
    { id: 3, name: "Michael Chen", tasks: 10, completed: 3 },
    { id: 4, name: "Emily Rodriguez", tasks: 5, completed: 5 },
    { id: 5, name: "David Kim", tasks: 7, completed: 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Workload</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {teamMembers.map((member) => {
            const completionPercentage =
              (member.completed / member.tasks) * 100;

            const barGradient =
              completionPercentage < 30
                ? "bg-gradient-to-r from-red-500 to-red-400"
                : completionPercentage < 70
                ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                : "bg-gradient-to-r from-green-500 to-emerald-400";

            return (
              <div
                key={member.id}
                className="flex items-center gap-4 rounded-lg transition-all duration-300"
              >
                <Avatar className="h-9 w-9 ring-2 ring-muted">
                  <AvatarImage
                    src={`/images/users/${member.id}.jpg`}
                    alt={member.name}
                  />
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium truncate">
                      {member.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {member.completed}/{member.tasks} tasks
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full rounded-full ${barGradient} shadow-sm`}
                      style={{
                        width: `${completionPercentage}%`,
                        boxShadow: "0 0 6px rgba(0,0,0,0.15)",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
