import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

type Report = {
	id: string | number
	name: string
	description: string
	date: string
	type: string
}

type ReportsTabsProps = {
	reports: Report[]
}

export function ReportsTabs({ reports }: ReportsTabsProps) {
	return (
		<Card className="mt-6">
			<CardHeader>
				<CardTitle>Available Reports</CardTitle>
			</CardHeader>

			<CardContent>
				<div className="grid gap-4 sm:gap-6 grid-cols-1 xl:grid-cols-2">
					{reports.map((report) => (
						<div
							key={report.id}
							className="flex items-start justify-between gap-4 p-4 border rounded-lg"
						>
							<div className="flex-1 shrink-0">
								<h3 className="font-medium">{report.name}</h3>
								<p className="text-sm text-muted-foreground mt-1">
									{report.description}
								</p>

								<div className="flex flex-col gap-1 mt-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4 sm:justify-between w-full">
									<span>
										<span className="block sm:inline">Generated: </span>
										<span>{report.date}</span>
									</span>
									<span>
										<span className="block sm:inline">Type: </span>
										<span>{report.type}</span>
									</span>
								</div>
							</div>

							{/* 
                Responsive fix for small screens (e.g., iPhone SE):
                - On screens <= 375px (iPhone SE), stack buttons vertically and make sure they fill width.
                - On sm and up, keep horizontal layout.
              */}
							<div className="flex flex-col gap-2 w-full sm:flex-row sm:gap-2 sm:w-auto mt-3 sm:mt-0">
								<Button
									variant="outline"
									size="sm"
									className="w-full sm:w-auto"
								>
									View
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="w-full sm:w-auto"
								>
									<Download className="h-4 w-4 mr-2" />
									Download
								</Button>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
