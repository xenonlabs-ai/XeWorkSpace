"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "ONLINE" | "OFFLINE" | "IDLE" | "STREAMING";
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const statusConfig = {
    ONLINE: {
      label: "Online",
      className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    },
    OFFLINE: {
      label: "Offline",
      className: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
    },
    IDLE: {
      label: "Idle",
      className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    },
    STREAMING: {
      label: "Streaming",
      className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    },
  };

  const config = statusConfig[status] || statusConfig.OFFLINE;

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-0 font-medium",
        config.className,
        size === "sm" && "text-xs px-2 py-0.5"
      )}
    >
      {config.label}
    </Badge>
  );
}
