"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface Heading {
	id: string
	text: string
	level: number
}

export function DocToc() {
	const [headings, setHeadings] = useState<Heading[]>([])
	const [activeId, setActiveId] = useState("")

	useEffect(() => {
		// Find all h2 and h3 elements
		const headingElements = Array.from(document.querySelectorAll("h2, h3"))

		// Map them to our data structure and ensure unique IDs
		const processedHeadings = headingElements.map((element, index) => {
			// Use the existing ID or generate one based on text content and index
			const id =
				element.id || `heading-${index}-${element.textContent?.trim().toLowerCase().replace(/\s+/g, "-") || index}`

			// If the element doesn't have an ID, set one so we can link to it
			if (!element.id) {
				element.id = id
			}

			return {
				id,
				text: element.textContent || `Heading ${index}`,
				level: element.tagName === "H2" ? 2 : 3,
			}
		})

		setHeadings(processedHeadings)

		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id)
					}
				})
			},
			{ rootMargin: "0px 0px -80% 0px" },
		)

		// Observe all heading elements
		processedHeadings.forEach(({ id }) => {
			const element = document.getElementById(id)
			if (element) {
				observer.observe(element)
			}
		})

		return () => {
			// Clean up by unobserving all elements
			processedHeadings.forEach(({ id }) => {
				const element = document.getElementById(id)
				if (element) {
					observer.unobserve(element)
				}
			})
		}
	}, [])

	if (headings.length === 0) {
		return null
	}

	return (
		<div className="hidden text-sm xl:block">
			<div className="sticky top-16 -mt-10 pt-10">
				<div className="space-y-2 pb-8">
					<p className="font-medium">On This Page</p>
					<ul className="m-0 list-none">
						{headings.map(({ id, text, level }) => (
							<li key={id} className={cn("mt-0 pt-2", level === 3 && "pl-4")}>
								<a
									href={`#${id}`}
									className={cn(
										"inline-block no-underline transition-colors hover:text-foreground",
										activeId === id ? "font-medium text-foreground" : "text-muted-foreground",
									)}
								>
									{text}
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	)
}
