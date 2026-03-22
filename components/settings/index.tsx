"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { SettingsHeader } from "./header";
import { IntegrationsSettings } from "./integrations-settings";
import { NotificationSettings } from "./notification-settings";
import { OrganizationSettings } from "./organization-settings";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("general");

   return (
    <div className="flex flex-col space-y-8 p-4 sm:p-6 md:p-8">
      <SettingsHeader />

      <Tabs
        defaultValue="general"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        {/* --- Tab List --- */}
        <div>
          <TabsList className="flex flex-wrap w-full h-auto gap-2 p-2 mb-4">
            <TabsTrigger value="general">Organization</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>
        </div>

        {/* --- Tab Contents --- */}
        <TabsContent value="general">
          <OrganizationSettings />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
