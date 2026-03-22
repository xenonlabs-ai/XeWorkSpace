"use client"

import { Badge } from "@/components/ui/badge"
import {
	Users,
	CheckSquare,
	Clock,
	BarChart3,
	Calendar,
	MessageSquare,
	Shield,
	Zap,
	Target,
	Bell,
	FileText,
	Settings,
	ArrowRight,
	Eye,
	Monitor,
	Camera,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const features = [
	{
		icon: Eye,
		title: "Live Employee Monitoring",
		description: "Real-time screen streaming and activity tracking. Monitor your remote team with live CCTV-style dashboard and instant alerts.",
		color: "from-red-500 to-orange-500",
		bgColor: "bg-red-500/10",
		textColor: "text-red-500",
		highlight: true,
	},
	{
		icon: Monitor,
		title: "Screen Capture",
		description: "Automatic screenshot capture at configurable intervals. Build a visual timeline of employee work with full privacy controls.",
		color: "from-cyan-500 to-blue-500",
		bgColor: "bg-cyan-500/10",
		textColor: "text-cyan-500",
	},
	{
		icon: CheckSquare,
		title: "Task Management",
		description: "Create, assign, and track tasks with priorities, deadlines, and dependencies. Keep projects on track with intuitive Kanban boards.",
		color: "from-blue-500 to-cyan-500",
		bgColor: "bg-blue-500/10",
		textColor: "text-blue-500",
	},
	{
		icon: Users,
		title: "Team Management",
		description: "Organize your team with departments, roles, and permissions. View profiles, track contributions, and manage your workforce.",
		color: "from-green-500 to-emerald-500",
		bgColor: "bg-green-500/10",
		textColor: "text-green-500",
	},
	{
		icon: Clock,
		title: "Attendance Tracking",
		description: "Automated check-ins, working hours tracking, and leave management. Get real-time visibility into team availability.",
		color: "from-orange-500 to-amber-500",
		bgColor: "bg-orange-500/10",
		textColor: "text-orange-500",
	},
	{
		icon: BarChart3,
		title: "Performance Reviews",
		description: "Comprehensive 360° feedback with customizable criteria. Set goals, track progress, and conduct meaningful evaluations.",
		color: "from-purple-500 to-violet-500",
		bgColor: "bg-purple-500/10",
		textColor: "text-purple-500",
	},
]

const additionalFeatures = [
	{ icon: Camera, title: "Screenshots", description: "Auto screen capture" },
	{ icon: Target, title: "Goal Setting", description: "OKRs and KPIs tracking" },
	{ icon: FileText, title: "Reports", description: "Custom analytics reports" },
	{ icon: Shield, title: "Privacy", description: "GDPR compliant" },
	{ icon: Bell, title: "Alerts", description: "Real-time notifications" },
	{ icon: Settings, title: "Integrations", description: "Connect your tools" },
]

export function FeaturesSection() {
	return (
		<section className="py-24 bg-background" id="features">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center max-w-3xl mx-auto mb-16"
				>
					<Badge variant="outline" className="mb-4 px-4 py-1.5">Features</Badge>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
						Everything You Need to{" "}
						<span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
							Succeed
						</span>
					</h2>
					<p className="text-lg text-muted-foreground leading-relaxed">
						A comprehensive suite of tools designed to streamline team management,
						boost productivity, and drive measurable results.
					</p>
				</motion.div>

				{/* Main Features Grid */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
						>
							<div className={`group relative h-full p-6 rounded-2xl border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden ${feature.highlight ? 'ring-2 ring-red-500/20' : ''}`}>
								{/* Gradient background on hover */}
								<div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

								{/* Highlight badge */}
								{feature.highlight && (
									<div className="absolute top-4 right-4">
										<Badge variant="secondary" className="bg-red-500/10 text-red-500 border-red-500/20">
											<span className="relative flex h-2 w-2 mr-1.5">
												<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
												<span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
											</span>
											New
										</Badge>
									</div>
								)}

								{/* Icon */}
								<div className={`relative inline-flex p-3 rounded-xl ${feature.bgColor} mb-4`}>
									<feature.icon className={`w-6 h-6 ${feature.textColor}`} />
								</div>

								{/* Content */}
								<h3 className={`relative text-xl font-semibold mb-3 group-hover:text-primary transition-colors ${feature.highlight ? 'pr-16' : ''}`}>
									{feature.title}
								</h3>
								<p className="relative text-muted-foreground leading-relaxed">
									{feature.description}
								</p>

								{/* Arrow on hover */}
								<div className="relative flex items-center gap-2 mt-4 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
									<span>Learn more</span>
									<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Additional Features */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="relative"
				>
					<div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-blue-500/5 to-violet-500/5 rounded-3xl" />
					<div className="relative p-8 md:p-12 rounded-3xl border">
						<div className="text-center mb-8">
							<h3 className="text-2xl font-bold mb-2">And Much More...</h3>
							<p className="text-muted-foreground">Additional features to supercharge your workflow</p>
						</div>
						<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
							{additionalFeatures.map((feature, index) => (
								<motion.div
									key={feature.title}
									initial={{ opacity: 0, scale: 0.9 }}
									whileInView={{ opacity: 1, scale: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.3, delay: index * 0.05 }}
									className="flex flex-col items-center text-center p-4 rounded-xl hover:bg-muted/50 transition-colors group cursor-pointer"
								>
									<div className="p-3 rounded-lg bg-primary/10 text-primary mb-3 group-hover:bg-primary group-hover:text-white transition-colors">
										<feature.icon className="w-5 h-5" />
									</div>
									<div className="font-medium text-sm mb-1">{feature.title}</div>
									<div className="text-xs text-muted-foreground">{feature.description}</div>
								</motion.div>
							))}
						</div>
					</div>
				</motion.div>

				{/* CTA */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<Link
						href="/docs"
						className="inline-flex items-center gap-2 text-primary font-medium hover:underline underline-offset-4"
					>
						Explore all features in documentation
						<ArrowRight className="w-4 h-4" />
					</Link>
				</motion.div>
			</div>
		</section>
	)
}
