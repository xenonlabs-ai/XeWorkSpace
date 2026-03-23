"use client"

import navItems, { type NavItem, type UserRole } from "@/components/layout/navItems"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { MouseEvent } from "react"
import { useMemo, useState } from "react"

type NavigationItemsProps = {
	onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
	isCollapsed?: boolean
	mobile?: boolean
	direction?: "ltr" | "rtl"
}

export function NavigationItems({
	onClick,
	isCollapsed = false,
	mobile = false,
	direction = "ltr",
}: NavigationItemsProps) {
	const pathname = usePathname()
	const { data: session } = useSession()
	const [openSubMenu, setOpenSubMenu] = useState<string | null>(null)

	// Filter nav items based on user role
	const filteredNavItems = useMemo(() => {
		const userRole = (session?.user?.role as UserRole) || "MEMBER"
		return navItems.filter((item) => {
			// If no roles specified, accessible to all
			if (!item.roles) return true
			// Check if user role is in allowed roles
			return item.roles.includes(userRole)
		})
	}, [session?.user?.role])

	const isActive = (path: string): boolean => {
		if (path === "/" && pathname === "/") return true
		if (path !== "/" && pathname.startsWith(path)) return true
		return false
	}

	const handleParentClick = (
		event: MouseEvent<HTMLAnchorElement>,
		item: NavItem,
		isSubItem = false,
	) => {
		if (item.subItems && item.subItems.length > 0) {
			event.preventDefault() // Prevent default link navigation for parent items with sub-menus
			setOpenSubMenu((prev) => (prev === item.href ? null : item.href))
		} else {
			// Only call onClick (which closes mobile sidebar) for items without submenus or for sub-items
			onClick?.(event)
		}
	}

	const renderNavItem = (item: NavItem, isSubItem = false) => {
		const active = isActive(item.href)
		const hasSubItems = item.subItems && item.subItems.length > 0
		const isOpen = openSubMenu === item.href

		return (
			<div key={item.href}>
				<Link
					href={item.href}
					className={cn(
						"group relative flex items-center gap-2.5 rounded-md px-2.5 py-3 text-sm font-medium transition-all duration-200 ease-in-out",
						"hover:bg-primary/10 hover:text-primary hover:shadow-primary/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
						active
							? "bg-primary/10 text-primary"
							: "text-muted-foreground",
						direction === "rtl" && "flex-row-reverse",
						isCollapsed && !mobile && "justify-center px-2",
						mobile && "text-base py-2.5",
						isSubItem && "pl-8 py-2 text-sm", // Styling for sub-items
						hasSubItems && "justify-between", // For parent items with sub-menus
					)}
					onClick={(e) => handleParentClick(e, item, isSubItem)}
				>
					<span
						className={cn(
							"relative flex items-center gap-2.5",
							isCollapsed && !mobile && "justify-center",
						)}
					>
						<item.icon
							className={cn(
								"h-5 w-5 transition-all",
								active ? "text-primary" : "text-primary/70",
								!active && "group-hover:text-primary",
							)}
						/>
						{(!isCollapsed || mobile) && (
							<span
								className={cn(
									"truncate transition-colors",
									active ? "font-medium" : "font-normal",
								)}
							>
								{item.name}
							</span>
						)}
					</span>
					{hasSubItems && (!isCollapsed || mobile) && (
						<ChevronDown
							className={cn(
								"h-4 w-4 shrink-0 transition-transform duration-200",
								isOpen ? "rotate-180" : "rotate-0",
							)}
						/>
					)}
				</Link>
				{hasSubItems && isOpen && (!isCollapsed || mobile) && (
					<div className="ml-4 mt-1 grid gap-1">
						{item.subItems?.map((subItem) =>
							renderNavItem(subItem, true),
						)}
					</div>
				)}
			</div>
		)
	}

	return (
		<nav className="grid gap-1.5">
			{filteredNavItems.map((item) => renderNavItem(item))}
		</nav>
	)
}