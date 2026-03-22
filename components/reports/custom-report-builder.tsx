import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Wand2 } from "lucide-react";

export function CustomReportBuilder() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Custom Report Builder</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save Template
          </Button>
          <Button size="sm">
            <Wand2 className="h-4 w-4 mr-1" />
            Generate Report
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="metrics">
          <TabsList className="mb-4">
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="filters">Filters</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
          </TabsList>

          <TabsContent value="metrics">
            <div className="space-y-4">
              <div>
                <Label htmlFor="report-name">Report Name</Label>
                <Input
                  id="report-name"
                  placeholder="Enter report name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="mb-2 block">Select Metrics</Label>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 border rounded-md p-3">
                    <Label className="font-medium">Performance Metrics</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="productivity" defaultChecked />
                        <Label
                          htmlFor="productivity"
                          className="text-sm font-normal"
                        >
                          Productivity Score
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="quality" defaultChecked />
                        <Label
                          htmlFor="quality"
                          className="text-sm font-normal"
                        >
                          Quality Rating
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="efficiency" />
                        <Label
                          htmlFor="efficiency"
                          className="text-sm font-normal"
                        >
                          Efficiency Index
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border rounded-md p-3">
                    <Label className="font-medium">Task Metrics</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="completed" defaultChecked />
                        <Label
                          htmlFor="completed"
                          className="text-sm font-normal"
                        >
                          Tasks Completed
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="completion-time" />
                        <Label
                          htmlFor="completion-time"
                          className="text-sm font-normal"
                        >
                          Avg. Completion Time
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="overdue" />
                        <Label
                          htmlFor="overdue"
                          className="text-sm font-normal"
                        >
                          Overdue Tasks
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border rounded-md p-3">
                    <Label className="font-medium">Attendance Metrics</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="attendance-rate" defaultChecked />
                        <Label
                          htmlFor="attendance-rate"
                          className="text-sm font-normal"
                        >
                          Attendance Rate
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="punctuality" />
                        <Label
                          htmlFor="punctuality"
                          className="text-sm font-normal"
                        >
                          Punctuality
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="overtime" />
                        <Label
                          htmlFor="overtime"
                          className="text-sm font-normal"
                        >
                          Overtime Hours
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border rounded-md p-3">
                    <Label className="font-medium">Project Metrics</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="project-progress" defaultChecked />
                        <Label
                          htmlFor="project-progress"
                          className="text-sm font-normal"
                        >
                          Project Progress
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="milestones" />
                        <Label
                          htmlFor="milestones"
                          className="text-sm font-normal"
                        >
                          Milestones Completed
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="budget" />
                        <Label htmlFor="budget" className="text-sm font-normal">
                          Budget Utilization
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="filters">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select defaultValue="last-month">
                    <SelectTrigger id="date-range" className="mt-1">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="department" className="mt-1">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="team-members">Team Members</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="team-members" className="mt-1">
                      <SelectValue placeholder="Select team members" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Team Members</SelectItem>
                      <SelectItem value="active">
                        Active Members Only
                      </SelectItem>
                      <SelectItem value="specific">
                        Select Specific Members
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="projects">Projects</Label>
                  <Select defaultValue="all">
                    <SelectTrigger id="projects" className="mt-1">
                      <SelectValue placeholder="Select projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      <SelectItem value="active">
                        Active Projects Only
                      </SelectItem>
                      <SelectItem value="completed">
                        Completed Projects
                      </SelectItem>
                      <SelectItem value="specific">
                        Select Specific Projects
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="border rounded-md p-3 space-y-2">
                <Label className="font-medium">Additional Filters</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-high-priority" />
                    <Label
                      htmlFor="filter-high-priority"
                      className="text-sm font-normal"
                    >
                      High Priority Tasks Only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-overdue" />
                    <Label
                      htmlFor="filter-overdue"
                      className="text-sm font-normal"
                    >
                      Include Overdue Items
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-completed" defaultChecked />
                    <Label
                      htmlFor="filter-completed"
                      className="text-sm font-normal"
                    >
                      Include Completed Items
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-compare" />
                    <Label
                      htmlFor="filter-compare"
                      className="text-sm font-normal"
                    >
                      Compare to Previous Period
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="schedule-frequency">Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger id="schedule-frequency" className="mt-1">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="schedule-day">Day</Label>
                  <Select defaultValue="monday">
                    <SelectTrigger id="schedule-day" className="mt-1">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monday">Monday</SelectItem>
                      <SelectItem value="tuesday">Tuesday</SelectItem>
                      <SelectItem value="wednesday">Wednesday</SelectItem>
                      <SelectItem value="thursday">Thursday</SelectItem>
                      <SelectItem value="friday">Friday</SelectItem>
                      <SelectItem value="saturday">Saturday</SelectItem>
                      <SelectItem value="sunday">Sunday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="schedule-time">Time</Label>
                  <Select defaultValue="8am">
                    <SelectTrigger id="schedule-time" className="mt-1">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8am">8:00 AM</SelectItem>
                      <SelectItem value="9am">9:00 AM</SelectItem>
                      <SelectItem value="12pm">12:00 PM</SelectItem>
                      <SelectItem value="3pm">3:00 PM</SelectItem>
                      <SelectItem value="5pm">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="delivery-method">Delivery Method</Label>
                  <Select defaultValue="email">
                    <SelectTrigger id="delivery-method" className="mt-1">
                      <SelectValue placeholder="Select delivery method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="slack">Slack</SelectItem>
                      <SelectItem value="teams">Microsoft Teams</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="recipients">Recipients</Label>
                <Input
                  id="recipients"
                  placeholder="Enter email addresses"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate multiple email addresses with commas
                </p>
              </div>

              <div className="border rounded-md p-3 space-y-2">
                <Label className="font-medium">Delivery Options</Label>
                <div className="grid gap-2 md:grid-cols-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="attach-pdf" defaultChecked />
                    <Label htmlFor="attach-pdf" className="text-sm font-normal">
                      Attach PDF
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="attach-excel" />
                    <Label
                      htmlFor="attach-excel"
                      className="text-sm font-normal"
                    >
                      Attach Excel
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="include-summary" defaultChecked />
                    <Label
                      htmlFor="include-summary"
                      className="text-sm font-normal"
                    >
                      Include Summary in Email
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="notify-changes" />
                    <Label
                      htmlFor="notify-changes"
                      className="text-sm font-normal"
                    >
                      Notify Only on Changes
                    </Label>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6">
          <Button variant="outline">Cancel</Button>
          <div className="flex gap-2">
            <Button variant="outline">
              <Save className="h-4 w-4 mr-1" />
              Save Draft
            </Button>
            <Button>
              <Wand2 className="h-4 w-4 mr-1" />
              Generate Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
