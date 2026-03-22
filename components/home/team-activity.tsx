import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TeamActivityWidget() {
  const activities = [
    {
      userId: 1,
      name: "John Smith",
      action: "completed task",
      target: "Update user documentation ",
      time: "10 minutes ago",
    },
    {
      userId: 2,
      name: "Alice Kim",
      action: "commented on",
      target: "Website redesign has been completed ",
      time: "2 hours ago",
    },
    {
      userId: 3,
      name: "Maria kin",
      action: "uploaded projects ",
      target: "Q2 Marketing Plan.pdf",
      time: "2 hours ago",
    },
    {
      userId: 4,
      name: "David Wilson",
      action: "Foreign project started",
      target: "Mobile app testing is going on",
      time: "3 hours ago",
    },
    {
      userId: 5,
      name: "Devis Luis",
      action: "project started",
      target: "New project launching",
      time: "1 hours ago",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 grid md:grid-cols-2 lg:grid-cols-1">
          {activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage
                  src={`/images/users/${activity.userId}.jpg`}
                  alt={activity.name}
                />
              </Avatar>

              {/* min-w-0 is REQUIRED for truncate inside flex */}
              <div className="flex-1 space-y-1 min-w-0">
                <p className="text-sm md:truncate">
                  <span className="font-semibold">{activity.name}</span>{" "}
                  <span className="text-muted-foreground">
                    {activity.action}
                  </span>{" "}
                  <span className="font-semibold">{activity.target}</span>{" "}
                </p>

                <p className="text-xs text-muted-foreground trun">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
