

import { Logo } from "@/components/logo"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { NavigationItems } from "./navigation-items"
import { QuickActions } from "./quick-actions"
import { UserProfile } from "./user-profile"

interface MobileSidebarProps {
	isMobileOpen: boolean;
	setIsMobileOpen: (open: boolean) => void;
	direction?: "ltr" | "rtl";
}

export function MobileSidebar({ isMobileOpen, setIsMobileOpen, direction = "ltr" }: MobileSidebarProps) {
	return (
		<Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
			<SheetContent side={direction === "rtl" ? "right" : "left"} className="p-0 w-[280px] gap-0">
				<SheetTitle className="sr-only">Menu</SheetTitle>
				<div className="flex h-16 shrink-0 items-center border-b px-4">
					<div className="flex items-center justify-between w-full">
						<Logo onClick={() => setIsMobileOpen(false)} />
					</div>
				</div>

				<div className="flex flex-col flex-1 min-h-0">
					<ScrollArea className="flex-1">
						<div className="px-3 py-4">
							<h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground rtl:text-right">MAIN NAVIGATION</h2>
							<NavigationItems
								onClick={() => setIsMobileOpen(false)}
								isCollapsed={false}
								mobile={true}
								direction={direction}
							/>
						</div>

					</ScrollArea>
						<div className="px-3 py-4">
							<h2 className="mb-2 px-2 text-xs font-semibold text-muted-foreground">QUICK ACTIONS</h2>
							<QuickActions mobile={true} onItemClick={() => setIsMobileOpen(false)} isCollapsed={false} />
						</div>

					<div className="mt-auto border-t p-3">
						<UserProfile mobile={true} isCollapsed={false} />
					</div>
				</div>
			</SheetContent>
		</Sheet>
	)
}
