import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { SessionProvider } from "@/components/providers/session-provider"
import { Inter } from "next/font/google"
import { ReactNode } from "react"

export const metadata = {
	title: "XeWorkspace - Team Management & Productivity Platform",
	description: "Manage your team, monitor productivity, and boost performance with XeWorkspace.",
}

const inter = Inter({
	weight: ["300", "400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
})

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<SessionProvider>
					<ThemeProvider>{children}</ThemeProvider>
				</SessionProvider>
			</body>
		</html>
	)
}
