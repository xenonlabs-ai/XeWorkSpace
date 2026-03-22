import { Wallet } from "lucide-react"
import Link from "next/link"

export function DocFooter() {
	return (
		<footer className="border-t py-6 md:py-0">
			<div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
				<div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
					<Link href="/" className="flex items-center gap-2">
						<Wallet className="h-6 w-6" />
						<span className="font-semibold">XeWorkspace</span>
					</Link>
					<p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
						Built with Next.js and Tailwind CSS. The source code is available on{" "}
						<a
							href="https://github.com/yourusername/XeWorkspace"
							target="_blank"
							rel="noreferrer"
							className="font-medium underline underline-offset-4"
						>
							GitHub
						</a>
						.
					</p>
				</div>
				<div className="flex gap-4">
					<Link href="/docs" className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
						Documentation
					</Link>
					<Link
						href="/docs/api"
						className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
					>
						API
					</Link>
					<Link
						href="/docs/guides"
						className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
					>
						Guides
					</Link>
				</div>
			</div>
		</footer>
	)
}
