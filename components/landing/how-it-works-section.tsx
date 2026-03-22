"use client"

import { Badge } from "@/components/ui/badge"
import { UserPlus, Settings2, Rocket, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

const steps = [
	{
		number: "01",
		icon: UserPlus,
		title: "Create Your Team",
		description: "Sign up and invite your team members. Set up departments, roles, and permissions in minutes.",
		color: "from-blue-500 to-cyan-500",
	},
	{
		number: "02",
		icon: Settings2,
		title: "Configure Your Workspace",
		description: "Customize your dashboard, set up projects, and define workflows that match your team's needs.",
		color: "from-purple-500 to-pink-500",
	},
	{
		number: "03",
		icon: Rocket,
		title: "Start Managing Tasks",
		description: "Create tasks, assign to team members, set deadlines, and track progress in real-time.",
		color: "from-orange-500 to-red-500",
	},
	{
		number: "04",
		icon: TrendingUp,
		title: "Analyze & Improve",
		description: "Use analytics and reports to identify bottlenecks, measure performance, and continuously improve.",
		color: "from-green-500 to-emerald-500",
	},
]

export function HowItWorksSection() {
	return (
		<section className="py-24 bg-background" id="how-it-works">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<Badge variant="outline" className="mb-4">How It Works</Badge>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
						Get Started in{" "}
						<span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
							Four Simple Steps
						</span>
					</h2>
					<p className="text-lg text-muted-foreground">
						XeTask is designed to be intuitive and easy to use. Get your team up and running in no time.
					</p>
				</div>

				{/* Steps */}
				<div className="relative max-w-5xl mx-auto">
					{/* Connection line */}
					<div className="absolute top-24 left-1/2 -translate-x-1/2 w-[80%] h-0.5 bg-gradient-to-r from-transparent via-border to-transparent hidden lg:block" />

					<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
						{steps.map((step, index) => (
							<motion.div
								key={step.number}
								initial={{ opacity: 0, y: 30 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.15 }}
								className="relative"
							>
								<div className="flex flex-col items-center text-center">
									{/* Number badge */}
									<div className={`relative w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} p-[2px] mb-6`}>
										<div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
											<step.icon className="w-8 h-8 text-foreground" />
										</div>
										<div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
											{step.number}
										</div>
									</div>

									{/* Content */}
									<h3 className="text-xl font-semibold mb-3">{step.title}</h3>
									<p className="text-muted-foreground text-sm leading-relaxed">
										{step.description}
									</p>
								</div>

								{/* Arrow connector for desktop */}
								{index < steps.length - 1 && (
									<div className="hidden lg:block absolute top-10 -right-4 text-muted-foreground/30">
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
										</svg>
									</div>
								)}
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
