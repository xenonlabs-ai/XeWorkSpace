"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AvatarImage } from "@radix-ui/react-avatar";
import {
  Briefcase,
  Calendar,
  Mail,
  MapPin,
  MessageSquare,
  Monitor,
  MonitorOff,
  Phone,
  Trash2,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Member = {
  id: string | number;
  name: string;
  avatar: string;
  role: string;
  status: "Active" | "Inactive" | string;
  accessLevel: string;
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
  bio: string;
  projects: string[];
  skills: string[];
  monitoringStatus?: "NOT_ENABLED" | "PENDING_EMPLOYEE" | "ACTIVE" | "REVOKED";
};

interface MemberDialogProps {
  member: Member | null;
  isOpen: boolean;
  onClose: (open: boolean) => void;
  isAdminOrOwner?: boolean;
  onToggleMonitoring?: (memberId: string | number) => void;
  onDeleteMember?: (memberId: string | number) => void;
}

export function MemberDialog({
  member,
  isOpen,
  onClose,
  isAdminOrOwner = false,
  onToggleMonitoring,
  onDeleteMember,
}: MemberDialogProps) {
  const router = useRouter();

  if (!member) return null;
  // Construct image path dynamically (e.g. /images/users/1.jpg)
  // You can adjust the extension or logic as needed.
  const imageUrl =
    member.avatar && !member.avatar.startsWith("http")
      ? `/images/users/${member.id}.jpg`
      : member.avatar || `/images/users/1.jpg`;

  const isMonitoringEnabled =
    member.monitoringStatus === "ACTIVE" ||
    member.monitoringStatus === "PENDING_EMPLOYEE";
  const canDelete = isAdminOrOwner && member.accessLevel !== "Owner";

  const getMonitoringStatusBadge = () => {
    switch (member.monitoringStatus) {
      case "ACTIVE":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-300">
            Active
          </Badge>
        );
      case "PENDING_EMPLOYEE":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
            Pending Consent
          </Badge>
        );
      case "REVOKED":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-300">
            Revoked
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">Not Enabled</Badge>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
            <Avatar className="h-20 w-20 border-4 border-primary/10">
              <AvatarImage
                src={imageUrl}
                alt={member.name || "User"}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                {member.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left">
              <DialogTitle className="text-2xl">{member.name}</DialogTitle>
              <DialogDescription className="flex flex-wrap justify-center sm:justify-start items-center gap-2 mt-1">
                <span>{member.role}</span>
                <Badge
                  variant={member.status === "Active" ? "outline" : "secondary"}
                >
                  {member.status}
                </Badge>
                <Badge variant="default">{member.accessLevel}</Badge>
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-2">
          <TabsList className={`grid mb-4 ${isAdminOrOwner ? "grid-cols-4" : "grid-cols-3"}`}>
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            {isAdminOrOwner && (
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">
                    {member.email}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Phone</div>
                  <div className="text-sm text-muted-foreground">
                    {member.phone}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-sm text-muted-foreground">
                    {member.location}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Joined</div>
                  <div className="text-sm text-muted-foreground">
                    {member.joinedDate}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-sm font-medium mb-2">Bio</div>
              <div className="text-sm text-muted-foreground">{member.bio}</div>
            </div>
          </TabsContent>

          <TabsContent value="projects">
            <div className="space-y-3">
              {member.projects.map((project, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-md border"
                >
                  <Briefcase className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">{project}</div>
                    <div className="text-sm text-muted-foreground">
                      Active project
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="skills">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="pt-2">
                <div className="text-sm font-medium mb-2">Expertise Areas</div>
                <div className="space-y-2">
                  {member.skills.map((skill, index) => {
                    const percentage = 70 + Math.floor(Math.random() * 30);
                    return (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{skill}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary rounded-full h-2"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </TabsContent>

          {isAdminOrOwner && (
            <TabsContent value="monitoring">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Monitoring Status</div>
                      <div className="text-sm text-muted-foreground">
                        {member.monitoringStatus === "ACTIVE"
                          ? "This employee is actively being monitored"
                          : member.monitoringStatus === "PENDING_EMPLOYEE"
                          ? "Waiting for employee consent"
                          : member.monitoringStatus === "REVOKED"
                          ? "Employee or admin revoked monitoring"
                          : "Monitoring not enabled for this employee"}
                      </div>
                    </div>
                  </div>
                  {getMonitoringStatusBadge()}
                </div>

                <Button
                  variant={isMonitoringEnabled ? "outline" : "default"}
                  className={`w-full gap-2 ${
                    isMonitoringEnabled
                      ? "text-orange-600 border-orange-300 hover:bg-orange-50"
                      : ""
                  }`}
                  onClick={() => {
                    onToggleMonitoring?.(member.id);
                    onClose(false);
                  }}
                >
                  {isMonitoringEnabled ? (
                    <>
                      <MonitorOff className="h-4 w-4" />
                      Disable Monitoring
                    </>
                  ) : (
                    <>
                      <Monitor className="h-4 w-4" />
                      Enable Monitoring
                    </>
                  )}
                </Button>

                <div className="text-xs text-muted-foreground">
                  {isMonitoringEnabled
                    ? "Disabling monitoring will stop screen capture and activity tracking for this employee."
                    : "Enabling monitoring will send a consent request to the employee. Monitoring will begin once they accept."}
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2 sm:mr-auto">
            <Button variant="outline" onClick={() => onClose(false)}>
              Close
            </Button>
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1"
                  >
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Remove Employee</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove <strong>{member.name}</strong> from your
                      organization. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => {
                        onDeleteMember?.(member.id);
                        onClose(false);
                      }}
                    >
                      Remove Employee
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-1"
              onClick={() => router.push(`/members/profile/${member.id}`)}
            >
              <User className="h-4 w-4" />
              View Profile
            </Button>
            <Button
              className="gap-1"
              onClick={() => router.push(`/messages?user=${member.id}`)}
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
