import { CodeBlock } from "@/components/docs/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ThemeConfigPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h1 id="theme-configuration" className="scroll-m-20 text-3xl font-semibold tracking-tight">
					Theme Configuration
				</h1>
				<p className="text-xl text-muted-foreground">
					Customize the appearance and behavior of your XeTask application.
				</p>
			</div>

			<div className="space-y-4">
				<h2 id="overview" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">
					Overview
				</h2>
				<p>
					XeTask provides a flexible theme configuration system that allows you to customize the layout, direction,
					and theme of your application. The configuration is defined in the <code>components/theme/config.jsx</code>{" "}
					file.
				</p>

				<h2 id="default-configuration" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Default Configuration
				</h2>
				<p>Here's the default theme configuration:</p>

				<CodeBlock code={`// Theme configuration options
const defaultConfig = {
  // Default layout (vertical or horizontal)
  defaultLayout: "vertical",

  // Default direction (ltr or rtl)
  defaultDirection: "ltr",

  // Theme options for next-themes
  themeOptions: {
    // Default theme (light, dark, or system)
    defaultTheme: "system",

    // Enable system theme detection
    enableSystem: true,

    // Disable automatic theme detection
    disableTransitionOnChange: false,
  },

  // Available layout options
  availableLayouts: ["vertical", "horizontal"],

  // Available direction options
  availableDirections: ["ltr", "rtl"],
}

export default defaultConfig`} />

				<h2 id="configuration-options" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Configuration Options
				</h2>

				<h3 id="layout-options" className="scroll-m-20 text-xl font-semibold tracking-tight pt-4">
					Layout Options
				</h3>
				<p>XeTask supports two layout options:</p>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<strong>vertical</strong> - The navigation menu is displayed on the left side of the screen. This is the
						default layout.
					</li>
					<li>
						<strong>horizontal</strong> - The navigation menu is displayed at the top of the screen.
					</li>
				</ul>
				<p>
					You can set the default layout using the <code>defaultLayout</code> option:
				</p>
				<div className="relative my-4 rounded-md bg-muted p-4">
					<pre className="text-sm font-mono">
						<code>{`defaultLayout: "vertical", // or "horizontal"`}</code>
					</pre>
				</div>
				<p>
					The available layout options are defined in the <code>availableLayouts</code> array:
				</p>
				<div className="relative my-4 rounded-md bg-muted p-4">
					<pre className="text-sm font-mono">
						<code>{`availableLayouts: ["vertical", "horizontal"],`}</code>
					</pre>
				</div>

				<h3 id="direction-options" className="scroll-m-20 text-xl font-semibold tracking-tight pt-6">
					Direction Options
				</h3>
				<p>XeTask supports two text direction options:</p>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<strong>ltr</strong> - Left-to-right text direction. This is the default direction and is used for languages
						like English, Spanish, etc.
					</li>
					<li>
						<strong>rtl</strong> - Right-to-left text direction. This is used for languages like Arabic, Hebrew, etc.
					</li>
				</ul>
				<p>
					You can set the default direction using the <code>defaultDirection</code> option:
				</p>
				<div className="relative my-4 rounded-md bg-muted p-4">
					<pre className="text-sm font-mono">
						<code>{`defaultDirection: "ltr", // or "rtl"`}</code>
					</pre>
				</div>
				<p>
					The available direction options are defined in the <code>availableDirections</code> array:
				</p>
				<div className="relative my-4 rounded-md bg-muted p-4">
					<pre className="text-sm font-mono">
						<code>{`availableDirections: ["ltr", "rtl"],`}</code>
					</pre>
				</div>

				<h3 id="theme-options" className="scroll-m-20 text-xl font-semibold tracking-tight pt-6">
					Theme Options
				</h3>
				<p>
					XeTask uses <code>next-themes</code> for theme management. The theme options are defined in the{" "}
					<code>themeOptions</code> object:
				</p>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<strong>defaultTheme</strong> - The default theme to use. Can be <code>"light"</code>, <code>"dark"</code>,
						or <code>"system"</code>.
					</li>
					<li>
						<strong>enableSystem</strong> - Whether to enable system theme detection. When set to <code>true</code>, the
						theme will automatically match the user's system preferences.
					</li>
					<li>
						<strong>disableTransitionOnChange</strong> - Whether to disable CSS transitions when changing themes. This
						can help prevent flickering when switching themes.
					</li>
				</ul>

				<h2 id="customizing-configuration" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Customizing Configuration
				</h2>
				<p>
					You can customize the theme configuration by modifying the <code>components/theme/config.jsx</code> file. Here
					are some examples:
				</p>

				<Tabs defaultValue="horizontal-layout">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="horizontal-layout">Horizontal Layout</TabsTrigger>
						<TabsTrigger value="rtl-support">RTL Support</TabsTrigger>
						<TabsTrigger value="dark-theme">Dark Theme</TabsTrigger>
					</TabsList>

					<TabsContent value="horizontal-layout" className="space-y-4 mt-4">
						<h3 id="horizontal-layout" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Setting Horizontal Layout as Default
						</h3>
						<p>To set the horizontal layout as the default:</p>
						<CodeBlock code={`// Theme configuration options
const defaultConfig = {
  // Set horizontal layout as default
  defaultLayout: "horizontal",
  
  // Other options remain the same
  defaultDirection: "ltr",
  themeOptions: {
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: false,
  },
  availableLayouts: ["vertical", "horizontal"],
  availableDirections: ["ltr", "rtl"],
}

export default defaultConfig`} />
					</TabsContent>

					<TabsContent value="rtl-support" className="space-y-4 mt-4">
						<h3 id="rtl-support" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Enabling RTL Support
						</h3>
						<p>To set right-to-left (RTL) as the default direction:</p>
						<CodeBlock code={`// Theme configuration options
const defaultConfig = {
  defaultLayout: "vertical",
  
  // Set RTL as default direction
  defaultDirection: "rtl",
  
  themeOptions: {
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: false,
  },
  availableLayouts: ["vertical", "horizontal"],
  availableDirections: ["ltr", "rtl"],
}

export default defaultConfig`} />
					</TabsContent>

					<TabsContent value="dark-theme" className="space-y-4 mt-4">
						<h3 id="dark-theme" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Setting Dark Theme as Default
						</h3>
						<p>To set the dark theme as the default:</p>
						<CodeBlock code={`// Theme configuration options
const defaultConfig = {
  defaultLayout: "vertical",
  defaultDirection: "ltr",
  
  themeOptions: {
    // Set dark theme as default
    defaultTheme: "dark",
    
    // Disable system theme detection
    enableSystem: false,
    
    disableTransitionOnChange: false,
  },
  availableLayouts: ["vertical", "horizontal"],
  availableDirections: ["ltr", "rtl"],
}

export default defaultConfig`} />
					</TabsContent>
				</Tabs>

				<h2 id="using-configuration" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Using Configuration in Your Application
				</h2>
				<p>
					The theme configuration is used by the <code>ThemeProvider</code> component to set up the theme for your
					application. Here's how it's used:
				</p>
				<CodeBlock code={`// components/theme/theme-provider.jsx
import { ThemeProvider as NextThemesProvider } from "next-themes"
import defaultConfig from "./config"

export function ThemeProvider({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultConfig.themeOptions.defaultTheme}
      enableSystem={defaultConfig.themeOptions.enableSystem}
      disableTransitionOnChange={defaultConfig.themeOptions.disableTransitionOnChange}
    >
      {children}
    </NextThemesProvider>
  )
}`} />

				<h2 id="advanced-customization" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Advanced Customization
				</h2>
				<p>
					For more advanced customization, you can modify the theme configuration to include additional options. For
					example, you might want to add custom color schemes or font options:
				</p>
				<CodeBlock code={`// Theme configuration options with advanced customization
const defaultConfig = {
  defaultLayout: "vertical",
  defaultDirection: "ltr",
  
  themeOptions: {
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: false,
  },
  
  // Custom color schemes
  colorSchemes: {
    default: {
      primary: "#0070f3",
      secondary: "#7928ca",
      accent: "#f5a623",
    },
    blue: {
      primary: "#2563eb",
      secondary: "#3b82f6",
      accent: "#60a5fa",
    },
    green: {
      primary: "#059669",
      secondary: "#10b981",
      accent: "#34d399",
    },
  },
  
  // Default color scheme
  defaultColorScheme: "default",
  
  // Font options
  fonts: {
    sans: "Inter, sans-serif",
    mono: "Menlo, monospace",
  },
  
  availableLayouts: ["vertical", "horizontal"],
  availableDirections: ["ltr", "rtl"],
}

export default defaultConfig`} />
				<p>You would then need to update your application to use these additional configuration options.</p>

				<h2 id="best-practices" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Best Practices
				</h2>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<strong>User Preferences</strong> - Allow users to change theme settings through a settings page.
					</li>
					<li>
						<strong>Persistence</strong> - Save user preferences in local storage or a database to persist them across
						sessions.
					</li>
					<li>
						<strong>Accessibility</strong> - Ensure that all themes have sufficient contrast ratios for accessibility.
					</li>
					<li>
						<strong>Testing</strong> - Test your application with different theme configurations to ensure it works
						correctly.
					</li>
				</ul>
			</div>
		</div>
	)
}
