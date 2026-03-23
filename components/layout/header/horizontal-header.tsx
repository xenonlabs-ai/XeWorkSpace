"use client"

import { Logo } from "@/components/logo"
import { ThemeConfig } from "@/components/theme/theme-config"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { AuthButtons } from "./auth-buttons"
import { NavigationLinks } from "./navigation-links"
import { NotificationsMenu } from "./notifications-menu"
import { ProfileMenu } from "./profile-menu"
import { ThemeToggle } from "./theme-toggle"

interface HorizontalHeaderProps {
  toggleSidebar: () => void
  setMobileOpen: (open: boolean) => void
}

export function HorizontalHeader({
  toggleSidebar,
  setMobileOpen,
}: HorizontalHeaderProps) {
  const { data: session, status } = useSession()
  const isLoggedIn = status === "authenticated"

  const handleLogout = () => {
    signOut({ callbackUrl: "/auth/login" })
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card">
      <div className="container flex h-16 items-center justify-between px-3 sm:px-4 md:px-6 max-w-full">
        <div className="flex items-center gap-2">
          {/* Logo component with responsive behavior */}
          <Logo showText={false} className="sm:hidden" />
          <Logo className="hidden sm:flex" />

          {/* Navigation Links */}
          <NavigationLinks />
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Appearance Settings */}
          <ThemeConfig />

          {isLoggedIn ? (
            <>
              {/* Notification Dropdown */}
              <NotificationsMenu />

              {/* Profile Dropdown */}
              <ProfileMenu
                handleLogout={handleLogout}
                userName={session?.user?.name || "User"}
                userEmail={session?.user?.email || ""}
              />
            </>
          ) : (
            <AuthButtons />
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden text-foreground" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
