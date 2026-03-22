"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, CheckCircle2, Users, BarChart3, Clock, TrendingUp, Monitor, Eye } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function HeroSection() {
	return (
		<section className="relative overflow-hidden pt-24 pb-20 lg:pt-32 lg:pb-32">
			{/* Animated background */}
			<div className="absolute inset-0 -z-10">
				{/* Gradient orbs */}
				<div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-purple-500/15 to-pink-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />

				{/* Grid pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
			</div>

			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center text-center max-w-5xl mx-auto">
					{/* Announcement Badge */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
					>
						<Badge
							variant="outline"
							className="mb-8 px-6 py-3 text-base font-medium border-red-500/50 bg-red-500/10 hover:bg-red-500/20 transition-colors cursor-pointer group shadow-lg shadow-red-500/20"
						>
							<span className="relative flex h-3 w-3 mr-3">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
							</span>
							<Eye className="w-4 h-4 mr-2 text-red-500" />
							<span className="text-red-500 font-bold">LIVE EMPLOYEE MONITORING</span>
							<ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform text-red-500" />
						</Badge>
					</motion.div>

					{/* Main Headline */}
					<motion.h1
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.1 }}
						className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
					>
						<span className="relative inline-flex items-center gap-3">
							<span className="bg-gradient-to-r from-red-500 via-orange-500 to-red-600 bg-clip-text text-transparent">
								Live Monitoring
							</span>
							<span className="relative flex h-4 w-4">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
								<span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
							</span>
						</span>
						<span className="block mt-2">of Your Employees</span>
						<span className="relative block mt-2">
							<span className="bg-gradient-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent">
								In Real-Time
							</span>
							<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 358 12" fill="none" xmlns="http://www.w3.org/2000/svg">
								<motion.path
									d="M3 9C118.957 4.47226 236.879 2.86548 355 9"
									stroke="url(#gradient)"
									strokeWidth="4"
									strokeLinecap="round"
									initial={{ pathLength: 0 }}
									animate={{ pathLength: 1 }}
									transition={{ duration: 1, delay: 0.5 }}
								/>
								<defs>
									<linearGradient id="gradient" x1="3" y1="9" x2="355" y2="9">
										<stop stopColor="hsl(var(--primary))" />
										<stop offset="0.5" stopColor="#3b82f6" />
										<stop offset="1" stopColor="#8b5cf6" />
									</linearGradient>
								</defs>
							</svg>
						</span>
					</motion.h1>

					{/* Subheadline */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8 leading-relaxed"
					>
						Watch employee screens in real-time with CCTV-style live streaming.
						See exactly what your team is working on, track productivity, and boost accountability.
					</motion.p>

					{/* Feature Pills */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
						className="flex flex-wrap justify-center gap-3 mb-10"
					>
						{[
							{ icon: Eye, label: "Live Screen Streaming", color: "text-red-500", highlight: true },
							{ icon: Monitor, label: "CCTV Dashboard", color: "text-orange-500", highlight: true },
							{ icon: CheckCircle2, label: "Task Management", color: "text-green-500" },
							{ icon: Clock, label: "Time Tracking", color: "text-blue-500" },
							{ icon: BarChart3, label: "Analytics", color: "text-purple-500" },
						].map((feature) => (
							<div
								key={feature.label}
								className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
									feature.highlight
										? "bg-red-500/10 border-2 border-red-500/50 hover:bg-red-500/20 shadow-md shadow-red-500/10"
										: "bg-muted/50 border border-border/50 hover:bg-muted"
								}`}
							>
								<feature.icon className={`w-4 h-4 ${feature.color}`} />
								<span className={feature.highlight ? "font-semibold" : ""}>{feature.label}</span>
								{feature.highlight && (
									<span className="relative flex h-2 w-2">
										<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
										<span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
									</span>
								)}
							</div>
						))}
					</motion.div>

					{/* CTA Buttons */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.4 }}
						className="flex flex-col sm:flex-row gap-4 mb-6"
					>
						<Button size="lg" className="text-base px-8 h-12 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 transition-all border-0" asChild>
							<Link href="/auth/register">
								<Eye className="mr-2 w-5 h-5" />
								Start Live Monitoring
								<ArrowRight className="ml-2 w-4 h-4" />
							</Link>
						</Button>
						<Button size="lg" variant="outline" className="text-base px-8 h-12 group border-red-500/30 hover:border-red-500/50 hover:bg-red-500/5">
							<Play className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform text-red-500" />
							Watch Live Demo
						</Button>
					</motion.div>

					{/* No credit card text */}
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.5 }}
						className="text-sm text-muted-foreground mb-16"
					>
						No credit card required • Free 14-day trial • Cancel anytime
					</motion.p>

					{/* Dashboard Preview */}
					<motion.div
						initial={{ opacity: 0, y: 60, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ duration: 0.8, delay: 0.5 }}
						className="relative w-full max-w-5xl"
					>
						{/* Glow effect behind dashboard */}
						<div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-blue-500/20 to-violet-500/20 blur-3xl -z-10 scale-95" />

						<div className="relative rounded-2xl border border-border/50 bg-background/80 backdrop-blur-sm shadow-2xl overflow-hidden">
							{/* Browser chrome */}
							<div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
								<div className="flex gap-1.5">
									<div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
									<div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors" />
									<div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
								</div>
								<div className="flex-1 flex justify-center">
									<div className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-background border text-xs text-muted-foreground">
										<div className="w-3 h-3 rounded-full bg-green-500" />
										app.xetask.com/dashboard
									</div>
								</div>
								<div className="w-16" />
							</div>

							{/* Dashboard content */}
							<div className="p-6 bg-gradient-to-br from-background to-muted/20">
								{/* Top stats row */}
								<div className="grid grid-cols-4 gap-4 mb-6">
									{[
										{ label: "Team Members", value: "24", change: "+3", icon: Users, color: "text-blue-500" },
										{ label: "Active Tasks", value: "156", change: "+12", icon: CheckCircle2, color: "text-green-500" },
										{ label: "Hours Tracked", value: "1,284", change: "+8%", icon: Clock, color: "text-orange-500" },
										{ label: "Productivity", value: "94%", change: "+5%", icon: TrendingUp, color: "text-purple-500" },
									].map((stat, i) => (
										<motion.div
											key={stat.label}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.8 + i * 0.1 }}
											className="bg-background rounded-xl p-4 border shadow-sm"
										>
											<div className="flex items-center justify-between mb-2">
												<span className="text-xs text-muted-foreground">{stat.label}</span>
												<stat.icon className={`w-4 h-4 ${stat.color}`} />
											</div>
											<div className="flex items-baseline gap-2">
												<span className="text-2xl font-bold">{stat.value}</span>
												<span className="text-xs text-green-500 font-medium">{stat.change}</span>
											</div>
										</motion.div>
									))}
								</div>

								{/* Charts row */}
								<div className="grid grid-cols-3 gap-4">
									{/* Bar chart */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 1.2 }}
										className="col-span-2 bg-background rounded-xl p-4 border shadow-sm"
									>
										<div className="flex items-center justify-between mb-4">
											<span className="text-sm font-medium">Weekly Progress</span>
											<Badge variant="secondary" className="text-xs">This Week</Badge>
										</div>
										<div className="flex items-end justify-between h-32 gap-3 px-2">
											{[45, 72, 58, 85, 62, 90, 78].map((h, i) => (
												<motion.div
													key={i}
													initial={{ height: 0 }}
													animate={{ height: `${h}%` }}
													transition={{ delay: 1.3 + i * 0.05, duration: 0.5 }}
													className="flex-1 bg-gradient-to-t from-primary to-primary/60 rounded-t-md relative group cursor-pointer"
												>
													<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
														{h}%
													</div>
												</motion.div>
											))}
										</div>
										<div className="flex justify-between mt-2 px-2">
											{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
												<span key={day} className="text-xs text-muted-foreground">{day}</span>
											))}
										</div>
									</motion.div>

									{/* Donut chart */}
									<motion.div
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: 1.4 }}
										className="bg-background rounded-xl p-4 border shadow-sm"
									>
										<span className="text-sm font-medium">Task Status</span>
										<div className="flex items-center justify-center h-32 mt-2">
											<div className="relative w-24 h-24">
												<svg className="w-full h-full -rotate-90">
													<circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="none" className="text-muted" />
													<motion.circle
														cx="48" cy="48" r="40"
														stroke="url(#donutGradient)"
														strokeWidth="8"
														fill="none"
														strokeLinecap="round"
														strokeDasharray={251.2}
														initial={{ strokeDashoffset: 251.2 }}
														animate={{ strokeDashoffset: 251.2 * 0.28 }}
														transition={{ delay: 1.5, duration: 1 }}
													/>
													<defs>
														<linearGradient id="donutGradient">
															<stop offset="0%" stopColor="hsl(var(--primary))" />
															<stop offset="100%" stopColor="#8b5cf6" />
														</linearGradient>
													</defs>
												</svg>
												<div className="absolute inset-0 flex items-center justify-center">
													<span className="text-xl font-bold">72%</span>
												</div>
											</div>
										</div>
										<div className="flex justify-center gap-4 mt-2">
											<div className="flex items-center gap-1.5">
												<div className="w-2 h-2 rounded-full bg-primary" />
												<span className="text-xs text-muted-foreground">Done</span>
											</div>
											<div className="flex items-center gap-1.5">
												<div className="w-2 h-2 rounded-full bg-muted" />
												<span className="text-xs text-muted-foreground">Pending</span>
											</div>
										</div>
									</motion.div>
								</div>
							</div>
						</div>

						{/* Floating notification cards */}
						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 1.6 }}
							className="absolute -right-4 lg:-right-8 top-1/4 bg-background border rounded-xl p-4 shadow-xl hidden lg:block"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
									<CheckCircle2 className="w-5 h-5 text-green-500" />
								</div>
								<div>
									<div className="text-sm font-medium">Task Completed!</div>
									<div className="text-xs text-muted-foreground">UI Design Review</div>
								</div>
							</div>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 1.8 }}
							className="absolute -left-4 lg:-left-8 bottom-1/3 bg-background border rounded-xl p-4 shadow-xl hidden lg:block"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
									<TrendingUp className="w-5 h-5 text-primary" />
								</div>
								<div>
									<div className="text-sm font-medium">Productivity Up!</div>
									<div className="text-xs text-muted-foreground">+12% this week</div>
								</div>
							</div>
						</motion.div>
					</motion.div>

					{/* Trust section */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 2 }}
						className="mt-20 text-center"
					>
						<p className="text-sm text-muted-foreground mb-8">
							Trusted by <span className="text-foreground font-medium">2,000+</span> teams at companies worldwide
						</p>
						<div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
							{[
								{ name: "Acme Corp", letter: "A" },
								{ name: "TechFlow", letter: "T" },
								{ name: "Innovate", letter: "I" },
								{ name: "Quantum", letter: "Q" },
								{ name: "NexGen", letter: "N" },
							].map((company, i) => (
								<motion.div
									key={company.name}
									initial={{ opacity: 0 }}
									animate={{ opacity: 0.5 }}
									whileHover={{ opacity: 1 }}
									transition={{ delay: 2.1 + i * 0.1 }}
									className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
								>
									<div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-sm">
										{company.letter}
									</div>
									<span className="text-lg font-semibold">{company.name}</span>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
