"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Download, Settings } from "lucide-react";
import { LiveIndicator } from "./live-indicator";

interface MonitoringHeaderProps {
  onRefresh: () => void;
  pollingInterval: number;
  onPollingChange: (interval: number) => void;
  lastUpdated?: Date;
  isLoading?: boolean;
}

export function MonitoringHeader({
  onRefresh,
  pollingInterval,
  onPollingChange,
  lastUpdated,
  isLoading,
}: MonitoringHeaderProps) {
  const formatLastUpdated = (date?: Date) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString();
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Live Monitoring</h1>
          <LiveIndicator size="lg" />
        </div>
        <p className="text-muted-foreground mt-1">
          Real-time employee desktop monitoring and activity tracking
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-sm text-muted-foreground">
          Updated: {formatLastUpdated(lastUpdated)}
        </div>

        <Select
          value={String(pollingInterval)}
          onValueChange={(v) => onPollingChange(Number(v))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Refresh rate" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10000">Every 10s</SelectItem>
            <SelectItem value="30000">Every 30s</SelectItem>
            <SelectItem value="60000">Every 1m</SelectItem>
            <SelectItem value="300000">Every 5m</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>

        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
