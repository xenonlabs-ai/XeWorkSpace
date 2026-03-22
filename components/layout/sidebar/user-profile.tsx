import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";

interface UserProfileProps {
  mobile?: boolean;
  isCollapsed: boolean;
}

export function UserProfile({ mobile = false, isCollapsed }: UserProfileProps) {
  return (
    <div className="flex items-center gap-3 py-2">
      <Avatar className="h-10 w-10">
        <AvatarImage src="/images/users/1.jpg" alt="User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>

      {/* Show text only when not collapsed OR when mobile */}
      {(!isCollapsed || mobile) && (
        <div className="flex flex-col">
          <span className="text-sm font-medium">John Doe</span>
          <span className="text-xs text-muted-foreground">
            john.doe@example.com
          </span>
        </div>
      )}

      {/* Show logout button only when not collapsed OR mobile */}
      {(!isCollapsed || mobile) && (
        <Button variant="ghost" size="icon" className="ml-auto h-8 w-8" asChild>
          <Link href="/auth/login">
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Link>
        </Button>
      )}
    </div>
  );
}
