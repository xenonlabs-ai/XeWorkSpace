

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
}: StatsCardProps) {
  return (
    <Card className="gap-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle
          id={`stats-card-${title}`}
          className="text-base font-semibold text-foreground truncate"
        >
          {title}
        </CardTitle>
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-extrabold text-foreground leading-tight">
          {value}
        </div>

        {description && (
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
