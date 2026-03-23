"use client";

import navItems, { type UserRole } from "@/components/layout/navItems";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { NavigationItems } from "./navigation-items";
import { QuickActions } from "./quick-actions";
import { UserProfile } from "./user-profile";

interface DesktopSidebarProps {
  isCollapsed: boolean;
  direction?: "ltr" | "rtl";
}

export function DesktopSidebar({ isCollapsed, direction = "ltr" }: DesktopSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || "User";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  // Filter nav items based on user role
  const filteredNavItems = useMemo(() => {
    const userRole = (session?.user?.role as UserRole) || "MEMBER";
    return navItems.filter((item) => {
      if (!item.roles) return true;
      return item.roles.includes(userRole);
    });
  }, [session?.user?.role]);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "fixed top-0 bottom-0 z-40 hidden lg:flex h-screen flex-col border-0 bg-card shadow-none transition-all duration-300",
          isCollapsed ? "w-[70px]" : "w-[260px]",
          direction === "rtl" ? "right-0" : "left-0"
        )}
      >
        {/* Logo in Sidebar */}
        <div className="flex h-16 shrink-0 items-center border-0 px-3 py-4">
          <Logo showText={!isCollapsed} />
        </div>

        <div className="flex-1 overflow-hidden">
          {/* Main Navigation */}
          <div className="px-3 py-4">
            {!isCollapsed && (
              <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground rtl:text-right">
                MAIN NAVIGATION
              </h2>
            )}
            <ScrollArea className="h-[calc(100vh-400px)]">
              {isCollapsed ? (
                <div className="grid gap-1">
                  {filteredNavItems.map((item) => {
                    const hasSubItems = item.subItems && item.subItems.length > 0;

                    if (hasSubItems) {
                      return (
                        <HoverCard key={item.name} openDelay={0} closeDelay={100}>
                          <HoverCardTrigger asChild>
                            <Link
                              href={item.href}
                              className={cn(
                                "flex items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                                isActive(item.href)
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground"
                              )}
                            >
                              <item.icon
                                className={cn(
                                  "h-5 w-5",
                                  isActive(item.href) && "text-primary"
                                )}
                              />
                            </Link>
                          </HoverCardTrigger>
                          <HoverCardContent
                            side={direction === "rtl" ? "left" : "right"}
                            align="start"
                            className="w-48 p-2"
                          >
                            <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                              {item.name}
                            </div>
                            <div className="grid gap-1">
                              {item.subItems?.map((subItem: any) => (
                                <Link
                                  key={subItem.name}
                                  href={subItem.href}
                                  className={cn(
                                    "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                                    isActive(subItem.href)
                                      ? "bg-primary/10 text-primary"
                                      : "text-muted-foreground"
                                  )}
                                >
                                  {subItem.icon && (
                                    <subItem.icon className="h-4 w-4" />
                                  )}
                                  <span>{subItem.name}</span>
                                </Link>
                              ))}
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      );
                    }

                    return (
                      <Tooltip key={item.name} delayDuration={0}>
                        <TooltipTrigger asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center justify-center rounded-md p-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                              isActive(item.href)
                                ? "bg-primary/10 text-primary"
                                : "text-muted-foreground"
                            )}
                          >
                            <item.icon
                              className={cn(
                                "h-5 w-5",
                                isActive(item.href) && "text-primary"
                              )}
                            />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent
                          side={direction === "rtl" ? "left" : "right"}
                        >
                          {item.name}
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ) : (
                <NavigationItems
                  isCollapsed={isCollapsed}
                  mobile={false}
                  direction={direction}
                />
              )}
            </ScrollArea>
          </div>

          {/* Quick Actions Section */}
          {!isCollapsed ? (
            <div className="px-3 py-4">
              <h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
                QUICK ACTIONS
              </h2>
              <QuickActions mobile={false} isCollapsed={isCollapsed} />
            </div>
          ) : (""
            
          )}
        </div>

        {/* User Profile Section */}
        <div className="mt-auto border-t p-3">
          {isCollapsed ? (
            <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={session?.user?.image || "/images/users/1.jpg"} alt={userName} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent side={direction === "rtl" ? "left" : "right"}>
                {userName}
              </TooltipContent>
            </Tooltip>
          ) : (
            <UserProfile isCollapsed={isCollapsed} />
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}
