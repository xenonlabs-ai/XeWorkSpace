"use client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts"

const resourceData = [
	{ name: "Development", value: 35, color: "#8884d8" },
	{ name: "Design", value: 20, color: "#82ca9d" },
	{ name: "Marketing", value: 15, color: "#ffc658" },
	{ name: "Sales", value: 15, color: "#ff8042" },
]

const teamMembers = [
	{
		name: "Alex Morgan",
		department: "Development",
		utilization: 92,
		status: "Overallocated",
	},
	{
		name: "Jordan Smith",
		department: "Development",
		utilization: 65,
		status: "Underutilized",
	},
	{
		name: "Casey Jones",
		department: "Sales",
		utilization: 88,
		status: "Optimal",
	},
]

export function ResourceUtilization() {
	return (
		<Card className="col-span-full">
			<CardHeader>
				<CardTitle className="text-lg font-semibold">
					Resource Utilization
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* Pie Chart */}
				<div className="h-[240px] w-full relative flex flex-col items-center justify-center">
					<ResponsiveContainer width="100%" height="100%">
						<PieChart>
							<Pie
								data={resourceData}
								cx="50%"
								cy="50%"
								innerRadius={60}
								outerRadius={90}
								paddingAngle={3}
								dataKey="value"
								nameKey="name"
								label={({ name, percent }: any) => (
									<tspan>
										{name}{" "}
										<tspan fontWeight="bold">
											{(percent * 100).toFixed(0)}%
										</tspan>
									</tspan>
								)}
								labelLine={false}
							>
								{resourceData.map((entry, index) => (
									<Cell
										key={`cell-${index}`}
										fill={entry.color}
										stroke="#fff"
										strokeWidth={2}
										cursor="pointer"
									/>
								))}
							</Pie>
							<Tooltip
								content={({ active, payload }) => {
									if (active && payload && payload.length) {
										const data = payload[0].payload
										return (
											<div className="bg-background border rounded-md shadow-md p-3 text-sm min-w-[120px]">
												<p className="font-medium text-sm">{data.name}</p>
												<p className="text-xs mt-1">
													<span className="font-medium">Allocation:</span>{" "}
													{data.value}%
												</p>
											</div>
										)
									}
									return null
								}}
							/>
							<Legend
								layout="horizontal"
								verticalAlign="bottom"
								align="center"
								wrapperStyle={{ marginTop: 10, gap: 12 }}
								iconSize={12}
								iconType="circle"
								formatter={(value, entry) => (
									<span className="text-sm font-medium">{value}</span>
								)}
							/>
						</PieChart>
					</ResponsiveContainer>

					{/* Total Allocation Center */}
					<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
						<p className="text-sm text-muted-foreground mb-1">
							Total Allocation
						</p>
						<p className="text-2xl font-bold">
							{resourceData.reduce((acc, cur) => acc + cur.value, 0)}%
						</p>
					</div>
				</div>

				{/* Team Member Utilization */}
				<div className="mt-6">
					<h4 className="text-md font-semibold mb-4">
						Team Member Utilization
					</h4>
					<div className="space-y-4">
						{teamMembers.map((member, index) => {
							const statusColor =
								member.status === "Overallocated"
									? "bg-red-50 text-red-700"
									: member.status === "Underutilized"
										? "bg-amber-50 text-amber-700"
										: "bg-green-50 text-green-700"

							const progressColor =
								member.status === "Overallocated"
									? "bg-red-500"
									: member.status === "Underutilized"
										? "bg-amber-500"
										: "bg-green-500"

							return (
								<div
									key={index}
									className="p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-muted/50"
								>
									<div className="flex justify-between items-center mb-2">
										<div className="flex items-center gap-2">
											<p className="text-sm font-medium">{member.name}</p>
											<p className="text-xs text-muted-foreground">
												({member.department})
											</p>
										</div>
										<Badge className={statusColor}>{member.status}</Badge>
									</div>
									<div className="flex items-center gap-2">
										<Progress
											value={member.utilization}
											className={`flex-1 h-2 rounded-full ${progressColor}`}
										/>
										<span className="text-xs font-medium w-10 text-right">
											{member.utilization}%
										</span>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
