import { CodeBlock } from "@/components/docs/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ChangeColorsPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h1 id="changing-colors" className="scroll-m-20 text-3xl font-semibold tracking-tight">
					Changing Colors
				</h1>
				<p className="text-xl text-muted-foreground">
					Learn how to customize the color scheme of your XeTask application.
				</p>
			</div>

			<div className="space-y-4">
				<h2 id="overview" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">
					Overview
				</h2>
				<p>
					XeTask uses Tailwind CSS for styling, with a custom color palette defined in the{" "}
					<code>tailwind.config.js</code> file. You can customize the colors by modifying this file.
				</p>

				<h2 id="current-colors" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Current Color Configuration
				</h2>
				<p>Here's the current color configuration in the Tailwind config file:</p>

				<CodeBlock code={`/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      // ... other theme extensions
    },
  },
  plugins: [require("tailwindcss-animate")],
}`} />

				<p>
					The colors are defined using CSS variables in the <code>globals.css</code> file. These variables are then
					referenced in the Tailwind config using the <code>hsl(var(--variable-name))</code> syntax.
				</p>

				<h2 id="customization-options" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Customization Options
				</h2>

				<Tabs defaultValue="css-variables">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="css-variables">CSS Variables</TabsTrigger>
						<TabsTrigger value="tailwind-config">Tailwind Config</TabsTrigger>
						<TabsTrigger value="theme-switcher">Theme Switcher</TabsTrigger>
					</TabsList>

					<TabsContent value="css-variables" className="space-y-4 mt-4">
						<h3 id="css-variables" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Modifying CSS Variables
						</h3>
						<p>
							The easiest way to change the colors is by modifying the CSS variables in the <code>globals.css</code>{" "}
							file. Here's an example of how to change the primary color to a blue shade:
						</p>

						<CodeBlock code={`/* In globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;

  /* Change primary color to blue */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;

  /* Other variables remain the same */
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;

  /* Change primary color in dark mode */
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;

  /* Other dark mode variables remain the same */
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
}`} />

						<p className="mt-4">
							The CSS variables use the HSL (Hue, Saturation, Lightness) color format. The values are space-separated,
							with the first value being the hue (0-360), the second being the saturation (0-100%), and the third being
							the lightness (0-100%).
						</p>

						<h4 className="text-lg font-medium mt-4">Common Color Values</h4>
						<ul className="list-disc pl-6 space-y-2 my-4">
							<li>
								<strong>Blue:</strong> <code>221.2 83.2% 53.3%</code>
							</li>
							<li>
								<strong>Green:</strong> <code>142.1 76.2% 36.3%</code>
							</li>
							<li>
								<strong>Red:</strong> <code>0 84.2% 60.2%</code>
							</li>
							<li>
								<strong>Purple:</strong> <code>262.1 83.3% 57.8%</code>
							</li>
							<li>
								<strong>Orange:</strong> <code>24.6 95% 53.1%</code>
							</li>
							<li>
								<strong>Teal:</strong> <code>171.2 76.7% 36.3%</code>
							</li>
						</ul>
					</TabsContent>

					<TabsContent value="tailwind-config" className="space-y-4 mt-4">
						<h3 id="tailwind-config" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Modifying Tailwind Config
						</h3>
						<p>
							You can also add custom colors directly to the Tailwind config file. This is useful if you want to add
							brand-specific colors or additional color variants:
						</p>

						<CodeBlock code={`/** @type {import('tailwindcss').Config} */
module.exports = {
  // ... other config
  theme: {
    extend: {
      colors: {
        // Keep the existing shadcn colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        
        // Add custom brand colors
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        
        // Add specific named colors
        success: {
          DEFAULT: "#10b981",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#3b82f6",
          foreground: "#ffffff",
        },
      },
      // ... other theme extensions
    },
  },
  // ... other config
}`} />

						<p className="mt-4">
							After adding these colors to your Tailwind config, you can use them in your components with classes like{" "}
							<code>bg-brand-600</code>, <code>text-success</code>, etc.
						</p>

						<h4 className="text-lg font-medium mt-4">Using a Color Palette Generator</h4>
						<p>
							You can use tools like{" "}
							<a
								href="https://uicolors.app/create"
								target="_blank"
								rel="noopener noreferrer"
								className="text-primary underline"
							>
								Tailwind CSS Color Generator
							</a>{" "}
							to generate a full color palette from a single color.
						</p>
					</TabsContent>

					<TabsContent value="theme-switcher" className="space-y-4 mt-4">
						<h3 id="theme-switcher" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Implementing a Theme Switcher
						</h3>
						<p>
							You can implement a theme switcher that allows users to choose from different color schemes. Here's an
							example of how to create a theme switcher component:
						</p>

						<CodeBlock code={`// First, define your themes in globals.css
/* In globals.css */
:root {
  /* Default theme (blue) */
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}

[data-theme="green"] {
  --primary: 142.1 76.2% 36.3%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}

[data-theme="purple"] {
  --primary: 262.1 83.3% 57.8%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}

/* Dark mode variants */
.dark {
  /* Default dark theme */
  --primary: 217.2 91.2% 59.8%;
  /* ... other variables */
}

.dark[data-theme="green"] {
  --primary: 142.1 70.6% 45.3%;
  /* ... other variables */
}

.dark[data-theme="purple"] {
  --primary: 263.4 70% 50.4%;
  /* ... other variables */
}`} />

						<p className="mt-4">Then create a theme switcher component:</p>

						<CodeBlock code={`"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export function ThemeSwitcher() {
  const [theme, setTheme] = useState("default")

  useEffect(() => {
    // Get the saved theme from localStorage
    const savedTheme = localStorage.getItem("color-theme") || "default"
    setTheme(savedTheme)
    document.documentElement.setAttribute("data-theme", savedTheme)
  }, [])

  const handleThemeChange = (value) => {
    setTheme(value)
    localStorage.setItem("color-theme", value)
    document.documentElement.setAttribute("data-theme", value)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Color Theme</h3>
      <RadioGroup value={theme} onValueChange={handleThemeChange} className="flex gap-2">
        <div>
          <RadioGroupItem value="default" id="default" className="sr-only" />
          <Label
            htmlFor="default"
            className={cn(
              "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-blue-600",
              theme === "default" && "ring-2 ring-primary ring-offset-2"
            )}
          />
        </div>
        <div>
          <RadioGroupItem value="green" id="green" className="sr-only" />
          <Label
            htmlFor="green"
            className={cn(
              "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-green-600",
              theme === "green" && "ring-2 ring-primary ring-offset-2"
            )}
          />
        </div>
        <div>
          <RadioGroupItem value="purple" id="purple" className="sr-only" />
          <Label
            htmlFor="purple"
            className={cn(
              "flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-purple-600",
              theme === "purple" && "ring-2 ring-primary ring-offset-2"
            )}
          />
        </div>
      </RadioGroup>
    </div>
  )
}`} />

						<p className="mt-4">You can then add this component to your settings page or theme configuration dialog.</p>
					</TabsContent>
				</Tabs>

				<h2 id="complete-example" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Complete Example
				</h2>
				<p>Here's a complete example of customizing the colors for a green theme:</p>

				<CodeBlock code={`/* In globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  
  /* Green theme */
  --primary: 142.1 76.2% 36.3%;
  --primary-foreground: 355.7 100% 97.3%;
  
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;

  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 142.1 76.2% 36.3%;
  
  --radius: 0.5rem;
}

.dark {
  --background: 20 14.3% 4.1%;
  --foreground: 0 0% 95%;
  
  /* Dark mode green theme */
  --primary: 142.1 70.6% 45.3%;
  --primary-foreground: 144.9 80.4% 10%;
  
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  
  --muted: 0 0% 15%;
  --muted-foreground: 240 5% 64.9%;
  
  --accent: 12 6.5% 15.1%;
  --accent-foreground: 0 0% 98%;
  
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 85.7% 97.3%;
  
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 142.4 71.8% 29.2%;
}`} />

				<h2 id="best-practices" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Best Practices
				</h2>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<strong>Consistency</strong> - Maintain a consistent color palette throughout your application.
					</li>
					<li>
						<strong>Accessibility</strong> - Ensure that your color combinations meet WCAG accessibility standards for
						contrast.
					</li>
					<li>
						<strong>Dark Mode</strong> - Always provide appropriate dark mode variants for all your colors.
					</li>
					<li>
						<strong>User Preferences</strong> - Consider allowing users to choose their preferred color theme.
					</li>
					<li>
						<strong>Testing</strong> - Test your color changes across different devices and browsers to ensure
						consistency.
					</li>
				</ul>

				<h2 id="color-tools" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Useful Color Tools
				</h2>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<a
							href="https://uicolors.app/create"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary underline"
						>
							Tailwind CSS Color Generator
						</a>{" "}
						- Generate a full color palette from a single color.
					</li>
					<li>
						<a href="https://coolors.co/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
							Coolors
						</a>{" "}
						- Create and explore color schemes.
					</li>
					<li>
						<a
							href="https://colorhunt.co/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary underline"
						>
							Color Hunt
						</a>{" "}
						- Discover color palettes for your UI.
					</li>
					<li>
						<a
							href="https://webaim.org/resources/contrastchecker/"
							target="_blank"
							rel="noopener noreferrer"
							className="text-primary underline"
						>
							WebAIM Contrast Checker
						</a>{" "}
						- Check if your color combinations meet accessibility standards.
					</li>
				</ul>
			</div>
		</div>
	)
}
