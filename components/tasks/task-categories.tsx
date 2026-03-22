
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TaskCategories() {
	const categories = [
		{ name: "Development", count: 14, color: "#3b82f6" }, // blue-500
		{ name: "Design", count: 8, color: "#8b5cf6" }, // purple-500
		{ name: "Marketing", count: 6, color: "#ec4899" }, // pink-500
		{ name: "Research", count: 5, color: "#22c55e" }, // green-500
		// { name: "Planning", count: 9, color: "#f59e0b" }, // amber-500
	]

	const total = categories.reduce((sum, item) => sum + item.count, 0)

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					Task Categories
				</CardTitle>
			</CardHeader>

			<CardContent>
				<div className="space-y-6">
					{categories.map((category) => {
						const percentage = Math.round((category.count / total) * 100)

						return (
							<div key={category.name} className="space-y-3">
								<div className="flex justify-between text-sm">
									<span className="font-medium text-foreground/90">
										{category.name}
									</span>
									<span className="text-muted-foreground text-xs">
										{category.count} tasks ({percentage}%)
									</span>
								</div>

								{/* Animated Progress Bar */}
								<div className="relative w-full h-1.5 bg-muted rounded-full overflow-hidden">
									<div
										className="absolute left-0 top-0 h-1.5 rounded-full transition-all duration-700 ease-in-out"
										style={{
											width: `${percentage}%`,
											background: category.color,
											boxShadow: `0 0 10px ${category.color}66`,
										}}
									></div>
								</div>
							</div>
						)
					})}
				</div>

				{/* Total Summary */}
				<div className="pt-5 text-center border-t">
					<p className="text-sm text-muted-foreground">
						<span className="font-medium text-foreground">{total}</span> total
						tasks distributed across categories
					</p>
				</div>
			</CardContent>
		</Card>
	)
}
