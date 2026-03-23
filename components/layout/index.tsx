"use client"

import { ChangePasswordModal } from "@/components/auth/change-password-modal"
import { Footer } from "@/components/layout/footer"
// import { HorizontalHeader } from "@/components/layout/horizontal-header"
import { Sidebar } from "@/components/layout/sidebar"
// import { VerticalHeader } from "@/components/layout/vertical-header"
import { useThemeContext } from "@/components/theme/theme-provider"
import { cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { ReactNode, useEffect, useMemo, useState } from "react"
import { HorizontalHeader } from "./header/horizontal-header"
import { VerticalHeader } from "./header/vertical-header"

// Tablet breakpoint - iPad Pro is 1024px wide
const TABLET_BREAKPOINT = 1024
const DESKTOP_BREAKPOINT = 1280
const IPAD_BREAKPOINT = 768

export function Layout({ children }: { children: ReactNode }) {
	// const { layout, direction } = useTheme()
	const { data: session } = useSession()
	const { layout, direction } = useThemeContext()

	// Check if user needs to change password
	const requiresPasswordChange = (session?.user as any)?.requiresPasswordChange || false
	const [showPasswordModal, setShowPasswordModal] = useState(false)

	useEffect(() => {
		if (requiresPasswordChange) {
			setShowPasswordModal(true)
		}
	}, [requiresPasswordChange])
	// Initialize collapsed state based on screen size (collapsed/hidden on tablet-sized screens)
	const [isCollapsed, setIsCollapsed] = useState(false)

	useEffect(() => {
		const handleResize = () => {
			const width = window.innerWidth
			setIsCollapsed(width >= IPAD_BREAKPOINT && width < DESKTOP_BREAKPOINT)
		}

		// Set initial state
		handleResize()

		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])
	const [isMobileOpen, setIsMobileOpen] = useState(false)
	const isVertical = layout === "vertical"
	const isHorizontal = layout === "horizontal"

	// Reset sidebar state when layout changes
	// useEffect(() => {
	// 	// Close mobile sidebar when layout changes
	// 	setIsMobileOpen(false)

	// 	// Set collapsed state based on layout
	// 	if (isHorizontal) {
	// 		setIsCollapsed(true) // Always start collapsed in horizontal mode
	// 	}
	// }, [layout, isHorizontal])

	// Toggle sidebar collapsed state
	const toggleSidebar = () => setIsCollapsed(!isCollapsed)

	// Memoize the container class to prevent unnecessary re-renders
	const containerClass = useMemo(() => {
		return cn(
			"min-h-screen bg-primary/[0.05]",
			direction === "rtl" && "rtl",
			// On iPad (768-1023px): no padding (sidebar is overlay), no padding when collapsed (sidebar hidden)
			// On larger screens (1024px+): mini padding (70px) when collapsed, full padding (260px) when expanded
			isVertical && !isCollapsed && "lg:pl-[260px]",
			isVertical && isCollapsed && "lg:pl-[70px]",
			direction === "rtl" && isVertical && !isCollapsed && "lg:pr-[260px] lg:pl-0",
			direction === "rtl" && isVertical && isCollapsed && "lg:pr-[70px] lg:pl-0",
		)
	}, [direction, isVertical, isCollapsed])

	return (
		<div className={containerClass}>
			{/* Password Change Modal - shown when user needs to change temp password */}
			<ChangePasswordModal
				open={showPasswordModal}
				onSuccess={() => setShowPasswordModal(false)}
			/>

			{/* Only render the sidebar for vertical layout or on mobile */}
			{(isVertical || isMobileOpen) && (
				<Sidebar
					isCollapsed={isCollapsed}
					setIsCollapsed={setIsCollapsed}
					isMobileOpen={isMobileOpen}
					setIsMobileOpen={setIsMobileOpen}
					isHorizontalLayout={isHorizontal}
				/>
			)}

			<div className="flex min-h-screen flex-col">
				{isVertical ? (
					<VerticalHeader toggleSidebar={toggleSidebar} setMobileOpen={setIsMobileOpen} />
				) : (
					<HorizontalHeader toggleSidebar={toggleSidebar} setMobileOpen={setIsMobileOpen} />
				)}
				<main className="flex-1">
					<div className="p-4 px-8">{children}</div>
				</main>
				<Footer />
			</div>
		</div>
	)
}


