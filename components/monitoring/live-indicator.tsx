"use client";

import { cn } from "@/lib/utils";

interface LiveIndicatorProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function LiveIndicator({ className, size = "md" }: LiveIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <span className={cn("relative flex", sizeClasses[size], className)}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      <span
        className={cn(
          "relative inline-flex rounded-full bg-green-500",
          sizeClasses[size]
        )}
      />
    </span>
  );
}
