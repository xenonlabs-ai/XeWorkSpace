"use client"

import { useThemeContext } from "@/components/theme/theme-provider"
import { useMobile } from "@/hooks/use-mobile"
import { Dispatch, SetStateAction, useEffect } from "react"
import { DesktopSidebar } from "./desktop-sidebar"
import { MobileSidebar } from "./mobile-sidebar"

export interface SidebarProps {
	isCollapsed: boolean
	setIsCollapsed: Dispatch<SetStateAction<boolean>>
	isMobileOpen: boolean
	setIsMobileOpen: Dispatch<SetStateAction<boolean>>
	isHorizontalLayout?: boolean
}

export function Sidebar({
	isCollapsed,
	setIsCollapsed,
	isMobileOpen,
	setIsMobileOpen,
	isHorizontalLayout = false,
}: SidebarProps) {
	const { direction } = useThemeContext()
	const isMobile = useMobile()

	// Update collapsed state when switching between mobile and desktop
	useEffect(() => {
		if (isMobile && !isMobileOpen) {
			setIsCollapsed(true)
		}
	}, [isMobile, isMobileOpen, setIsCollapsed])

	// Render mobile sidebar or horizontal layout
	if (isMobile || isHorizontalLayout) {
		return <MobileSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} direction={direction as "ltr" | "rtl"} />
	}

	// Render desktop sidebar
	return <DesktopSidebar isCollapsed={isCollapsed} direction={direction as "ltr" | "rtl"} /> // Remove unused setIsCollapsed
}
