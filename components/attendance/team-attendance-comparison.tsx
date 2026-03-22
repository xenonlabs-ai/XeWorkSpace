import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TeamAttendanceComparison() {
  // Sample team member attendance data
  const teamMembers = [
    {
      id: 1,
      name: "John Smith",
      avatar: "JS",
      attendance: 95,
      punctuality: 92,
      streak: 14,
      status: "Present",
    },
    // {
    //   id: 2,
    //   name: "Sarah Johnson",
    //   avatar: "SJ",
    //   attendance: 98,
    //   punctuality: 95,
    //   streak: 21,
    //   status: "Present",
    // },
    {
      id: 3,
      name: "Michael Brown",
      avatar: "MB",
      attendance: 90,
      punctuality: 85,
      streak: 7,
      status: "Present",
    },
    {
      id: 4,
      name: "Emily Davis",
      avatar: "ED",
      attendance: 88,
      punctuality: 80,
      streak: 0,
      status: "Late",
    },
    // {
    //   id: 5,
    //   name: "David Wilson",
    //   avatar: "DW",
    //   attendance: 75,
    //   punctuality: 70,
    //   streak: 0,
    //   status: "Absent",
    // },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Attendance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-12">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex items-center gap-4">
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage
                  src={`/images/users/${member.id}.jpg`}
                  alt={member.name}
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{member.name}</span>
                    <Badge
                      variant={
                        member.status === "Present"
                          ? "outline"
                          : member.status === "Late"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-xs"
                    >
                      {member.status}
                    </Badge>
                  </div>
                  {member.streak > 0 && (
                    <div className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center">
                      <span className="mr-1">🔥</span> {member.streak} day
                      streak
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Attendance</span>
                      <span>{member.attendance}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className={`rounded-full h-1.5 ${
                          member.attendance >= 95
                            ? "bg-green-500"
                            : member.attendance >= 85
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${member.attendance}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Punctuality</span>
                      <span>{member.punctuality}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className={`rounded-full h-1.5 ${
                          member.punctuality >= 95
                            ? "bg-green-500"
                            : member.punctuality >= 85
                            ? "bg-amber-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${member.punctuality}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
