import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import Image from "next/image";

export function TeamComparison() {
  const teamMembers = [
    {
      name: "Alex Johnson",
      image: "/images/users/1.jpg",
      role: "Developer",
      productivity: 92,
      quality: 88,
      efficiency: 85,
      trend: "up",
    },
    {
      name: "Samantha Lee",
      image: "/images/users/2.jpg",
      role: "Designer",
      productivity: 87,
      quality: 94,
      efficiency: 82,
      trend: "up",
    },
    {
      name: "Michael Chen",
      image: "/images/users/3.jpg",
      role: "Developer",
      productivity: 78,
      quality: 85,
      efficiency: 90,
      trend: "down",
    },
    {
      name: "Emily Rodriguez",
      image: "/images/users/4.jpg",
      role: "Marketer",
      productivity: 85,
      quality: 82,
      efficiency: 88,
      trend: "up",
    },
    {
      name: "David Kim",
      image: "/images/users/5.jpg",
      role: "Designer",
      productivity: 90,
      quality: 91,
      efficiency: 84,
      trend: "stable",
    },
  ];

  const renderTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Member Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="p-3 rounded-md border hover:bg-muted/20 transition space-y-3"
            >
              {/* Member Info */}
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-sm">{member.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {member.role}
                  </div>
                </div>
              </div>

              {/* Stats per member */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                {/* Productivity */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Productivity</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        {member.productivity}%
                      </span>
                      {renderTrendIcon(member.trend)}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-primary rounded-full h-1.5"
                      style={{ width: `${member.productivity}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quality */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Quality</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{member.quality}%</span>
                      {renderTrendIcon(member.trend)}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-blue-500 rounded-full h-1.5"
                      style={{ width: `${member.quality}%` }}
                    ></div>
                  </div>
                </div>

                {/* Efficiency */}
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Efficiency</span>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">{member.efficiency}%</span>
                      {renderTrendIcon(member.trend)}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                    <div
                      className="bg-green-500 rounded-full h-1.5"
                      style={{ width: `${member.efficiency}%` }}
                    ></div>
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
