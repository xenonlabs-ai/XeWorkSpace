import { Wallet, Github, Twitter, Linkedin, Mail } from "lucide-react"
import Link from "next/link"

const footerLinks = {
	product: [
		{ name: "Features", href: "#features" },
		{ name: "Pricing", href: "#pricing" },
		{ name: "Integrations", href: "/integrations" },
		{ name: "Changelog", href: "/changelog" },
		{ name: "Roadmap", href: "/roadmap" },
	],
	company: [
		{ name: "About", href: "/about" },
		{ name: "Blog", href: "/blog" },
		{ name: "Careers", href: "/careers" },
		{ name: "Contact", href: "/contact" },
		{ name: "Press Kit", href: "/press" },
	],
	resources: [
		{ name: "Documentation", href: "/docs" },
		{ name: "API Reference", href: "/docs/api" },
		{ name: "Guides", href: "/docs/guides" },
		{ name: "Help Center", href: "/help" },
		{ name: "Community", href: "/community" },
	],
	legal: [
		{ name: "Privacy Policy", href: "/privacy" },
		{ name: "Terms of Service", href: "/terms" },
		{ name: "Cookie Policy", href: "/cookies" },
		{ name: "GDPR", href: "/gdpr" },
		{ name: "Security", href: "/security" },
	],
}

const socialLinks = [
	{ name: "GitHub", icon: Github, href: "https://github.com" },
	{ name: "Twitter", icon: Twitter, href: "https://twitter.com" },
	{ name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
	{ name: "Email", icon: Mail, href: "mailto:hello@xetask.com" },
]

export function LandingFooter() {
	return (
		<footer className="bg-muted/50 border-t">
			<div className="container mx-auto px-4 py-12 lg:py-16">
				<div className="grid gap-8 lg:grid-cols-6">
					{/* Brand */}
					<div className="lg:col-span-2">
						<Link href="/" className="flex items-center gap-2 mb-4">
							<Wallet className="h-8 w-8 text-primary" />
							<span className="text-xl font-bold">XeWorkspace</span>
						</Link>
						<p className="text-sm text-muted-foreground mb-6 max-w-xs">
							The all-in-one platform for team management, task tracking, and productivity analytics.
						</p>
						{/* Social Links */}
						<div className="flex gap-4">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									<social.icon className="w-5 h-5" />
									<span className="sr-only">{social.name}</span>
								</a>
							))}
						</div>
					</div>

					{/* Links */}
					<div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:col-span-4">
						<div>
							<h3 className="font-semibold mb-4">Product</h3>
							<ul className="space-y-3">
								{footerLinks.product.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Company</h3>
							<ul className="space-y-3">
								{footerLinks.company.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Resources</h3>
							<ul className="space-y-3">
								{footerLinks.resources.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-4">Legal</h3>
							<ul className="space-y-3">
								{footerLinks.legal.map((link) => (
									<li key={link.name}>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors"
										>
											{link.name}
										</Link>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>

				{/* Bottom bar */}
				<div className="mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4">
					<p className="text-sm text-muted-foreground">
						© {new Date().getFullYear()} XeWorkspace. All rights reserved.
					</p>
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						<Link href="/privacy" className="hover:text-foreground transition-colors">
							Privacy
						</Link>
						<Link href="/terms" className="hover:text-foreground transition-colors">
							Terms
						</Link>
						<Link href="/cookies" className="hover:text-foreground transition-colors">
							Cookies
						</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}
