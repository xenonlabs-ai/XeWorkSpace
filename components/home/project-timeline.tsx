"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

const TIMELINE_THEME = {
	"bg-blue-500": {
		badgeBg: "bg-blue-100 dark:bg-blue-500/20",
		badgeText: "text-blue-800 dark:text-blue-200",
		bar: "bg-blue-500",
	},
	"bg-purple-500": {
		badgeBg: "bg-purple-100 dark:bg-purple-500/20",
		badgeText: "text-purple-800 dark:text-purple-200",
		bar: "bg-purple-500",
	},
	"bg-green-500": {
		badgeBg: "bg-green-100 dark:bg-green-500/20",
		badgeText: "text-green-800 dark:text-green-200",
		bar: "bg-green-500",
	},
	"bg-amber-500": {
		badgeBg: "bg-amber-100 dark:bg-amber-500/20",
		badgeText: "text-amber-800 dark:text-amber-200",
		bar: "bg-amber-500",
	},
}

export function ProjectTimelineWidget() {
	const timelineItems = [
		{
			project: "Website Redesign",
			phase: "Development",
			startDate: "May 1",
			endDate: "May 30",
			progress: 60,
			color: "bg-blue-500",
		},
		{
			project: "Mobile App",
			phase: "Design",
			startDate: "May 10",
			endDate: "Jun 15",
			progress: 40,
			color: "bg-purple-500",
		},
		{
			project: "Marketing Campaign",
			phase: "Planning",
			startDate: "May 15",
			endDate: "May 25",
			progress: 20,
			color: "bg-green-500",
		},
		{
			project: "Product Launch",
			phase: "Preparation",
			startDate: "Jun 1",
			endDate: "Jul 15",
			progress: 15,
			color: "bg-amber-500",
		},
	]

	const todayPosition = 18 // % position of today marker

	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

	return (
		<Card className="overflow-hidden">
			<CardHeader>
				<CardTitle>Project Timeline</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Timeline month headers */}
				<div className="flex justify-between text-xs text-muted-foreground px-4">
					<span>May</span>
					<span>June</span>
					<span>July</span>
				</div>

				<div className="relative">
					{/* Timeline horizontal line */}
					<div className="absolute top-1/2 w-full h-0.5 bg-muted rounded-full z-0"></div>

					{/* Today marker */}
					<div
						className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
						style={{ left: `${todayPosition}%` }}
					></div>
					<div
						className="absolute -top-4 text-[10px] text-red-500 font-semibold z-10"
						style={{ left: `${todayPosition}%`, transform: "translateX(-50%)" }}
					>
						Today
					</div>

					{/* Timeline bars */}
					<div className="space-y-6 mt-6 relative z-10">
						{timelineItems.map((item, idx) => {
							const theme = TIMELINE_THEME[item.color as keyof typeof TIMELINE_THEME] || {
								badgeBg: "bg-gray-200",
								badgeText: "text-gray-800",
								bar: item.color,
							}
							return (
								<div
									key={idx}
									className="relative h-16 flex items-center px-3 rounded-md hover:bg-muted/10 transition-colors"
									onMouseEnter={() => setHoveredIndex(idx)}
									onMouseLeave={() => setHoveredIndex(null)}
								>
									{/* Background bar */}
									<div className="absolute inset-y-0 bg-muted rounded-full w-full"></div>

									{/* Progress bar */}
									<div
										className={`absolute inset-y-0 ${theme.bar} rounded-full transition-all duration-300`}
										style={{ width: `${item.progress}%` }}
									></div>

									{/* Labels */}
									<div className="absolute inset-0 flex items-center justify-between px-8 py-4 z-10">
										<div className="relative flex items-center">
											<span className="text-xs py-4 md:text-sm font-semibold">
												{item.project}
											</span>
											<span
												className={`text-[10px] font-medium px-2 mx-4 py-0.5 rounded ${theme.badgeBg} ${theme.badgeText}`}
											>
												{item.phase}
											</span>
										</div>

										<div className="text-xs text-muted-foreground">
											{item.startDate} - {item.endDate}
										</div>
									</div>

									{/* Tooltip - positioned relative to timeline item */}
									{hoveredIndex === idx && (
										<div
											className="absolute -top-12 left-1/2 z-[9999] transform -translate-x-1/2 flex flex-col items-center bg-gray-800 text-white text-[10px] px-2 py-1 rounded shadow-lg whitespace-nowrap"
											style={{
												maxWidth: "200px",
												wordBreak: "break-word",
											}}
										>
											<span className="font-semibold">{item.project}</span>
											<span>{item.phase}</span>
											<span>
												{item.startDate} - {item.endDate}
											</span>
											<span>Progress: {item.progress}%</span>
											<div className="w-2 h-2 bg-gray-800 rotate-45 mt-1"></div>
										</div>
									)}
								</div>
							)
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
