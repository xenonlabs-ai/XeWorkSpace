"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Check, Mail, Rocket } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function CTASection() {
	const [email, setEmail] = useState("")

	return (
		<section className="py-24 relative overflow-hidden">
			{/* Animated background */}
			<div className="absolute inset-0 -z-10">
				<div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-blue-600/10" />
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-full blur-3xl animate-pulse" />
				<div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
				<div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

				{/* Grid pattern */}
				<div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
			</div>

			<div className="container mx-auto px-4">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="relative max-w-4xl mx-auto text-center"
				>
					{/* Floating badge */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						whileInView={{ opacity: 1, scale: 1 }}
						viewport={{ once: true }}
						className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8"
					>
						<Rocket className="w-4 h-4" />
						Start your journey today
					</motion.div>

					{/* Main headline */}
					<motion.h2
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.1 }}
						className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
					>
						Ready to{" "}
						<span className="relative">
							<span className="bg-gradient-to-r from-primary via-blue-500 to-violet-500 bg-clip-text text-transparent">
								Supercharge
							</span>
							<svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
								<motion.path
									d="M2 6C50 2 150 2 198 6"
									stroke="url(#ctaGradient)"
									strokeWidth="3"
									strokeLinecap="round"
									initial={{ pathLength: 0 }}
									whileInView={{ pathLength: 1 }}
									viewport={{ once: true }}
									transition={{ duration: 0.8, delay: 0.3 }}
								/>
								<defs>
									<linearGradient id="ctaGradient" x1="2" y1="6" x2="198" y2="6">
										<stop stopColor="hsl(var(--primary))" />
										<stop offset="0.5" stopColor="#3b82f6" />
										<stop offset="1" stopColor="#8b5cf6" />
									</linearGradient>
								</defs>
							</svg>
						</span>
						<br />
						Your Team&apos;s Productivity?
					</motion.h2>

					{/* Subheadline */}
					<motion.p
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.2 }}
						className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
					>
						Join 2,000+ teams already using XeTask to streamline operations,
						boost productivity, and achieve remarkable results.
					</motion.p>

					{/* Email signup form */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.3 }}
						className="max-w-md mx-auto mb-6"
					>
						<div className="flex gap-3">
							<div className="relative flex-1">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
								<Input
									type="email"
									placeholder="Enter your work email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className="pl-10 h-12 bg-background/80 backdrop-blur border-border/50"
								/>
							</div>
							<Button size="lg" className="h-12 px-6 shadow-lg shadow-primary/25" asChild>
								<Link href={`/auth/register${email ? `?email=${encodeURIComponent(email)}` : ""}`}>
									Get Started
									<ArrowRight className="ml-2 w-4 h-4" />
								</Link>
							</Button>
						</div>
					</motion.div>

					{/* Or separator */}
					<motion.div
						initial={{ opacity: 0 }}
						whileInView={{ opacity: 1 }}
						viewport={{ once: true }}
						transition={{ delay: 0.4 }}
						className="flex items-center gap-4 max-w-md mx-auto mb-6"
					>
						<div className="flex-1 h-px bg-border" />
						<span className="text-sm text-muted-foreground">or</span>
						<div className="flex-1 h-px bg-border" />
					</motion.div>

					{/* Secondary CTA */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.5 }}
					>
						<Button variant="outline" size="lg" className="h-12" asChild>
							<Link href="/contact">
								Schedule a Demo
							</Link>
						</Button>
					</motion.div>

					{/* Trust indicators */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ delay: 0.6 }}
						className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
					>
						{[
							"14-day free trial",
							"No credit card required",
							"Cancel anytime",
							"24/7 support",
						].map((item) => (
							<div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
								<div className="p-0.5 rounded-full bg-green-500/10">
									<Check className="w-3.5 h-3.5 text-green-600" />
								</div>
								{item}
							</div>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}
