"use client"

import { LandingHeader } from "./landing-header"
import { HeroSection } from "./hero-section"
import { StatsSection } from "./stats-section"
import { FeaturesSection } from "./features-section"
import { HowItWorksSection } from "./how-it-works-section"
import { TestimonialsSection } from "./testimonials-section"
import { PricingSection } from "./pricing-section"
import { FAQSection } from "./faq-section"
import { CTASection } from "./cta-section"
import { LandingFooter } from "./landing-footer"

export function LandingPage() {
	return (
		<div className="min-h-screen scroll-smooth">
			<LandingHeader />
			<main>
				<HeroSection />
				<StatsSection />
				<FeaturesSection />
				<HowItWorksSection />
				<TestimonialsSection />
				<PricingSection />
				<FAQSection />
				<CTASection />
			</main>
			<LandingFooter />
		</div>
	)
}

export { LandingHeader } from "./landing-header"
export { HeroSection } from "./hero-section"
export { StatsSection } from "./stats-section"
export { FeaturesSection } from "./features-section"
export { HowItWorksSection } from "./how-it-works-section"
export { TestimonialsSection } from "./testimonials-section"
export { PricingSection } from "./pricing-section"
export { FAQSection } from "./faq-section"
export { CTASection } from "./cta-section"
export { LandingFooter } from "./landing-footer"
