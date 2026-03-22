"use client"

import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronRight, Clock, Loader2, Search, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

export interface SearchResult {
	id: string | number
	title: string
	type: string
	href: string
}

interface SearchDialogProps {
	searchOpen: boolean
	setSearchOpen: (open: boolean) => void
	searchQuery: string
	setSearchQuery: (query: string) => void
	searchResults: SearchResult[]
	isSearching?: boolean
	recentSearches?: string[]
}

export function SearchDialog({
	searchOpen,
	setSearchOpen,
	searchQuery,
	setSearchQuery,
	searchResults,
	isSearching = false,
	recentSearches = ["Budget overview", "Savings account", "Monthly expenses"],
}: SearchDialogProps) {
	const inputRef = useRef<HTMLInputElement>(null)
	const [mounted, setMounted] = useState(false)

	// Focus input when dialog opens
	useEffect(() => {
		if (searchOpen && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus()
			}, 50)
		}
	}, [searchOpen])

	// Handle keyboard shortcuts
	useEffect(() => {
		setMounted(true)

		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "k") {
				e.preventDefault()
				setSearchOpen(!searchOpen)
			}
			if (e.key === "Escape" && searchOpen) {
				setSearchOpen(false)
			}
		}

		window.addEventListener("keydown", handleKeyDown)
		return () => window.removeEventListener("keydown", handleKeyDown)
	}, [searchOpen, setSearchOpen])

	const clearSearch = () => {
		setSearchQuery("")
		inputRef.current?.focus()
	}

	return (
		<Dialog open={searchOpen} onOpenChange={setSearchOpen}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="h-9 w-9 md:h-9 md:w-60 md:justify-start md:px-3 md:py-2 relative"
				>
					<Search className="h-4 w-4 md:mr-2" />
					<span className="hidden md:inline-flex">Search...</span>
					{mounted && (
						<kbd className="pointer-events-none absolute right-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium md:flex">
							<span className="text-xs">⌘</span>
							K
						</kbd>
					)}
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px] p-0 gap-0 overflow-hidden">
				<DialogHeader className="sr-only">
					<DialogTitle>Search</DialogTitle>
				</DialogHeader>
				<Command className="rounded-lg border-none">
					<div className="flex items-center border-b px-3">
						<CommandInput
							ref={inputRef}
							value={searchQuery}
							onValueChange={setSearchQuery}
							placeholder="Search for anything..."
							className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
						/>
						{searchQuery && (
							<Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-md" onClick={clearSearch}>
								<X className="h-4 w-4" />
								<span className="sr-only">Clear search</span>
							</Button>
						)}
					</div>
					<CommandList className="max-h-[300px] overflow-auto p-2">
						{isSearching && (
							<div className="flex items-center justify-center py-6">
								<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
							</div>
						)}

						{!isSearching && searchQuery && (
							<>
								<CommandEmpty className="py-6 text-center text-sm">No results found for "{searchQuery}"</CommandEmpty>

								{searchResults.length > 0 && (
									<CommandGroup heading="Results">
										{searchResults.map((result) => (
											<CommandItem
												key={result.id}
												className="flex items-center justify-between py-2 px-2"
												value={result.title}
											>
												<div className="flex flex-col">
													<span className="font-medium">{result.title}</span>
													<span className="text-xs text-muted-foreground">{result.type}</span>
												</div>
												<Button variant="ghost" size="sm" asChild className="ml-2 h-8">
													<Link href={result.href} onClick={() => setSearchOpen(false)}>
														<span>View</span>
														<ChevronRight className="ml-1 h-4 w-4" />
													</Link>
												</Button>
											</CommandItem>
										))}
									</CommandGroup>
								)}
							</>
						)}

						{!searchQuery && (
							<CommandGroup heading="Recent Searches">
								{recentSearches.map((search, index) => (
									<CommandItem
										key={index}
										onSelect={() => setSearchQuery(search)}
										className="flex items-center gap-2 px-2"
									>
										<Clock className="h-4 w-4 text-muted-foreground" />
										<span>{search}</span>
									</CommandItem>
								))}
							</CommandGroup>
						)}
					</CommandList>
				</Command>
			</DialogContent>
		</Dialog>
	)
}
