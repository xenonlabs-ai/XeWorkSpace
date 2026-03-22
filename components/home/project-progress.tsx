

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

export function ProjectProgressWidget() {
	const milestones = [
		{ name: "Planning", completed: true, date: "Apr 10" },
		{ name: "Design", completed: true, date: "Apr 25" },
		{ name: "Development", completed: true, date: "May 15" },
		{ name: "Testing", completed: false, date: "May 30" },
		{ name: "Deployment", completed: false, date: "Jun 10" },
		{ name: "Issues Indentifying", completed: false, date: "Jun 15" },
		// { name: "Final Deployment", completed: false, date: "Jun 20" },
	]

	const completedCount = milestones.filter((m) => m.completed).length
	const progressPercentage = Math.round(
		(completedCount / milestones.length) * 100
	)

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Project Progress
				</CardTitle>
			</CardHeader>

			<CardContent className="space-y-6">
				{/* Overall Progress Bar */}
				<div>
					<div className="flex justify-between mb-2">
						<span className="text-sm text-muted-foreground font-medium">
							Overall Progress
						</span>
						<span className="text-sm font-semibold text-foreground">
							{progressPercentage}%
						</span>
					</div>

					<div className="relative w-full h-1.5 rounded-full bg-muted overflow-hidden">
						<div
							className="absolute left-0 top-0 h-full bg-primary transition-all duration-700 ease-in-out rounded-full"
							style={{ width: `${progressPercentage}%` }}
						/>
						<div
							className="absolute left-0 top-0 h-full bg-primary/30 blur-sm rounded-full transition-all duration-700 ease-in-out"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
				</div>

				{/* Timeline */}
				<div className="relative mt-2">
					{/* Vertical line */}
					<div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-muted"></div>

					<div className="space-y-7">
						{milestones.map((milestone, index) => (
							<div
								key={index}
								className="relative flex items-start gap-3 pl-10 group"
							>
								{/* Step Icon */}
								<div
									className={`absolute left-0 flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${milestone.completed
										? "bg-primary border-primary text-primary-foreground"
										: "bg-background border-muted text-muted-foreground group-hover:border-primary/50"
										}`}
								>
									{milestone.completed ? (
										<CheckCircle2 className="w-5 h-5" />
									) : (
										<Circle className="w-5 h-5" />
									)}
								</div>

								{/* Step Content */}
								<div className="flex-1">
									<p
										className={`text-sm font-medium transition-colors ${milestone.completed
											? "text-foreground"
											: "text-muted-foreground group-hover:text-foreground"
											}`}
									>
										{milestone.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{milestone.date}
									</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
