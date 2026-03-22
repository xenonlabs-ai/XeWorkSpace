"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Sparkles, ArrowRight, Zap } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useState } from "react"

const plans = [
	{
		name: "Starter",
		description: "Perfect for small teams getting started",
		monthlyPrice: 0,
		yearlyPrice: 0,
		popular: false,
		features: [
			{ name: "Up to 5 team members", included: true },
			{ name: "Basic task management", included: true },
			{ name: "Attendance tracking", included: true },
			{ name: "Email support", included: true },
			{ name: "1 GB storage", included: true },
			{ name: "Basic reports", included: true },
			{ name: "Performance reviews", included: false },
			{ name: "Advanced analytics", included: false },
		],
		cta: "Get Started Free",
		ctaVariant: "outline" as const,
	},
	{
		name: "Professional",
		description: "For growing teams that need more power",
		monthlyPrice: 12,
		yearlyPrice: 10,
		popular: true,
		features: [
			{ name: "Up to 25 team members", included: true },
			{ name: "Advanced task management", included: true },
			{ name: "Attendance tracking", included: true },
			{ name: "Priority support", included: true },
			{ name: "10 GB storage", included: true },
			{ name: "Advanced analytics", included: true },
			{ name: "Performance reviews", included: true },
			{ name: "Custom workflows", included: true },
		],
		cta: "Start Free Trial",
		ctaVariant: "default" as const,
	},
	{
		name: "Enterprise",
		description: "For large organizations with custom needs",
		monthlyPrice: 29,
		yearlyPrice: 24,
		popular: false,
		features: [
			{ name: "Unlimited team members", included: true },
			{ name: "Everything in Professional", included: true },
			{ name: "SSO authentication", included: true },
			{ name: "Dedicated account manager", included: true },
			{ name: "Unlimited storage", included: true },
			{ name: "Custom integrations", included: true },
			{ name: "Advanced security & audit", included: true },
			{ name: "SLA guarantee", included: true },
		],
		cta: "Contact Sales",
		ctaVariant: "outline" as const,
	},
]

export function PricingSection() {
	const [isYearly, setIsYearly] = useState(true)

	return (
		<section className="py-24 bg-background" id="pricing">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center max-w-3xl mx-auto mb-12"
				>
					<Badge variant="outline" className="mb-4 px-4 py-1.5">Pricing</Badge>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
						Simple, Transparent{" "}
						<span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
							Pricing
						</span>
					</h2>
					<p className="text-lg text-muted-foreground">
						Start free and scale as you grow. All plans include a 14-day free trial.
					</p>
				</motion.div>

				{/* Billing Toggle */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="flex items-center justify-center gap-3 mb-12"
				>
					<div className="relative bg-muted p-1 rounded-full inline-flex">
						<button
							onClick={() => setIsYearly(false)}
							className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all ${
								!isYearly
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Monthly
						</button>
						<button
							onClick={() => setIsYearly(true)}
							className={`relative px-6 py-2 text-sm font-medium rounded-full transition-all ${
								isYearly
									? "bg-background text-foreground shadow-sm"
									: "text-muted-foreground hover:text-foreground"
							}`}
						>
							Yearly
						</button>
					</div>
					{isYearly && (
						<motion.div
							initial={{ opacity: 0, x: -10 }}
							animate={{ opacity: 1, x: 0 }}
						>
							<Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20 border-0">
								<Zap className="w-3 h-3 mr-1" />
								Save 20%
							</Badge>
						</motion.div>
					)}
				</motion.div>

				{/* Pricing Cards */}
				<div className="grid gap-8 lg:grid-cols-3 max-w-6xl mx-auto items-start">
					{plans.map((plan, index) => (
						<motion.div
							key={plan.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className={`relative ${plan.popular ? "lg:-mt-4 lg:mb-4" : ""}`}
						>
							<div
								className={`relative h-full flex flex-col rounded-2xl border p-6 lg:p-8 transition-all duration-300 hover:shadow-xl ${
									plan.popular
										? "bg-gradient-to-b from-primary/5 to-background border-primary shadow-lg"
										: "bg-card hover:border-primary/50"
								}`}
							>
								{/* Popular badge */}
								{plan.popular && (
									<div className="absolute -top-4 left-1/2 -translate-x-1/2">
										<Badge className="bg-primary text-primary-foreground px-4 py-1 shadow-lg">
											<Sparkles className="w-3.5 h-3.5 mr-1.5" />
											Most Popular
										</Badge>
									</div>
								)}

								{/* Plan header */}
								<div className="text-center mb-6">
									<h3 className="text-xl font-bold mb-2">{plan.name}</h3>
									<p className="text-sm text-muted-foreground">{plan.description}</p>
								</div>

								{/* Price */}
								<div className="text-center mb-8">
									<div className="flex items-baseline justify-center gap-1">
										<span className="text-5xl font-bold">
											${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
										</span>
										{plan.monthlyPrice > 0 && (
											<div className="text-left">
												<span className="text-muted-foreground text-sm">/user</span>
												<span className="text-muted-foreground text-sm block">/month</span>
											</div>
										)}
									</div>
									{isYearly && plan.monthlyPrice > 0 && (
										<p className="text-sm text-muted-foreground mt-2">
											<span className="line-through">${plan.monthlyPrice * 12}</span>{" "}
											<span className="text-green-600 font-medium">
												${plan.yearlyPrice * 12}/year
											</span>
										</p>
									)}
									{plan.monthlyPrice === 0 && (
										<p className="text-sm text-muted-foreground mt-2">Free forever</p>
									)}
								</div>

								{/* CTA Button */}
								<Button
									variant={plan.ctaVariant}
									className={`w-full mb-8 h-12 text-base ${
										plan.popular
											? "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25"
											: ""
									}`}
									asChild
								>
									<Link href={plan.name === "Enterprise" ? "/contact" : "/auth/register"}>
										{plan.cta}
										<ArrowRight className="ml-2 w-4 h-4" />
									</Link>
								</Button>

								{/* Features */}
								<div className="space-y-4 flex-1">
									<p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
										What&apos;s included
									</p>
									<ul className="space-y-3">
										{plan.features.map((feature) => (
											<li key={feature.name} className="flex items-start gap-3">
												{feature.included ? (
													<div className="p-0.5 rounded-full bg-green-500/10">
														<Check className="w-4 h-4 text-green-600" />
													</div>
												) : (
													<div className="p-0.5 rounded-full bg-muted">
														<X className="w-4 h-4 text-muted-foreground" />
													</div>
												)}
												<span
													className={`text-sm ${
														feature.included ? "text-foreground" : "text-muted-foreground"
													}`}
												>
													{feature.name}
												</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				{/* Trust badges */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="mt-16 text-center"
				>
					<div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
						<div className="flex items-center gap-2">
							<Check className="w-4 h-4 text-green-500" />
							30-day money-back guarantee
						</div>
						<div className="flex items-center gap-2">
							<Check className="w-4 h-4 text-green-500" />
							No credit card required
						</div>
						<div className="flex items-center gap-2">
							<Check className="w-4 h-4 text-green-500" />
							Cancel anytime
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
