

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ActivityCard({ title, activities }:any) {
	return (
		<Card className="col-span-1">
			<CardHeader>
				<CardTitle className="text-lg font-semibold">{title}</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-3">
					{activities.map((activity:any, i:any) => (
						<div
							key={i}
							className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/20 transition-colors cursor-pointer"
						>
							<div
								className={`w-3 h-3 rounded-full flex-shrink-0 ${activity.dotColor || "bg-primary"
									}`}
							></div>
							<div className="flex-1 space-y-0.5">
								<p className="text-sm font-semibold text-gray-900">
									{activity.title}
								</p>
								<p className="text-sm text-muted-foreground">
									{activity.description}
								</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
