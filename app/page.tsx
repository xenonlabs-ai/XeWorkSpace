import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LandingPage } from "@/components/landing"

export default async function RootPage() {
	const session = await getServerSession(authOptions)

	// If user is authenticated, redirect to dashboard
	if (session) {
		redirect("/dashboard")
	}

	// Show landing page for unauthenticated users
	return <LandingPage />
}
