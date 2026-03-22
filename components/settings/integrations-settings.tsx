"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    AlertCircle,
    Check,
    Copy,
    ExternalLink,
    Eye,
    EyeOff,
    RefreshCw,
    Search,
    X,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function IntegrationsSettings() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  const integrations = [
    {
      id: "slack",
      name: "Slack",
      description:
        "Connect your Slack workspace for notifications and updates.",
      logo: "/images/svg/slack.svg",
      status: "connected",
      lastSync: "2 hours ago",
    },
    {
      id: "google",
      name: "Google Workspace",
      description: "Sync calendar events, contacts, and documents.",
      logo: "/images/svg/google.svg",
      status: "connected",
      lastSync: "1 day ago",
    },
    {
      id: "github",
      name: "GitHub",
      description: "Connect your GitHub repositories for code integration.",
      logo: "/images/svg/github.svg",
      status: "connected",
      lastSync: "3 hours ago",
    },
    {
      id: "dropbox",
      name: "Dropbox",
      description: "Access and share files from your Dropbox account.",
      logo: "/images/svg/dropbox.svg",
      status: "disconnected",
    },
    {
      id: "zoom",
      name: "Video Conferencing",
      description:
        "Schedule and join video meetings directly from the dashboard.",
      logo: "/images/svg/zoom.svg",
      status: "error",
      error: "Authentication failed. Please reconnect.",
    },
    {
      id: "jira",
      name: "Jira",
      description: "Sync tasks and issues from your Jira projects.",
      logo: "/images/svg/jira.svg",
      status: "disconnected",
    },
  ];

  const filteredIntegrations = searchQuery
    ? integrations.filter(
        (integration) =>
          integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          integration.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
      )
    : integrations;

  const getStatusBadge = (status: any) => {
    switch (status) {
      case "connected":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100/80">
            <Check className="h-3 w-3 mr-1" /> Connected
          </Badge>
        );
      case "disconnected":
        return (
          <Badge className="bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100/80">
            <X className="h-3 w-3 mr-1" /> Disconnected
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200 hover:bg-red-100/80">
            <AlertCircle className="h-3 w-3 mr-1" /> Error
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Integrations Section */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-semibold">
                Integrations
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Connect your favorite tools and services
              </CardDescription>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search integrations..."
                className="pl-9 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredIntegrations.map((integration) => (
              <Card
                key={integration.id}
                className="transition-all duration-300 border border-border/40 hover:border-primary/30 rounded-xl"
              >
                <CardHeader className="p-5 pb-2 flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                    <Image
                      src={integration.logo || "/placeholder.svg"}
                      alt={`${integration.name} logo`}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">
                        {integration.name}
                      </CardTitle>
                      {getStatusBadge(integration.status)}
                    </div>
                    <CardDescription className="mt-1 text-sm leading-snug">
                      {integration.description}
                    </CardDescription>
                  </div>
                </CardHeader>

                <CardContent className="px-5 pb-3 pt-0">
                  {integration.status === "connected" && (
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                      <span>Last synced: {integration.lastSync}</span>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <RefreshCw className="h-3.5 w-3.5 mr-1" />
                        Sync
                      </Button>
                    </div>
                  )}
                  {integration.status === "error" && (
                    <Alert variant="destructive" className="py-2 mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{integration.error}</AlertDescription>
                    </Alert>
                  )}
                </CardContent>

                <CardFooter className="px-5 pb-5 flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-sm hover:bg-muted/80"
                  >
                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                    Settings
                  </Button>
                  {integration.status === "connected" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-sm border-destructive text-destructive hover:bg-destructive/10"
                    >
                      Disconnect
                    </Button>
                  )}
                  {(integration.status === "disconnected" ||
                    integration.status === "error") && (
                    <Button size="sm" className="h-8 text-sm">
                      Connect
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API Access Section */}
      <Card>
        <CardHeader>
          <CardTitle>API Access</CardTitle>
          <CardDescription>
            Manage API keys for programmatic access to your data
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* API Key */}
            <div className="space-y-3">
              <Label htmlFor="api-key">API Key</Label>
              <div className="flex">
                <Input
                  id="api-key"
                  type={showApiKey ? "text" : "password"}
                  value="sk_live_51NXxXXXXXXXXXXXXXXXXXXXX"
                  className="rounded-r-none font-mono"
                  readOnly
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-none border-l-0"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-l-none border-l-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Keep this key secure. It provides full access.
              </p>
            </div>

            {/* Status */}
            <div className="space-y-3">
              <Label>API Key Status</Label>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100/80">
                  <Check className="h-3 w-3 mr-1" /> Active
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created 30 days ago
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Regenerate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive border-destructive hover:bg-destructive/10"
                >
                  Revoke
                </Button>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
