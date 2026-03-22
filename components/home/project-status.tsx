

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react"

export function ProjectStatusWidget() {
	const projects = [
		{
			name: "Website Design",
			status: "On Track",
			color: "green",
			icon: CheckCircle2,
			progress: 65,
			dueDate: "Jun 15",
		},
		{
			name: "Mobile App",
			status: "At Risk",
			color: "amber",
			icon: AlertTriangle,
			progress: 42,
			dueDate: "Jul 10",
		},
		{
			name: "Marketing task",
			status: "Completed",
			color: "blue",
			icon: CheckCircle2,
			progress: 100,
			dueDate: "May 30",
		},
		{
			name: "Product Launch",
			status: "Delayed",
			color: "red",
			icon: XCircle,
			progress: 25,
			dueDate: "Aug 5",
		},
	]

	return (
		<Card>
			<CardHeader>
				<CardTitle>Project Status</CardTitle>
			</CardHeader>

			<CardContent className="space-y-4">
				{projects.map((p) => {
					const Icon = p.icon
					return (
						<div
							key={p.name}
							className="group flex items-start gap-2 rounded-xl border border-border/50 p-4 hover:bg-muted/30 transition-colors"
						>
							{/* Large Icon */}
							<div
								className={`flex items-center justify-center w-9 h-9 rounded-full bg-${p.color}-100 dark:bg-${p.color}-500/20`}
							>
								<Icon className={`w-5 h-5 text-${p.color}-600 dark:text-${p.color}-400`} />
							</div>

							{/* Project Details */}
							<div className="flex-1 min-w-0 space-y-2">
								<div className="flex justify-between items-center">
									<h4 className="font-medium text-sm truncate text-foreground">
										{p.name}
									</h4>
									<Badge
										className={`text-xs font-medium px-1.5 py-0.25 capitalize bg-${p.color}-100 text-${p.color}-700 dark:bg-${p.color}-500/20 dark:text-${p.color}-400`}
									>
										{p.status}
									</Badge>
								</div>

								<div className="flex justify-between text-xs text-muted-foreground">
									<span>{p.progress}% Complete</span>
									<span className="flex items-center gap-1">
										<Clock className="w-3.5 h-3.5" /> {p.dueDate}
									</span>
								</div>

								{/* Progress Bar */}
								<div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden mt-1">
									<div
										className={`bg-${p.color}-500 h-2 rounded-full transition-all duration-500`}
										style={{ width: `${p.progress}%` }}
									/>
								</div>
							</div>
						</div>
					)
				})}
			</CardContent>
		</Card>
	)
}
