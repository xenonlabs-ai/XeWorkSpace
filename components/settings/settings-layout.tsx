"use client"

import { useState } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import {
  LayoutGrid,
  Bell,
  Plug,
  CreditCard,
  Search,
  SettingsIcon,
  Users,
  Shield,
  HelpCircle,
  Palette,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { OrganizationSettings } from "./organization-settings"
import { NotificationSettings } from "./notification-settings"
import { IntegrationsSettings } from "./integrations-settings"
import { BillingSettings } from "./billing-settings"

export function SettingsLayout() {
  const [activeTab, setActiveTab] = useState("organization")
  const [searchQuery, setSearchQuery] = useState("")

  const sidebarItems = [
    { id: "organization", label: "Organization", icon: LayoutGrid },
    { id: "preferences", label: "Preferences", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Plug },
    { id: "team", label: "Team Members", icon: Users },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "system", label: "System", icon: SettingsIcon },
    { id: "support", label: "Support", icon: HelpCircle },
  ]

  const filteredItems = searchQuery
    ? sidebarItems.filter((item) => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : sidebarItems

  return (
    <>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Sidebar */}
        <div className="md:w-64 flex-shrink-0 border rounded-lg p-4 bg-background">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search settings..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <nav className="space-y-1">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                className={cn(
                  "flex items-center gap-3 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  activeTab === item.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsContent value="organization" className="mt-0">
              <OrganizationSettings />
            </TabsContent>
            <TabsContent value="preferences" className="mt-0">
              <div className="border rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Appearance & Preferences</h2>
                <p className="text-muted-foreground">Configure your personal preferences and appearance settings.</p>
              </div>
            </TabsContent>
            <TabsContent value="notifications" className="mt-0">
              <NotificationSettings />
            </TabsContent>
            <TabsContent value="integrations" className="mt-0">
              <IntegrationsSettings />
            </TabsContent>
            <TabsContent value="team" className="mt-0">
              <div className="border rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Team Members</h2>
                <p className="text-muted-foreground">Manage team members, roles, and permissions.</p>
              </div>
            </TabsContent>
            <TabsContent value="security" className="mt-0">
              <div className="border rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Security Settings</h2>
                <p className="text-muted-foreground">
                  Configure security settings, authentication methods, and access controls.
                </p>
              </div>
            </TabsContent>
            <TabsContent value="billing" className="mt-0">
              <BillingSettings />
            </TabsContent>
            <TabsContent value="system" className="mt-0">
              <div className="border rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">System Settings</h2>
                <p className="text-muted-foreground">Configure system-wide settings and defaults.</p>
              </div>
            </TabsContent>
            <TabsContent value="support" className="mt-0">
              <div className="border rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Support</h2>
                <p className="text-muted-foreground">Get help and support for your team dashboard.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
