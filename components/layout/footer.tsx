import { Github, Mail, X } from "lucide-react"
import Link from "next/link"

export function Footer() {
	return (
		<footer className="border-t bg-card">
			<div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-20 md:flex-row md:py-0 max-w-full">
				<div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
					<p className="text-center text-sm text-muted-foreground md:text-left">
						&copy; {new Date().getFullYear()} XeTask. All rights reserved.
					</p>
				</div>
				<div className="flex items-center gap-4">
					<Link href="#" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
						<Github className="h-4 w-4" />
						<span className="sr-only">GitHub</span>
					</Link>
					<Link href="#" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground">
						<X className="h-4 w-4" />
						<span className="sr-only">2</span>
					</Link>
					<Link href="mailto:support@XeTask.com" className="text-muted-foreground hover:text-foreground">
						<Mail className="h-4 w-4" />
						<span className="sr-only">Email</span>
					</Link>
				</div>
			</div>
		</footer>
	)
}
