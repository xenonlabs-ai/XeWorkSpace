"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
	Monitor,
	Eye,
	Activity,
	Wifi,
	Clock,
	Shield,
	BarChart3,
	Camera,
	MousePointer,
	Keyboard,
	ArrowRight,
	Play,
	CheckCircle2,
	Users,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

const monitoringFeatures = [
	{
		icon: Camera,
		title: "Live Screen Capture",
		description: "Real-time screenshots at configurable intervals",
	},
	{
		icon: Activity,
		title: "Activity Tracking",
		description: "Monitor active apps, windows, and browser tabs",
	},
	{
		icon: MousePointer,
		title: "Input Monitoring",
		description: "Track keyboard and mouse activity levels",
	},
	{
		icon: Clock,
		title: "Time Analytics",
		description: "Detailed productivity and idle time reports",
	},
]

const employees = [
	{ name: "Alex Johnson", role: "Developer", status: "STREAMING", avatar: "AJ", color: "bg-blue-500" },
	{ name: "Sarah Chen", role: "Designer", status: "ONLINE", avatar: "SC", color: "bg-green-500" },
	{ name: "Mike Wilson", role: "Manager", status: "STREAMING", avatar: "MW", color: "bg-purple-500" },
	{ name: "Emily Davis", role: "Developer", status: "IDLE", avatar: "ED", color: "bg-orange-500" },
	{ name: "James Lee", role: "QA", status: "STREAMING", avatar: "JL", color: "bg-cyan-500" },
	{ name: "Lisa Park", role: "Developer", status: "ONLINE", avatar: "LP", color: "bg-pink-500" },
]

