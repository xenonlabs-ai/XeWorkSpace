"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const projectStatusData = [
	{ name: "Completed", value: 8, color: "#4ade80" },
	{ name: "In Progress", value: 12, color: "#60a5fa" },
	{ name: "Planning", value: 5, color: "#f59e0b" },
	{ name: "On Hold", value: 3, color: "#f43f5e" },
]

export function ProjectAnalytics() {
	const totalProjects = projectStatusData.reduce(
		(acc, curr) => acc + curr.value,
		0
	)

	return (
		<Card className="col-span-full">
			<CardHeader>
				<CardTitle className="text-lg font-semibold">
					Project Analytics
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 sm:grid-cols-2 items-center">
					{/* Pie Chart */}
					<div className="w-full h-[220px] relative flex flex-col items-center justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={projectStatusData}
									dataKey="value"
									nameKey="name"
									cx="50%"
									cy="50%"
									innerRadius={55}
									outerRadius={80}
									paddingAngle={3}
								>
									{projectStatusData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									content={({ active, payload }) => {
										if (active && payload && payload.length) {
											const data = payload[0].payload
											return (
												<div className="bg-background border rounded-md shadow-md p-3 text-sm z-500">
													<p className="font-medium">{data.name}</p>
													<p>
														<span className="font-medium">Projects:</span>{" "}
														{data.value}
													</p>
													<p>
														<span className="font-medium">Percentage:</span>{" "}
														{((data.value / totalProjects) * 100).toFixed(1)}%
													</p>
												</div>
											)
										}
										return null
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
						<div className="absolute text-center z-5">
							<p className="text-sm text-muted-foreground">Total Projects</p>
							<p className="text-2xl font-bold">{totalProjects}</p>
						</div>
					</div>

					{/* Status Breakdown */}
					<div className="space-y-4">
						<h4 className="text-md font-semibold">Status Breakdown</h4>
						<div className="space-y-3">
							{projectStatusData.map((status, index) => {
								const percentage = ((status.value / totalProjects) * 100).toFixed(1)
								return (
									<div
										key={index}
										className="flex items-center justify-between p-3 rounded-lg bg-primary/5 transition-colors cursor-pointer"
									>
										<div className="flex items-center gap-2">
											<div
												className="w-3 h-3 rounded-full"
												style={{ backgroundColor: status.color }}
											/>
											<span className="font-medium text-sm ">{status.name}</span>
										</div>

										{/* Value Column */}
										<div className="flex flex-col items-end gap-1">
											<div className="text-sm font-bold text-gray-900">{status.value}</div>
											<div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
												<div
													className="h-2 rounded-full"
													style={{
														width: `${percentage}%`,
														backgroundColor: status.color,
													}}
												/>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
