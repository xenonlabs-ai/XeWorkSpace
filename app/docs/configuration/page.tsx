import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Flag, Palette, Server } from "lucide-react"
import Link from "next/link"

export default function ConfigurationPage() {
	return (
		<div className="space-y-8">
			<div className="space-y-4">
				<h1 className="text-4xl font-semibold tracking-tight">Configuration</h1>
				<p className="text-lg text-muted-foreground">
					Learn how to configure and customize XeTask to suit your needs.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Palette className="mr-2 h-5 w-5" />
							Theme Configuration
						</CardTitle>
						<CardDescription>Customize the appearance of your application</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">
							Learn how to configure the layout, direction, and theme of your XeTask application.
						</p>
						<Button variant="outline" asChild>
							<Link href="/docs/configuration/theme-config">View Details</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Server className="mr-2 h-5 w-5" />
							API Configuration
						</CardTitle>
						<CardDescription>Configure API endpoints and authentication</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">
							Learn how to configure API endpoints, authentication, and other API-related settings.
						</p>
						<Button variant="outline" asChild>
							<Link href="/docs/configuration/api-config">View Details</Link>
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="flex items-center">
							<Flag className="mr-2 h-5 w-5" />
							Feature Flags
						</CardTitle>
						<CardDescription>Enable or disable features</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">
							Learn how to use feature flags to enable or disable specific features in your application.
						</p>
						<Button variant="outline" asChild>
							<Link href="/docs/configuration/feature-flags">View Details</Link>
						</Button>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
