"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

interface UserProfileProps {
  mobile?: boolean;
  isCollapsed: boolean;
}

export function UserProfile({ mobile = false, isCollapsed }: UserProfileProps) {
  const { data: session } = useSession();

  const userName = session?.user?.name || "User";
  const userEmail = session?.user?.email || "";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" });
  };

  return (
    <div className="flex items-center gap-3 py-2">
      <Avatar className="h-10 w-10">
        <AvatarImage src={session?.user?.image || "/images/users/1.jpg"} alt={userName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      {/* Show text only when not collapsed OR when mobile */}
      {(!isCollapsed || mobile) && (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{userName}</span>
          <span className="text-xs text-muted-foreground">
            {userEmail}
          </span>
        </div>
      )}

      {/* Show logout button only when not collapsed OR mobile */}
      {(!isCollapsed || mobile) && (
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto h-8 w-8"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Log out</span>
        </Button>
      )}
    </div>
  );
}