export function LiveMonitoringSection() {
	return (
		<section className="py-24 bg-gradient-to-b from-background via-muted/30 to-background overflow-hidden" id="monitoring">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center max-w-3xl mx-auto mb-16"
				>
					<Badge variant="outline" className="mb-4 px-4 py-1.5 border-red-500/30 bg-red-500/5">
						<span className="relative flex h-2 w-2 mr-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
						</span>
						Live Monitoring
					</Badge>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
						See Your Team{" "}
						<span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
							In Real-Time
						</span>
					</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						Monitor employee desktops with live screen streaming, activity tracking,
						and comprehensive productivity analytics. Perfect for remote teams.
					</p>
				</motion.div>

				{/* Main Content - Split View */}
				<div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
					{/* Left Side - Monitoring Dashboard Preview */}
					<motion.div
						initial={{ opacity: 0, x: -40 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="relative"
					>
						{/* Glow effect */}
						<div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 blur-3xl -z-10 scale-95" />

						<div className="relative rounded-2xl border bg-background/80 backdrop-blur-sm shadow-2xl overflow-hidden">
							{/* Header bar */}
							<div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
								<div className="flex items-center gap-2">
									<div className="flex gap-1.5">
										<div className="w-3 h-3 rounded-full bg-red-500/80" />
										<div className="w-3 h-3 rounded-full bg-yellow-500/80" />
										<div className="w-3 h-3 rounded-full bg-green-500/80" />
									</div>
									<span className="text-sm font-medium ml-2">Live CCTV Dashboard</span>
								</div>
								<div className="flex items-center gap-2">
									<Badge variant="secondary" className="text-xs">
										<span className="relative flex h-2 w-2 mr-1.5">
											<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
											<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
										</span>
										6 Online
									</Badge>
								</div>
							</div>

							{/* CCTV Grid Preview */}
							<div className="p-4 bg-gradient-to-br from-background to-muted/20">
								<div className="grid grid-cols-3 gap-3">
									{employees.map((emp, index) => (
										<motion.div
											key={emp.name}
											initial={{ opacity: 0, scale: 0.9 }}
											whileInView={{ opacity: 1, scale: 1 }}
											viewport={{ once: true }}
											transition={{ delay: 0.1 * index }}
											className="relative rounded-lg border bg-card overflow-hidden group"
										>
											{/* Screen preview placeholder */}
											<div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative">
												{/* Fake screen content */}
												<div className="absolute inset-2 rounded bg-slate-700/50 flex items-center justify-center">
													{emp.status === "STREAMING" ? (
														<div className="text-center">
															<div className="w-8 h-6 bg-blue-500/30 rounded mx-auto mb-1"></div>
															<div className="w-12 h-1 bg-slate-600 rounded mx-auto mb-0.5"></div>
															<div className="w-10 h-1 bg-slate-600 rounded mx-auto"></div>
														</div>
													) : emp.status === "IDLE" ? (
														<Clock className="w-6 h-6 text-yellow-500/50" />
													) : (
														<Monitor className="w-6 h-6 text-green-500/50" />
													)}
												</div>

												{/* Status indicator */}
												<div className="absolute top-1.5 right-1.5">
													{emp.status === "STREAMING" && (
														<div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/90 text-white text-[10px] font-medium">
															<span className="relative flex h-1.5 w-1.5">
																<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
																<span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
															</span>
															LIVE
														</div>
													)}
													{emp.status === "ONLINE" && (
														<div className="w-2 h-2 rounded-full bg-green-500"></div>
													)}
													{emp.status === "IDLE" && (
														<div className="w-2 h-2 rounded-full bg-yellow-500"></div>
													)}
												</div>
											</div>

											{/* Employee info */}
											<div className="p-2 flex items-center gap-2">
												<div className={`w-6 h-6 rounded-full ${emp.color} flex items-center justify-center text-white text-[10px] font-bold`}>
													{emp.avatar}
												</div>
												<div className="flex-1 min-w-0">
													<div className="text-xs font-medium truncate">{emp.name}</div>
													<div className="text-[10px] text-muted-foreground">{emp.role}</div>
												</div>
											</div>
										</motion.div>
									))}
								</div>
							</div>
						</div>

						{/* Floating stats card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.6 }}
							className="absolute -bottom-6 -right-6 bg-background border rounded-xl p-4 shadow-xl hidden lg:block"
						>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
									<Activity className="w-5 h-5 text-green-500" />
								</div>
								<div>
									<div className="text-2xl font-bold">94%</div>
									<div className="text-xs text-muted-foreground">Team Productivity</div>
								</div>
							</div>
						</motion.div>
					</motion.div>

					{/* Right Side - Features */}
					<motion.div
						initial={{ opacity: 0, x: 40 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6 }}
						className="space-y-6"
					>
						<div className="space-y-4">
							{monitoringFeatures.map((feature, index) => (
								<motion.div
									key={feature.title}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: 0.1 * index }}
									className="flex items-start gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card hover:shadow-md transition-all group"
								>
									<div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
										<feature.icon className="w-5 h-5" />
									</div>
									<div>
										<h4 className="font-semibold mb-1">{feature.title}</h4>
										<p className="text-sm text-muted-foreground">{feature.description}</p>
									</div>
								</motion.div>
							))}
						</div>

						{/* CTA */}
						<div className="flex flex-col sm:flex-row gap-3 pt-4">
							<Button size="lg" className="shadow-lg shadow-primary/25" asChild>
								<Link href="/auth/register">
									Start Monitoring
									<ArrowRight className="ml-2 w-4 h-4" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link href="/monitoring">
									<Play className="mr-2 w-4 h-4" />
									See Demo
								</Link>
							</Button>
						</div>
					</motion.div>
				</div>

				{/* Bottom Features Grid */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="grid grid-cols-2 md:grid-cols-4 gap-6"
				>
					{[
						{ icon: Shield, title: "Privacy Compliant", desc: "GDPR & consent-based", color: "text-green-500" },
						{ icon: Wifi, title: "Real-time Sync", desc: "Instant updates", color: "text-blue-500" },
						{ icon: BarChart3, title: "Detailed Reports", desc: "Exportable analytics", color: "text-purple-500" },
						{ icon: Users, title: "Multi-tenant", desc: "Organization isolation", color: "text-orange-500" },
					].map((item, index) => (
						<motion.div
							key={item.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: 0.1 * index }}
							className="text-center p-6 rounded-2xl border bg-card/50 hover:bg-card hover:shadow-lg transition-all"
						>
							<div className={`inline-flex p-3 rounded-xl bg-muted mb-3 ${item.color}`}>
								<item.icon className="w-6 h-6" />
							</div>
							<h4 className="font-semibold mb-1">{item.title}</h4>
							<p className="text-sm text-muted-foreground">{item.desc}</p>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
