

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, Home, Plus } from "lucide-react";
import Image from "next/image";

export function WorkFromHomeTracker() {
  // Define bg colors to match the member's current location
  const locationBg = {
    Office: "bg-blue-50 dark:bg-blue-950",
    Remote: "bg-green-50 dark:bg-green-950",
  };

  const teamMembers = [
    {
      name: "John Smith",
      image: "/images/users/1.jpg",
      location: "Office",
      bg: locationBg["Office"],
      days: [
        { date: "Mon, May 15", location: "Office" },
        { date: "Tue, May 16", location: "Office" },
        { date: "Wed, May 17", location: "Remote" },
        { date: "Thu, May 18", location: "Office" },
        { date: "Fri, May 19", location: "Office" },
      ],
    },
    {
      name: "Sarah Johnson",
      image: "/images/users/2.jpg",
      location: "Remote",
      bg: locationBg["Remote"],
      days: [
        { date: "Mon, May 15", location: "Remote" },
        { date: "Tue, May 16", location: "Remote" },
        { date: "Wed, May 17", location: "Remote" },
        { date: "Thu, May 18", location: "Remote" },
        { date: "Fri, May 19", location: "Office" },
      ],
    },
    {
      name: "Michael Brown",
      image: "/images/users/3.jpg",
      location: "Office",
      bg: locationBg["Office"],
      days: [
        { date: "Mon, May 15", location: "Office" },
        { date: "Tue, May 16", location: "Office" },
        { date: "Wed, May 17", location: "Office" },
        { date: "Thu, May 18", location: "Office" },
        { date: "Fri, May 19", location: "Remote" },
      ],
    },
    {
      name: "Piter Hush",
      image: "/images/users/4.jpg",
      location: "Office",
      bg: locationBg["Office"],
      days: [
        { date: "Mon, May 15", location: "Office" },
        { date: "Tue, May 16", location: "Remote" },
        { date: "Wed, May 17", location: "Office" },
        { date: "Thu, May 18", location: "Office" },
        { date: "Fri, May 19", location: "Remote" },
      ],
    },
  ];

  const totalMembers = teamMembers.length;
  const remoteCount = teamMembers.filter((m) => m.location === "Remote").length;
  const officeCount = totalMembers - remoteCount;
  const remotePercentage = Math.round((remoteCount / totalMembers) * 100);
  const officePercentage = 100 - remotePercentage;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Work From Home Tracker
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-sm font-semibold"
          >
            <Plus className="h-4 w-4" />
            Update
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Summary Section */}
        <div className="flex justify-between items-center text-sm font-semibold">
          <div className="flex items-center gap-3">
            <Building className="h-5 w-5 text-blue-600" />
            <span className="text-blue-900 dark:text-blue-200">
              Office: <span className="font-extrabold">{officeCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Home className="h-5 w-5 text-green-600" />
            <span className="text-green-900 dark:text-green-200">
              Remote: <span className="font-extrabold">{remoteCount}</span>
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-blue-500 h-1.5 transition-all"
            style={{ width: `${officePercentage}%` }}
          ></div>
        </div>

        {/* Member List */}
        <div className="pt-4 space-y-3">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-5 p-2 rounded-lg hover:bg-muted/40 transition-colors ${member.bg}`}
            >
              {/* Avatar */}
              <div className="relative h-10 w-10 md:h-14 md:w-14 rounded-full overflow-hidden border border-border/50 shrink-0 shadow">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-medium truncate leading-snug text-foreground">
                    {member.name}
                  </span>
                  <Badge
                    variant={
                      member.location === "Office" ? "outline" : "secondary"
                    }
                    className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full
                      ${
                        member.location === "Office"
                          ? "border-blue-400 text-blue-700 bg-blue-50 dark:bg-blue-950 dark:text-blue-200"
                          : "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                      }`}
                  >
                    {member.location === "Office" ? (
                      <Building className="h-4 w-4 text-blue-500" />
                    ) : (
                      <Home className="h-4 w-4 text-green-500" />
                    )}
                    <span className="font-medium">{member.location}</span>
                  </Badge>
                </div>

                {/* Work Days */}
                <div className="flex flex-wrap gap-2 overflow-x-auto pb-1">
                  {member.days.map((day, index) => (
                    <div
                      key={index}
                      className={`text-xs px-3 py-1 rounded-md flex items-center whitespace-nowrap font-semibold
                        ${
                          day.location === "Office"
                            ? "bg-blue-100 text-blue-800 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-200"
                            : "bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-200"
                        }`}
                      style={{ minWidth: "52px" }}
                    >
                      {day.location === "Office" ? (
                        <Building className="h-3 w-3 mr-1" />
                      ) : (
                        <Home className="h-3 w-3 mr-1" />
                      )}
                      <span>{day.date.split(",")[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
