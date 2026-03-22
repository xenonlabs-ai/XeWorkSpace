import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

export function MetricCards() {
	const bars = Array.from({ length: 7 }).map(() => 30 + Math.random() * 98)

	return (
		<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
			{/* Team Productivity */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle>
						Team Productivity
					</CardTitle>
				</CardHeader>
				<CardContent className="relative overflow-hidden">
					<div className="text-2xl font-bold">87%</div>
					<div className="flex items-center text-xs text-green-500 font-medium">
						<TrendingUp className="h-3 w-3 mr-1" />
						+12% from last month
					</div>

					<div className="mt-4 h-[200px] bg-primary/5 rounded-md flex items-end justify-between p-2">
						{bars.map((height, i) => (
							<div
								key={i}
								className="bg-primary/70 group-hover:bg-primary w-4 rounded-t-sm relative transition-all"
								style={{ height: `${height}px` }}
							>
								<div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity">
									{Math.round(height)}%
								</div>
							</div>
						))}
					</div>

					<div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-xl"></div>
				</CardContent>
			</Card>

			{/* Tasks Completed */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle>Tasks Completed</CardTitle>
				</CardHeader>
				<CardContent className="relative overflow-hidden">
					<div className="text-2xl font-bold">42</div>
					<div className="flex items-center text-xs text-green-500 font-medium">
						<TrendingUp className="h-3 w-3 mr-1" />
						+8 from last month
					</div>

					<div className="mt-4 space-y-4">
						{[
							{ name: "Development", value: 60, color: "bg-blue-500" },
							{ name: "Design", value: 40, color: "bg-purple-500" },
							{ name: "Marketing", value: 25, color: "bg-pink-500" },
							{ name: "Other", value: 15, color: "bg-amber-500" },
							{ name: "Planning", value: 85, color: "bg-orange-500" },
						].map((task) => (
							<div key={task.name}>
								<div className="flex justify-between text-xs">
									<span>{task.name}</span>
									<span>{task.value}%</span>
								</div>
								<div className="w-full bg-muted rounded-full h-2 mt-1">
									<div
										className={`${task.color} h-2 rounded-full transition-all`}
										style={{ width: `${task.value}%` }}
									></div>
								</div>
							</div>
						))}
					</div>

					<div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/5 rounded-full blur-xl"></div>
				</CardContent>
			</Card>

			{/* Time Allocation */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle>Time Allocation</CardTitle>
				</CardHeader>
				<CardContent className="relative overflow-hidden">
					<div className="text-2xl font-bold">160 hrs</div>
					<p className="text-xs text-muted-foreground">Tracked this month</p>

					<div className="mt-4 relative flex items-center justify-center h-45">
						<div className="absolute w-30 h-30 rounded-full border-8 border-primary/70" />
						<div className="absolute w-25 h-25 rounded-full border-8 border-blue-500/60 rotate-45" />
						<div className="absolute w-20 h-20 rounded-full border-8 border-amber-500/70 rotate-90" />
					</div>

					<div className="mt-4 grid grid-cols-3 gap-1 text-xs">
						<div className="flex items-center gap-1">
							<span className="w-2 h-2 rounded-full bg-primary"></span> Dev
						</div>
						<div className="flex items-center gap-1">
							<span className="w-2 h-2 rounded-full bg-blue-500"></span> Time
						</div>
						<div className="flex items-center gap-1">
							<span className="w-2 h-2 rounded-full bg-amber-500"></span> Plan
						</div>
					</div>

					<div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/5 rounded-full blur-xl"></div>
				</CardContent>
			</Card>

			{/* Quality Score */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between pb-2">
					<CardTitle>Quality Score</CardTitle>
				</CardHeader>
				<CardContent className="relative overflow-hidden">
					<div className="text-2xl font-bold">92%</div>
					<div className="flex items-center text-xs text-green-500 font-medium">
						<TrendingUp className="h-3 w-3 mr-1" /> +3% from last month
					</div>

					<div className="mt-4 h-[150px] bg-muted/30 rounded-md flex items-center justify-center relative overflow-hidden">
						<svg
							viewBox="0 0 100 40"
							className="w-[90%] h-full stroke-2 drop-shadow-sm"
						>
							<defs>
								{/* blue gradient for a premium look */}
								<linearGradient
									id="qualityBlueGradient"
									x1="0"
									y1="0"
									x2="0"
									y2="1"
								>
									<stop
										offset="0%"
										stopColor="#3B82F6" // blue-500
										stopOpacity="0.9"
									/>
									<stop
										offset="100%"
										stopColor="#3B82F6" // blue-500
										stopOpacity="0.2"
									/>
								</linearGradient>
							</defs>

							{/* Line */}
							<path
								d="M0,30 L10,20 L20,18 L30,15 L40,10 L50,8 L60,10 L70,12 L80,9 L90,11 L100,10"
								fill="none"
								stroke="url(#qualityBlueGradient)"
								strokeWidth="2"
								strokeLinecap="round"
							/>

							{/* Soft background fill */}
							<path
								d="M0,40 L0,30 L10,20 L20,18 L30,15 L40,10 L50,8 L60,10 L70,12 L80,9 L90,11 L100,10 L100,40 Z"
								fill="url(#qualityBlueGradient)"
								fillOpacity="0.2"
							/>
						</svg>

						{/* Glow accent */}
						<div className="absolute inset-0 bg-linear-to-t from-primary/10 to-transparent pointer-events-none"></div>
					</div>

					<div className="mt-4 grid grid-cols-2 gap-2 text-xs">
						<div className="bg-muted/40 p-2 rounded-md">
							<div className="text-muted-foreground">Code Reviews</div>
							<div className="font-medium text-sm">95%</div>
						</div>
						<div className="bg-muted/40 p-2 rounded-md">
							<div className="text-muted-foreground">Bug Rate</div>
							<div className="font-medium text-sm">2.1%</div>
						</div>
					</div>

					<div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/5 rounded-full blur-xl"></div>
				</CardContent>
			</Card>
		</div>
	)
}
