"use client"

import { useThemeContext } from "@/components/theme/theme-provider"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { ArrowLeft, ArrowRight, Monitor, Moon, PanelLeft, PanelTop, Settings, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ThemeConfig() {
	const { theme, setTheme, resolvedTheme } = useTheme()
	const { layout, setLayout, direction, setDirection, config } = useThemeContext()
	const [open, setOpen] = useState(false)
	const [primaryColor, setPrimaryColor] = useState(config.colors?.defaultPrimaryColor || "blue")

	// Handle theme change
	const handleThemeChange = (value: string) => {
		setTheme(value)
	}

	// Handle layout change
	const handleLayoutChange = (value: string) => {
		setLayout(value)
	}

	// Handle direction change
	const handleDirectionChange = (value: string) => {
		setDirection(value)
	}

	// Handle primary color change
	const handleColorChange = (color: string) => {
		setPrimaryColor(color)

		// Update CSS variables based on the selected color
		document.documentElement.style.setProperty("--primary", `var(--${color})`)
		document.documentElement.style.setProperty("--primary-foreground", `var(--${color}-foreground)`)
	}

	// Get the actual theme that's being applied (for system theme)
	const actualTheme = resolvedTheme || theme

	// Load saved primary color on component mount
	useEffect(() => {
		const savedColor = localStorage.getItem("primaryColor") || config.colors?.defaultPrimaryColor || "blue"
		setPrimaryColor(savedColor)
		handleColorChange(savedColor)
	}, [config.colors?.defaultPrimaryColor])

	// Save color preference when it changes
	useEffect(() => {
		localStorage.setItem("primaryColor", primaryColor)
	}, [primaryColor])

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="ghost" size="icon" className="text-foreground/60 hover:text-foreground relative">
					<Settings className="h-4 w-4" />
					<span className="sr-only">Settings</span>
					<span className={cn("absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full", `bg-${primaryColor}-500`)} />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[360px] p-4">
				<DialogHeader>
					<DialogTitle className="text-base">Appearance</DialogTitle>
				</DialogHeader>

				<div className="py-4 space-y-6">
					{/* Theme Selection */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Theme</Label>
						<RadioGroup value={theme} onValueChange={handleThemeChange} className="flex gap-2">
							<Label
								className={cn(
									"flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer border text-sm",
									theme === "light" && "border-primary bg-background",
								)}
							>
								<RadioGroupItem value="light" id="light" className="sr-only" />
								<Sun className="h-4 w-4" />
								Light
							</Label>

							<Label
								className={cn(
									"flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer border text-sm",
									theme === "dark" && "border-primary bg-background",
								)}
							>
								<RadioGroupItem value="dark" id="dark" className="sr-only" />
								<Moon className="h-4 w-4" />
								Dark
							</Label>

							<Label
								className={cn(
									"flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer border text-sm",
									theme === "system" && "border-primary bg-background",
								)}
							>
								<RadioGroupItem value="system" id="system" className="sr-only" />
								<Monitor className="h-4 w-4" />
								System
							</Label>
						</RadioGroup>
					</div>

					{/* Primary Color Selection */}
					<div className="space-y-2">
						<Label className="text-sm font-medium">Primary Color</Label>
						<div className="flex items-center gap-2">
							{/* <button
								onClick={() => handleColorChange("slate")}
								className={cn(
									"w-8 h-8 rounded-full bg-white border-2",
									primaryColor === "slate" ? "border-black dark:border-white" : "border-transparent",
								)}
								aria-label="White theme color"
							/> */}
							<button
								onClick={() => handleColorChange("teal")}
								style={{ backgroundColor: "#11B989" }}
								className={cn(
									"w-8 h-8 rounded-full border-2",
									primaryColor === "teal" ? "border-black dark:border-white" : "border-transparent",
								)}
								aria-label="Teal theme color"
							/>
							<button
								onClick={() => handleColorChange("pink")}
								className={cn(
									"w-8 h-8 rounded-full bg-pink-500 border-2",
									primaryColor === "pink" ? "border-black dark:border-white" : "border-transparent",
								)}
								aria-label="Pink theme color"
							/>
							<button
								onClick={() => handleColorChange("blue")}
								className={cn(
									"w-8 h-8 rounded-full bg-blue-500 border-2",
									primaryColor === "blue" ? "border-black dark:border-white" : "border-transparent",
								)}
								aria-label="Blue theme color"
							/>
							<button
								onClick={() => handleColorChange("green")}
								className={cn(
									"w-8 h-8 rounded-full bg-green-500 border-2",
									primaryColor === "green" ? "border-black dark:border-white" : "border-transparent",
								)}
								aria-label="Green theme color"
							/>
							<button
								onClick={() => handleColorChange("red")}
								className={cn(
									"w-8 h-8 rounded-full bg-red-500 border-2",
									primaryColor === "red" ? "border-black dark:border-white" : "border-transparent",
								)}
								aria-label="Red theme color"
							/>
						</div>
					</div>

					{/* Layout Selection */}
					{config.availableLayouts.length > 1 && (
						<div className="space-y-2">
							<Label className="text-sm font-medium">Layout</Label>
							<RadioGroup value={layout} onValueChange={handleLayoutChange} className="flex gap-2">
								<Label
									className={cn(
										"flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer border text-sm",
										layout === "vertical" && "border-primary bg-background",
									)}
								>
									<RadioGroupItem value="vertical" id="vertical" className="sr-only" />
									<PanelLeft className="h-4 w-4" />
									Sidebar
								</Label>

								<Label
									className={cn(
										"flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer border text-sm",
										layout === "horizontal" && "border-primary bg-background",
									)}
								>
									<RadioGroupItem value="horizontal" id="horizontal" className="sr-only" />
									<PanelTop className="h-4 w-4" />
									Horizontal
								</Label>
							</RadioGroup>
						</div>
					)}

					{/* Direction Selection */}
					{config.availableDirections.length > 1 && (
						<div className="space-y-2">
							<Label className="text-sm font-medium">Direction</Label>
							<RadioGroup value={direction} onValueChange={handleDirectionChange} className="flex gap-2">
								<Label
									className={cn(
										"flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer border text-sm",
										direction === "ltr" && "border-primary bg-background",
									)}
								>
									<RadioGroupItem value="ltr" id="ltr" className="sr-only" />
									<ArrowRight className="h-4 w-4" />
									LTR
								</Label>

								<Label
									className={cn(
										"flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer border text-sm",
										direction === "rtl" && "border-primary bg-background",
									)}
								>
									<RadioGroupItem value="rtl" id="rtl" className="sr-only" />
									<ArrowLeft className="h-4 w-4" />
									RTL
								</Label>
							</RadioGroup>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button size="sm" variant="outline" onClick={() => setOpen(false)} className="w-full">
						Close
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
