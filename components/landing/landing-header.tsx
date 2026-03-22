"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu, Wallet, ChevronRight, CheckSquare, Users, Clock, BarChart3, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const features = [
	{
		title: "Task Management",
		description: "Create, assign, and track tasks with ease",
		icon: CheckSquare,
		href: "#features",
	},
	{
		title: "Team Management",
		description: "Organize teams, roles, and permissions",
		icon: Users,
		href: "#features",
	},
	{
		title: "Time Tracking",
		description: "Monitor attendance and working hours",
		icon: Clock,
		href: "#features",
	},
	{
		title: "Analytics",
		description: "Powerful insights and reports",
		icon: BarChart3,
		href: "#features",
	},
]

const navLinks = [
	{ name: "Features", href: "#features" },
	{ name: "How It Works", href: "#how-it-works" },
	{ name: "Pricing", href: "#pricing" },
	{ name: "Testimonials", href: "#testimonials" },
	{ name: "FAQ", href: "#faq" },
]

export function LandingHeader() {
	const [isScrolled, setIsScrolled] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20)
		}
		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-500",
				isScrolled
					? "bg-background/95 backdrop-blur-xl border-b shadow-sm py-2"
					: "bg-transparent py-4"
			)}
		>
			<div className="container mx-auto px-4">
				<div className="flex h-14 items-center justify-between">
					{/* Logo */}
					<Link href="/" className="flex items-center gap-2.5 group">
						<div className="relative">
							<div className="absolute inset-0 bg-primary/20 rounded-lg blur-md group-hover:blur-lg transition-all" />
							<div className="relative bg-gradient-to-br from-primary to-blue-600 p-2 rounded-lg">
								<Wallet className="h-5 w-5 text-white" />
							</div>
						</div>
						<span className="text-xl font-bold tracking-tight">
							Xe<span className="text-primary">Task</span>
						</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center gap-1">
						<NavigationMenu>
							<NavigationMenuList>
								<NavigationMenuItem>
									<NavigationMenuTrigger className="bg-transparent hover:bg-muted/50">
										Features
									</NavigationMenuTrigger>
									<NavigationMenuContent>
										<ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
											{features.map((feature) => (
												<li key={feature.title}>
													<NavigationMenuLink asChild>
														<a
															href={feature.href}
															className="flex items-start gap-3 rounded-lg p-3 hover:bg-muted transition-colors group"
														>
															<div className="p-2 rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
																<feature.icon className="h-4 w-4" />
															</div>
															<div>
																<div className="font-medium text-sm mb-0.5">{feature.title}</div>
																<div className="text-xs text-muted-foreground">{feature.description}</div>
															</div>
														</a>
													</NavigationMenuLink>
												</li>
											))}
											<li className="col-span-2 border-t pt-3 mt-1">
												<NavigationMenuLink asChild>
													<a
														href="#features"
														className="flex items-center justify-between rounded-lg p-3 hover:bg-muted transition-colors"
													>
														<div className="flex items-center gap-2">
															<Zap className="h-4 w-4 text-primary" />
															<span className="font-medium text-sm">View All Features</span>
														</div>
														<ChevronRight className="h-4 w-4 text-muted-foreground" />
													</a>
												</NavigationMenuLink>
											</li>
										</ul>
									</NavigationMenuContent>
								</NavigationMenuItem>
							</NavigationMenuList>
						</NavigationMenu>

						{navLinks.slice(1).map((link) => (
							<a
								key={link.name}
								href={link.href}
								className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
							>
								{link.name}
							</a>
						))}
					</nav>

					{/* Desktop CTA */}
					<div className="hidden lg:flex items-center gap-3">
						<Button variant="ghost" size="sm" className="font-medium" asChild>
							<Link href="/auth/login">Sign In</Link>
						</Button>
						<Button size="sm" className="font-medium shadow-lg shadow-primary/20" asChild>
							<Link href="/auth/register">
								Get Started
								<ChevronRight className="ml-1 h-4 w-4" />
							</Link>
						</Button>
					</div>

					{/* Mobile Menu */}
					<Sheet open={isOpen} onOpenChange={setIsOpen}>
						<SheetTrigger asChild className="lg:hidden">
							<Button variant="ghost" size="icon" className="relative">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="right" className="w-full sm:w-[400px] p-0">
							<div className="flex flex-col h-full">
								{/* Mobile Header */}
								<div className="flex items-center justify-between p-6 border-b">
									<Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
										<div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-lg">
											<Wallet className="h-5 w-5 text-white" />
										</div>
										<span className="text-xl font-bold">XeTask</span>
									</Link>
								</div>

								{/* Mobile Navigation */}
								<nav className="flex-1 overflow-auto p-6">
									<div className="space-y-1">
										{navLinks.map((link) => (
											<a
												key={link.name}
												href={link.href}
												onClick={() => setIsOpen(false)}
												className="flex items-center justify-between py-3 px-4 text-lg font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
											>
												{link.name}
												<ChevronRight className="h-5 w-5" />
											</a>
										))}
									</div>

									{/* Mobile Features */}
									<div className="mt-8">
										<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-4">
											Features
										</p>
										<div className="grid grid-cols-2 gap-3">
											{features.map((feature) => (
												<a
													key={feature.title}
													href={feature.href}
													onClick={() => setIsOpen(false)}
													className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors text-center"
												>
													<div className="p-2 rounded-lg bg-primary/10 text-primary">
														<feature.icon className="h-5 w-5" />
													</div>
													<span className="text-sm font-medium">{feature.title}</span>
												</a>
											))}
										</div>
									</div>
								</nav>

								{/* Mobile CTA */}
								<div className="p-6 border-t space-y-3">
									<Button variant="outline" asChild className="w-full h-12 text-base">
										<Link href="/auth/login" onClick={() => setIsOpen(false)}>
											Sign In
										</Link>
									</Button>
									<Button asChild className="w-full h-12 text-base shadow-lg shadow-primary/20">
										<Link href="/auth/register" onClick={() => setIsOpen(false)}>
											Get Started Free
											<ChevronRight className="ml-1 h-4 w-4" />
										</Link>
									</Button>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</header>
	)
}
