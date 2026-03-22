import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart4, Download, Eye, FileText, Settings, Shield, ShieldCheck, Users } from "lucide-react"
import { ReactNode } from "react"

type RoleType = "admin" | "manager" | "member" | "viewer"
type CategoryType = "Dashboard" | "Team" | "Projects" | "Reports" | "Settings"

export function RoleVisualization() {
	const permissions: Record<RoleType, { category: CategoryType; actions: string[] }[]> = {
		admin: [
			{ category: "Dashboard", actions: ["View", "Edit", "Create", "Delete"] },
			{ category: "Team", actions: ["View", "Add", "Edit", "Remove"] },
			{ category: "Projects", actions: ["View", "Create", "Edit", "Delete", "Assign"] },
			{ category: "Reports", actions: ["View", "Create", "Export", "Schedule"] },
			{ category: "Settings", actions: ["View", "Edit", "Billing", "System"] },
		],
		manager: [
			{ category: "Dashboard", actions: ["View", "Edit", "Create"] },
			{ category: "Team", actions: ["View", "Add", "Edit"] },
			{ category: "Projects", actions: ["View", "Create", "Edit", "Assign"] },
			{ category: "Reports", actions: ["View", "Create", "Export", "Schedule"] },
			{ category: "Settings", actions: ["View"] },
		],
		member: [
			{ category: "Dashboard", actions: ["View"] },
			{ category: "Team", actions: ["View"] },
			{ category: "Projects", actions: ["View", "Edit"] },
			{ category: "Reports", actions: ["View"] },
			{ category: "Settings", actions: [] },
		],
		viewer: [
			{ category: "Dashboard", actions: ["View"] },
			{ category: "Team", actions: ["View"] },
			{ category: "Projects", actions: ["View"] },
			{ category: "Reports", actions: ["View"] },
			{ category: "Settings", actions: [] },
		],
	}

	const roleIcons: Record<RoleType, ReactNode> = {
		admin: <Shield className="h-5 w-5" />,
		manager: <ShieldCheck className="h-5 w-5" />,
		member: <Users className="h-5 w-5" />,
		viewer: <Eye className="h-5 w-5" />,
	}

	const categoryIcons: Record<CategoryType, ReactNode> = {
		Dashboard: <BarChart4 className="h-4 w-4" />,
		Team: <Users className="h-4 w-4" />,
		Projects: <FileText className="h-4 w-4" />,
		Reports: <Download className="h-4 w-4" />,
		Settings: <Settings className="h-4 w-4" />,
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Role Permission Visualization</CardTitle>
				<CardDescription>Visual representation of permissions by role</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{(Object.entries(permissions) as [RoleType, { category: CategoryType; actions: string[] }[]][]).map(([role, categories]) => (
						<Card key={role} className="border shadow-sm">
							<CardHeader>
								<div className="flex items-center gap-2">
									{roleIcons[role]}
									<CardTitle className="text-lg capitalize">{role}</CardTitle>
								</div>
								<CardDescription>
									{role === "admin" && "Full access to all resources"}
									{role === "manager" && "Can manage team members and projects"}
									{role === "member" && "Regular team member with limited access"}
									{role === "viewer" && "Read-only access to resources"}
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{categories.map((category) => (
										<div key={category.category} className="border-b pb-2 last:border-0">
											<div className="flex items-center gap-2 mb-1.5">
												{categoryIcons[category.category]}
												<span className="font-medium text-sm">{category.category}</span>
											</div>
											<div className="flex flex-wrap gap-1.5">
												{category.actions.map((action) => (
													<Badge
														key={action}
														variant={
															action === "Delete" || action === "Remove"
																? "destructive"
																: action === "View"
																	? "secondary"
																	: "outline"
														}
														className="text-xs"
													>
														{action}
													</Badge>
												))}
												{category.actions.length === 0 && (
													<span className="text-xs text-muted-foreground">No permissions</span>
												)}
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
