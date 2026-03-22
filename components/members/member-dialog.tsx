"use client";

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
    Phone,
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
};

interface MemberDialogProps {
  member: Member | null;
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

export function MemberDialog({ member, isOpen, onClose }: MemberDialogProps) {
  const router = useRouter();

  if (!member) return null;
  // Construct image path dynamically (e.g. /images/users/1.jpg)
  // You can adjust the extension or logic as needed.
  const imageUrl =
    member.avatar && !member.avatar.startsWith("http")
      ? `/images/users/${member.id}.jpg`
      : member.avatar || `/images/users/1.jpg`;

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
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="info">Information</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
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
        </Tabs>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            className="sm:mr-auto"
            onClick={() => onClose(false)}
          >
            Close
          </Button>
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
