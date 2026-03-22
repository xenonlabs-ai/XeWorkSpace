"use client"

import { Badge } from "@/components/ui/badge"
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion"
import { motion } from "framer-motion"

const faqs = [
	{
		question: "What is XeTask and who is it for?",
		answer: "XeTask is an all-in-one team management platform designed for businesses of all sizes. It helps managers and team leads track tasks, monitor attendance, conduct performance reviews, and analyze team productivity. Whether you're a startup with 5 people or an enterprise with hundreds of employees, XeTask scales to meet your needs.",
	},
	{
		question: "How does the free trial work?",
		answer: "Our 14-day free trial gives you full access to all Professional plan features with no credit card required. Simply sign up, invite your team, and start exploring. At the end of the trial, you can choose to subscribe or downgrade to our free Starter plan.",
	},
	{
		question: "Can I switch plans at any time?",
		answer: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, the change takes effect at the end of your current billing cycle. We'll prorate any unused time if you've paid annually.",
	},
	{
		question: "Is my data secure with XeTask?",
		answer: "Absolutely. We take security seriously. All data is encrypted in transit and at rest using industry-standard AES-256 encryption. We're SOC 2 Type II certified, GDPR compliant, and conduct regular security audits. Enterprise plans also offer SSO, advanced access controls, and on-premise deployment options.",
	},
	{
		question: "Does XeTask integrate with other tools?",
		answer: "Yes! XeTask integrates with popular tools including Slack, Microsoft Teams, Google Workspace, Jira, GitHub, and many more. Our API also allows you to build custom integrations. Enterprise plans include access to our integration builder and dedicated support for custom integrations.",
	},
	{
		question: "How does attendance tracking work?",
		answer: "Team members can check in and check out directly from the web app or mobile app. Managers can view attendance records, track working hours, approve leave requests, and generate attendance reports. You can also configure policies for remote work, flexible hours, and overtime tracking.",
	},
	{
		question: "Can I customize performance review criteria?",
		answer: "Yes! XeTask allows you to create custom performance review templates with your own criteria, rating scales, and questions. You can set up review cycles (quarterly, bi-annual, annual), 360-degree feedback, self-assessments, and goal tracking. All reviews are documented and easily accessible.",
	},
	{
		question: "What kind of support do you offer?",
		answer: "All plans include email support with response times within 24 hours. Professional plans get priority support with 4-hour response times. Enterprise plans include dedicated support with a named account manager, phone support, and custom SLAs. We also have an extensive knowledge base and community forum.",
	},
	{
		question: "Can I import data from other tools?",
		answer: "Yes! We offer import tools for common formats (CSV, Excel) and direct migration support from popular platforms like Asana, Trello, Monday.com, and others. Our team can assist with data migration for Enterprise customers to ensure a smooth transition.",
	},
	{
		question: "Is there a mobile app?",
		answer: "Yes! XeTask is available on iOS and Android. Team members can check in/out, view and update tasks, communicate with team members, and receive notifications on the go. The mobile app syncs in real-time with the web application.",
	},
]

export function FAQSection() {
	return (
		<section className="py-24 bg-muted/30" id="faq">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<div className="text-center max-w-3xl mx-auto mb-16">
					<Badge variant="outline" className="mb-4">FAQ</Badge>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
						Frequently Asked{" "}
						<span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
							Questions
						</span>
					</h2>
					<p className="text-lg text-muted-foreground">
						Everything you need to know about XeTask. Can&apos;t find what you&apos;re looking for?{" "}
						<a href="/contact" className="text-primary hover:underline">Contact us</a>.
					</p>
				</div>

				{/* FAQ Accordion */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.5 }}
					className="max-w-3xl mx-auto"
				>
					<Accordion type="single" collapsible className="space-y-4">
						{faqs.map((faq, index) => (
							<AccordionItem
								key={index}
								value={`item-${index}`}
								className="bg-background border rounded-lg px-6 data-[state=open]:shadow-md transition-shadow"
							>
								<AccordionTrigger className="text-left hover:no-underline py-4">
									<span className="font-medium">{faq.question}</span>
								</AccordionTrigger>
								<AccordionContent className="text-muted-foreground pb-4 leading-relaxed">
									{faq.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</motion.div>
			</div>
		</section>
	)
}
