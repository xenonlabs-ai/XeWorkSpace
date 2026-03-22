"use client"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, Quote, ArrowLeft, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const testimonials = [
	{
		name: "Sarah Johnson",
		role: "Engineering Manager",
		company: "TechCorp Inc.",
		avatar: "SJ",
		rating: 5,
		content: "XeWorkspace has transformed how we manage our engineering team. The performance review features are exceptional, and the analytics help us make data-driven decisions. We've seen a 35% improvement in project delivery times.",
		highlight: "35% faster delivery",
	},
	{
		name: "Michael Chen",
		role: "Operations Director",
		company: "StartupXYZ",
		avatar: "MC",
		rating: 5,
		content: "We've tried many team management tools, but XeWorkspace stands out. The attendance tracking and task management integration is seamless. Our productivity increased by 40% within the first month.",
		highlight: "40% productivity boost",
	},
	{
		name: "Emily Rodriguez",
		role: "HR Lead",
		company: "Global Solutions",
		avatar: "ER",
		rating: 5,
		content: "The performance review system in XeWorkspace is incredibly thorough. It's helped us establish clear goals and provide meaningful feedback to our team members. Employee satisfaction has improved significantly.",
		highlight: "Better feedback culture",
	},
	{
		name: "David Kim",
		role: "Project Manager",
		company: "InnovateLab",
		avatar: "DK",
		rating: 5,
		content: "Managing multiple projects across different teams has never been easier. XeWorkspace's dashboard gives me a bird's eye view of everything happening in our organization. I can't imagine going back.",
		highlight: "Complete visibility",
	},
	{
		name: "Lisa Thompson",
		role: "CEO",
		company: "Creative Agency",
		avatar: "LT",
		rating: 5,
		content: "As a growing company, we needed a scalable solution. XeWorkspace grows with us and the role-based permissions ensure everyone has access to what they need without compromising security.",
		highlight: "Scales with growth",
	},
	{
		name: "James Wilson",
		role: "Team Lead",
		company: "Enterprise Corp",
		avatar: "JW",
		rating: 5,
		content: "The communication features have reduced our meeting time by half. Team members stay aligned through task comments and real-time updates. It's been a game-changer for remote collaboration.",
		highlight: "50% fewer meetings",
	},
]

export function TestimonialsSection() {
	const [activeIndex, setActiveIndex] = useState(0)

	const nextTestimonial = () => {
		setActiveIndex((prev) => (prev + 1) % testimonials.length)
	}

	const prevTestimonial = () => {
		setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
	}

	return (
		<section className="py-24 bg-muted/30 overflow-hidden" id="testimonials">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center max-w-3xl mx-auto mb-16"
				>
					<Badge variant="outline" className="mb-4 px-4 py-1.5">Testimonials</Badge>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
						Loved by Teams{" "}
						<span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
							Worldwide
						</span>
					</h2>
					<p className="text-lg text-muted-foreground">
						Join thousands of satisfied teams who have transformed their workflow with XeWorkspace.
					</p>
				</motion.div>

				{/* Featured Testimonial */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="max-w-4xl mx-auto mb-16"
				>
					<div className="relative bg-gradient-to-br from-primary/5 to-blue-500/5 rounded-3xl p-8 md:p-12 border">
						{/* Large quote */}
						<Quote className="absolute top-8 left-8 w-16 h-16 text-primary/10" />

						<div className="relative">
							{/* Rating */}
							<div className="flex gap-1 mb-6">
								{Array.from({ length: 5 }).map((_, i) => (
									<Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
								))}
							</div>

							{/* Content */}
							<motion.p
								key={activeIndex}
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: -20 }}
								className="text-xl md:text-2xl font-medium leading-relaxed mb-8"
							>
								&ldquo;{testimonials[activeIndex].content}&rdquo;
							</motion.p>

							{/* Highlight badge */}
							<Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-0">
								{testimonials[activeIndex].highlight}
							</Badge>

							{/* Author and navigation */}
							<div className="flex items-center justify-between">
								<motion.div
									key={`author-${activeIndex}`}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="flex items-center gap-4"
								>
									<Avatar className="h-14 w-14 border-2 border-primary/20">
										<AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
											{testimonials[activeIndex].avatar}
										</AvatarFallback>
									</Avatar>
									<div>
										<div className="font-semibold text-lg">{testimonials[activeIndex].name}</div>
										<div className="text-muted-foreground">
											{testimonials[activeIndex].role} at {testimonials[activeIndex].company}
										</div>
									</div>
								</motion.div>

								{/* Navigation */}
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="icon"
										onClick={prevTestimonial}
										className="rounded-full"
									>
										<ArrowLeft className="w-4 h-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={nextTestimonial}
										className="rounded-full"
									>
										<ArrowRight className="w-4 h-4" />
									</Button>
								</div>
							</div>

							{/* Dots */}
							<div className="flex justify-center gap-2 mt-8">
								{testimonials.map((_, index) => (
									<button
										key={index}
										onClick={() => setActiveIndex(index)}
										className={`w-2 h-2 rounded-full transition-all ${
											index === activeIndex
												? "bg-primary w-6"
												: "bg-muted-foreground/30 hover:bg-muted-foreground/50"
										}`}
									/>
								))}
							</div>
						</div>
					</div>
				</motion.div>

				{/* Testimonials Grid */}
				<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
					{testimonials.map((testimonial, index) => (
						<motion.div
							key={testimonial.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							onClick={() => setActiveIndex(index)}
							className={`cursor-pointer group p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
								index === activeIndex
									? "bg-primary/5 border-primary/20"
									: "bg-background hover:bg-muted/50"
							}`}
						>
							{/* Rating */}
							<div className="flex gap-0.5 mb-3">
								{Array.from({ length: testimonial.rating }).map((_, i) => (
									<Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
								))}
							</div>

							{/* Content */}
							<p className="text-sm text-muted-foreground mb-4 line-clamp-3">
								&ldquo;{testimonial.content}&rdquo;
							</p>

							{/* Author */}
							<div className="flex items-center gap-3">
								<Avatar className="h-9 w-9">
									<AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
										{testimonial.avatar}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="font-medium text-sm">{testimonial.name}</div>
									<div className="text-xs text-muted-foreground">
										{testimonial.company}
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
