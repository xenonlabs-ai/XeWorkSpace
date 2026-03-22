"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

const stats = [
	{ value: 2000, suffix: "+", label: "Teams Using XeWorkspace", description: "Active organizations" },
	{ value: 50, suffix: "K+", label: "Tasks Completed", description: "Daily task completions" },
	{ value: 99.9, suffix: "%", label: "Uptime Guaranteed", description: "Enterprise reliability" },
	{ value: 4.9, suffix: "/5", label: "User Rating", description: "Based on 1,000+ reviews" },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
	const [displayValue, setDisplayValue] = useState(0)
	const ref = useRef<HTMLSpanElement>(null)
	const isInView = useInView(ref, { once: true, margin: "-100px" })

	useEffect(() => {
		if (isInView) {
			const duration = 2000
			const steps = 60
			const increment = value / steps
			let current = 0

			const timer = setInterval(() => {
				current += increment
				if (current >= value) {
					setDisplayValue(value)
					clearInterval(timer)
				} else {
					setDisplayValue(Math.floor(current * 10) / 10)
				}
			}, duration / steps)

			return () => clearInterval(timer)
		}
	}, [isInView, value])

	return (
		<span ref={ref}>
			{Number.isInteger(value) ? Math.floor(displayValue).toLocaleString() : displayValue.toFixed(1)}
			{suffix}
		</span>
	)
}

export function StatsSection() {
	return (
		<section className="py-16 border-y bg-muted/30">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
					{stats.map((stat, index) => (
						<motion.div
							key={stat.label}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="text-center"
						>
							<div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
								<AnimatedNumber value={stat.value} suffix={stat.suffix} />
							</div>
							<div className="font-semibold text-foreground mb-1">{stat.label}</div>
							<div className="text-sm text-muted-foreground">{stat.description}</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
