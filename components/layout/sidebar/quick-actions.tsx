

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Zap } from "lucide-react"

export function QuickActions({ mobile, onItemClick, isCollapsed }: { mobile: boolean; onItemClick?: () => void; isCollapsed: boolean }) {

	return (
		<>
			<div className="grid gap-2">
				<div
			className={cn(
				"mt-2 rounded-lg overflow-hidden border border-border/50 bg-gradient-to-br from-primary/5 to-primary/10",
				isCollapsed && !mobile ? "p-2" : "p-3",
			)}
		>
			{isCollapsed && !mobile ? (
				<Tooltip delayDuration={0}>
					<TooltipTrigger asChild>
						<div className="flex flex-col items-center justify-center">
							<Zap className="h-5 w-5 text-primary mb-1" />
							<div className="w-full h-1 rounded-full bg-primary/20 overflow-hidden">
								<div className="w-2/3 h-full bg-primary"></div>
							</div>
						</div>
					</TooltipTrigger>
					<TooltipContent side="right" className="font-medium">
						Upgrade to Premium - Unlimited Tasks
					</TooltipContent>
				</Tooltip>
			) : (
				<div className="space-y-2">
					<div className="flex items-center">
						<Zap className="h-4 w-4 text-primary mr-2" />
						<h4 className="font-medium text-sm">Upgrade to Premium</h4>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">Unlimited tasks, projects & team members</p>
						<div className="w-full h-1.5 rounded-full bg-primary/20 overflow-hidden">
							<div className="w-2/3 h-full bg-primary"></div>
						</div>
					</div>
					<Button size="sm" className="w-full h-8 mt-2 text-xs cursor-pointer">
						Upgrade Now
					</Button>
				</div>
			)}
		</div>
			</div>
		</>
	)
}

