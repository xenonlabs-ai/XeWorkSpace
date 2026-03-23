"use client"

import { MonitoringContent } from "@/components/monitoring"
import { Layout } from "@/components/layout"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function MonitoringPage() {
	const { data: session, status } = useSession()
	const router = useRouter()

	useEffect(() => {
		// Redirect members to consent page - they can't monitor others
		if (status === "authenticated" && session?.user?.role === "MEMBER") {
			router.replace("/monitoring/consent")
		}
	}, [session, status, router])

	// Show loading while checking session
	if (status === "loading") {
		return (
			<Layout>
				<div className="flex items-center justify-center h-96">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			</Layout>
		)
	}

	// Don't render monitoring content for members (they'll be redirected)
	if (session?.user?.role === "MEMBER") {
		return (
			<Layout>
				<div className="flex items-center justify-center h-96">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
				</div>
			</Layout>
		)
	}

	return (
		<Layout>
			<MonitoringContent />
		</Layout>
	)
}
