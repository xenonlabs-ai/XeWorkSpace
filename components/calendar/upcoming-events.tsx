import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Edit3 } from "lucide-react";

export function UpcomingEvents() {
  const events = [
    {
      title: "Weekly Team Meeting",
      date: { month: "May", day: 16 },
      time: "9:00 AM – 10:00 AM",
      description: "Discuss weekly progress and upcoming tasks",
      color: "green",
    },
    {
      title: "Project Deadline",
      date: { month: "May", day: 17 },
      time: "All Day",
      description: "Submit final deliverables for Project X",
      color: "yellow",
    },
    {
      title: "Client Presentation",
      date: { month: "May", day: 18 },
      time: "2:00 PM – 3:30 PM",
      description: "Present quarterly results to the client",
      color: "blue",
    },
    {
      title: "Design Review Session",
      date: { month: "May", day: 19 },
      time: "11:00 AM – 12:00 PM",
      description: "Review new design",
      color: "red",
    },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        Upcoming Events
      </h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {events.map((event, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                {/* Date Badge */}
                <div
                  className={`rounded-xl p-3 min-w-[68px] text-center font-semibold text-sm capitalize bg-${event.color}-500/10 text-${event.color}-500`}
                >
                  <div className="text-xs opacity-80">{event.date.month}</div>
                  <div className="text-xl font-bold">{event.date.day}</div>
                </div>

                {/* Event Info */}
                <div className="flex-1 grow shrink-0">
                  <h3 className="font-semibold text-foreground text-[15px] leading-tight">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{event.time}</span>
                  </div>
                  <p className="text-sm text-muted-foreground/90 mt-2 leading-relaxed">
                    {event.description}
                  </p>
                </div>

                {/* Action Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 hover:bg-primary hover:text-white"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
