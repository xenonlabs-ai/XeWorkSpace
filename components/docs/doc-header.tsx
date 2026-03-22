"use client"

import { DocSidebarNav } from "@/components/docs/doc-sidebar-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, Wallet, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export function DocHeader() {
	const [isSearchOpen, setIsSearchOpen] = useState(false)
	const pathname = usePathname()

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-14 items-center">
				<div className="mr-4 hidden md:flex">
					<Link href="/" className="mr-6 flex items-center space-x-2">
						<Wallet className="h-6 w-6" />
						<span className="hidden font-semibold sm:inline-block">XeTask</span>
					</Link>
					<nav className="flex items-center space-x-6 text-sm font-medium">
						<Link href="/" className="transition-colors hover:text-foreground/80">
							Home
						</Link>
						<Link
							href="/docs"
							className={
								pathname.startsWith("/docs")
									? "text-foreground"
									: "text-foreground/60 transition-colors hover:text-foreground/80"
							}
						>
							Documentation
						</Link>
						{/* <Link
							href="/docs/api"
							className={
								pathname.startsWith("/docs/api")
									? "text-foreground"
									: "text-foreground/60 transition-colors hover:text-foreground/80"
							}
						>
							API
						</Link> */}
						{/* <Link
							href="/docs/guides"
							className={
								pathname.startsWith("/docs/guides")
									? "text-foreground"
									: "text-foreground/60 transition-colors hover:text-foreground/80"
							}
						>
							Guides
						</Link> */}
					</nav>
				</div>

				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="mr-2 md:hidden">
							<Menu className="h-5 w-5" />
							<span className="sr-only">Toggle Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="pr-0">
						<MobileNav />
					</SheetContent>
				</Sheet>

				<Link href="/" className="mr-6 flex items-center md:hidden">
					<Wallet className="h-6 w-6" />
					<span className="ml-2 font-semibold">XeTask</span>
				</Link>

				<div className="flex flex-1 items-center justify-end space-x-2">
					{isSearchOpen ? (
						<div className="relative flex flex-1 items-center md:max-w-sm">
							<Input type="search" placeholder="Search documentation..." className="h-9 w-full rounded-md pl-8" />
							<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
							<Button
								variant="ghost"
								size="icon"
								className="absolute right-1 top-1/2 -translate-y-1/2"
								onClick={() => setIsSearchOpen(false)}
							>
								<X className="h-4 w-4" />
								<span className="sr-only">Close search</span>
							</Button>
						</div>
					) : (
						<Button variant="outline" size="icon" onClick={() => setIsSearchOpen(true)}>
							<Search className="h-4 w-4" />
							<span className="sr-only">Search documentation</span>
						</Button>
					)}
					<Button variant="outline" asChild>
						<Link href="/docs/installation">Get Started</Link>
					</Button>
				</div>
			</div>
		</header>
	)
}

function MobileNav() {
	return (
		<div className="flex flex-col space-y-4 py-4">
			<Link href="/" className="flex items-center space-x-2">
				<Wallet className="h-6 w-6" />
				<span className="font-semibold">XeTask</span>
			</Link>
			<div className="flex flex-col space-y-3">
				<Link href="/" className="text-muted-foreground">
					Home
				</Link>
				<DocSidebarNav />
			</div>
		</div>
	)
}
