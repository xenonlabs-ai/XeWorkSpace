
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Clock, Mail } from "lucide-react";

export function NotificationSettings() {
  return (
    <Tabs defaultValue="email" className="w-full">
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <TabsList
            className="
              mt-4 sm:mt-0 
              bg-gray-100 dark:bg-gray-800/60 rounded-xl p-1 
              flex flex-col sm:flex-row gap-2 sm:gap-1 w-full
            "
          >
            <TabsTrigger
              value="email"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/80 rounded-lg px-4 py-2 text-sm font-medium transition-all w-full sm:w-auto justify-center"
            >
              <Mail className="h-4 w-4" />
              <span className="hidden xs:inline">Email</span>
              <span className="xs:hidden">Mail</span>
            </TabsTrigger>
            <TabsTrigger
              value="in-app"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/80 rounded-lg px-4 py-2 text-sm font-medium transition-all w-full sm:w-auto justify-center"
            >
              <Bell className="h-4 w-4" />
              <span>In-App</span>
            </TabsTrigger>
            <TabsTrigger
              value="schedule"
              className="flex items-center gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700/80 rounded-lg px-4 py-2 text-sm font-medium transition-all w-full sm:w-auto justify-center"
            >
              <Clock className="h-4 w-4" />
              <span>Schedule</span>
            </TabsTrigger>
          </TabsList>
        </CardContent>
      </Card>

      {/* EMAIL TAB */}
      <TabsContent value="email" className="space-y-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Email Notifications</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Configure which emails you receive and how often
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              {
                title: "Messages",
                items: [
                  [
                    "New Messages",
                    "Receive an email when someone sends you a message",
                  ],
                  ["Mentions", "Receive an email when someone mentions you"],
                  [
                    "Daily Digest",
                    "Receive a daily summary of unread messages",
                  ],
                ],
              },
              {
                title: "Tasks",
                items: [
                  [
                    "Task Assignments",
                    "Receive an email when a task is assigned to you",
                  ],
                  [
                    "Task Due Dates",
                    "Receive an email when a task is due soon",
                  ],
                  [
                    "Task Completions",
                    "Receive an email when a task you created is completed",
                  ],
                ],
              },
              {
                title: "Team",
                items: [
                  [
                    "Team Updates",
                    "Receive an email with team updates and announcements",
                  ],
                  [
                    "New Team Members",
                    "Receive an email when someone joins the team",
                  ],
                ],
              },
            ].map((section, i) => (
              <div key={i} className="space-y-4">
                {i > 0 && <Separator />}
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  {section.title}
                </h3>
                {section.items.map(([label, desc], idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 hover:bg-gray-50 dark:hover:bg-gray-800/40 p-3 rounded-xl transition"
                  >
                    <div className="flex-1">
                      <Label className="font-medium text-sm">{label}</Label>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                    <div className="flex justify-end sm:justify-normal">
                      <Switch defaultChecked={idx !== 2} />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between border-t border-gray-200/70 dark:border-gray-800/70 pt-4">
            <Button variant="outline" className="w-full sm:w-auto">
              Reset
            </Button>
            <Button className="bg-linear-to-r from-indigo-600 to-violet-500 text-white w-full sm:w-auto">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* IN-APP TAB */}
      <TabsContent value="in-app">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>In-App Notifications</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Configure which notifications appear in the app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 hover:bg-gray-50 dark:hover:bg-gray-800/40 p-3 rounded-xl transition">
              <div className="flex-1">
                <Label className="font-medium text-sm">Show popups</Label>
                <p className="text-xs text-muted-foreground">
                  Show real-time notifications in the top-right corner
                </p>
              </div>
              <div className="flex justify-end sm:justify-normal">
                <Switch defaultChecked />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 hover:bg-gray-50 dark:hover:bg-gray-800/40 p-3 rounded-xl transition">
              <div className="flex-1">
                <Label className="font-medium text-sm">Sound Alerts</Label>
                <p className="text-xs text-muted-foreground">
                  Play a sound for important notifications
                </p>
              </div>
              <div className="flex justify-end sm:justify-normal">
                <Switch />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between border-t border-gray-200/70 dark:border-gray-800/70 pt-4">
            <Button variant="outline" className="w-full sm:w-auto">
              Reset
            </Button>
            <Button className="bg-linear-to-r from-indigo-600 to-violet-500 text-white w-full sm:w-auto">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* SCHEDULE TAB */}
      <TabsContent value="schedule">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Notification Schedule</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Configure when you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 hover:bg-gray-50 dark:hover:bg-gray-800/40 p-3 rounded-xl transition">
              <div className="flex-1">
                <Label className="font-medium text-sm">Quiet Hours</Label>
                <p className="text-xs text-muted-foreground">
                  Mute all notifications between 10 PM and 7 AM
                </p>
              </div>
              <div className="flex justify-end sm:justify-normal">
                <Switch defaultChecked />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between border-t border-gray-200/70 dark:border-gray-800/70 pt-4">
            <Button variant="outline" className="w-full sm:w-auto">
              Reset
            </Button>
            <Button className="bg-linear-to-r from-indigo-600 to-violet-500 text-white w-full sm:w-auto">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
