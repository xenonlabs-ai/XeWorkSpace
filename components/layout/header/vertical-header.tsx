"use client"

import { ThemeConfig } from "@/components/theme/theme-config"
import { useThemeContext } from "@/components/theme/theme-provider"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { AuthButtons } from "./auth-buttons"
import { NotificationsMenu } from "./notifications-menu"
import { ProfileMenu } from "./profile-menu"
import { SearchDialog } from "./search-dialog"
import { ThemeToggle } from "./theme-toggle"

interface SearchResult {
	id: number
	title: string
	type: string
	href: string
}

// Search function - searches through navigation items
const getSearchResults = (query: string) => {
	if (!query) return []

	const searchableItems = [
		{ id: 1, title: "Dashboard", type: "Page", href: "/" },
		{ id: 2, title: "Members", type: "Page", href: "/members" },
		{ id: 3, title: "Tasks", type: "Page", href: "/tasks" },
		{ id: 4, title: "Calendar", type: "Page", href: "/calendar" },
		{ id: 5, title: "Messages", type: "Page", href: "/messages" },
		{ id: 6, title: "Attendance", type: "Page", href: "/attendance" },
		{ id: 7, title: "Reports", type: "Page", href: "/reports" },
		{ id: 8, title: "Settings", type: "Page", href: "/settings" },
		{ id: 9, title: "Performance", type: "Page", href: "/performance" },
		{ id: 10, title: "Monitoring", type: "Page", href: "/monitoring" },
	]
	return searchableItems.filter((item) =>
		item.title.toLowerCase().includes(query.toLowerCase())
	)
}

interface VerticalHeaderProps {
	toggleSidebar: () => void
	setMobileOpen: (open: boolean) => void
}

export function VerticalHeader({ toggleSidebar, setMobileOpen }: VerticalHeaderProps) {
	const { direction } = useThemeContext()
	const { data: session, status } = useSession()
	const isLoggedIn = status === "authenticated"
	const [searchOpen, setSearchOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState("")
	const searchResults = getSearchResults(searchQuery)

	const handleLogout = () => {
		signOut({ callbackUrl: "/auth/login" })
	}

	return (
		<header className="sticky top-0 z-40 w-full border-0 bg-background">
			<div className="container flex h-16 items-center justify-between px-3 sm:px-4 md:px-6 max-w-full">
				<div className="flex items-center gap-2">
					{/* Sidebar Toggle Button - Shows on large screens (1024px+) */}
					<Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2 hidden lg:flex h-9 w-9 cursor-pointer">
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle sidebar</span>
					</Button>

					{/* Mobile menu button - Shows on screens below 1024px */}
					<Button variant="ghost" size="icon" className="lg:hidden text-foreground" onClick={() => setMobileOpen(true)}>
						<Menu className="h-5 w-5" />
						<span className="sr-only">Toggle menu</span>
					</Button>

					{/* Search Dialog */}
					<SearchDialog
						searchOpen={searchOpen}
						setSearchOpen={setSearchOpen}
						searchQuery={searchQuery}
						setSearchQuery={setSearchQuery}
						searchResults={searchResults}
					/>
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
				</div>
			</div>
		</header>
	)
}
