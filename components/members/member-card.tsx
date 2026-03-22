"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, User } from "lucide-react";
import { useRouter } from "next/navigation";

type Member = {
  id: string | number;
  name: string;
  avatar?: string; // now holds filename or numeric ID
  role?: string;
  status?: "Active" | "Inactive" | string;
  accessLevel?: string;
  email?: string;
  skills?: string[];
};

interface MemberCardProps {
  member: Member;
  onClick?: () => void;
}

export function MemberCard({ member, onClick }: MemberCardProps) {
  const router = useRouter();

  // Construct image path dynamically (e.g. /images/users/1.jpg)
  // You can adjust the extension or logic as needed.
  const imageUrl =
    member.avatar && !member.avatar.startsWith("http")
      ? `/images/users/${member.id}.jpg`
      : member.avatar || `/images/users/1.jpg`;

  return (
    <Card
      onClick={onClick}
      className="cursor-pointer"
      title="Click for detail"
    >
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20">
            <AvatarImage
              src={imageUrl}
              alt={member.name || "User"}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {member.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div>
            <CardTitle className="text-lg font-semibold">
              {member.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-0.5 text-sm">
              <span>{member.role}</span>
              {member.status && (
                <Badge
                  variant={member.status === "Active" ? "outline" : "secondary"}
                  className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
                    member.status === "Active"
                      ? "border-green-400 text-green-600"
                      : ""
                  }`}
                >
                  {member.status}
                </Badge>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="text-sm space-y-3">
          {member.email && (
            <div className="flex justify-between text-muted-foreground">
              <span>Email</span>
              <span className="font-medium text-foreground">
                {member.email}
              </span>
            </div>
          )}

          {member.accessLevel && (
            <div className="flex justify-between text-muted-foreground">
              <span>Access</span>
              <span className="font-medium text-foreground">
                {member.accessLevel}
              </span>
            </div>
          )}

          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {member.skills.slice(0, 3).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs font-medium px-2 py-0.5 rounded-md"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-5 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 gap-2 text-sm font-medium hover:bg-primary hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`#/members/profile/${member.id}`); //Just remove the # tag for actual profile
              }}
            >
              <User className="h-4 w-4" />
              Profile
            </Button>
            <Button
              size="sm"
              className="flex-1 gap-2 text-sm font-medium"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/messages?user=${member.id}`);
              }}
            >
              <MessageSquare className="h-4 w-4" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
