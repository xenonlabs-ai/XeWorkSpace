import { CodeBlock } from "@/components/docs/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ChangeLogoPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h1 id="changing-logo" className="scroll-m-20 text-3xl font-semibold tracking-tight">
					Changing the Logo
				</h1>
				<p className="text-xl text-muted-foreground">Learn how to customize the XeTask logo to match your brand.</p>
			</div>

			<div className="space-y-4">
				<h2 id="overview" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">
					Overview
				</h2>
				<p>
					The XeTask logo is defined in the <code>components/logo.jsx</code> file. You can customize the logo by
					modifying this file to use your own icon, text, or both.
				</p>

				<h2 id="current-logo" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Current Logo Implementation
				</h2>
				<p>Here's the current implementation of the logo component:</p>

				<CodeBlock code={`import Link from "next/link"
import { Wallet } from 'lucide-react'
import { cn } from "@/lib/utils"

export function Logo({ className, showText = true, size = "default" }) {
  // Size variants for the logo
  const sizes = {
    small: {
      container: "w-6 h-6",
      icon: "h-3.5 w-3.5",
      text: "text-base",
    },
    default: {
      container: "w-8 h-8",
      icon: "h-5 w-5",
      text: "text-xl",
    },
    large: {
      container: "w-12 h-12",
      icon: "h-7 w-7",
      text: "text-2xl",
    },
  }

  const sizeConfig = sizes[size] || sizes.default

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex items-center justify-center bg-primary rounded-md", sizeConfig.container)}>
        <Wallet className={cn("text-primary-foreground", sizeConfig.icon)} />
      </div>
      {showText && <span className={cn("font-semibold tracking-tight", sizeConfig.text)}>XeTask</span>}
    </Link>
  )
}`} />

				<h2 id="customization-options" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Customization Options
				</h2>

				<Tabs defaultValue="icon">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="icon">Change Icon</TabsTrigger>
						<TabsTrigger value="text">Change Text</TabsTrigger>
						<TabsTrigger value="custom">Custom Logo</TabsTrigger>
					</TabsList>

					<TabsContent value="icon" className="space-y-4 mt-4">
						<h3 id="changing-icon" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Changing the Icon
						</h3>
						<p>
							The current logo uses the <code>Wallet</code> icon from the <code>lucide-react</code> package. You can
							replace it with any other icon from the same package or use a custom SVG.
						</p>

						<h4 className="text-lg font-medium mt-4">Using a Different Lucide Icon</h4>
						<p>
							To use a different icon from <code>lucide-react</code>, simply import the desired icon and replace the{" "}
							<code>Wallet</code> component:
						</p>

						<CodeBlock code={`// Import a different icon
import { CreditCard } from 'lucide-react'

// Then replace the Wallet component with CreditCard
<CreditCard className={cn("text-primary-foreground", sizeConfig.icon)} />`} />

						<h4 className="text-lg font-medium mt-4">Using a Custom SVG</h4>
						<p>You can also use a custom SVG icon by replacing the Lucide icon with an inline SVG:</p>

						<CodeBlock code={`// Replace the Wallet icon with a custom SVG
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  strokeWidth="2"
  strokeLinecap="round"
  strokeLinejoin="round"
  className={cn("text-primary-foreground", sizeConfig.icon)}
>
  {/* Your custom SVG path here */}
  <path d="M12 2L2 7l10 5 10-5-10-5z" />
  <path d="M2 17l10 5 10-5" />
  <path d="M2 12l10 5 10-5" />
</svg>`} />

						<h4 className="text-lg font-medium mt-4">Using an Image</h4>
						<p>
							If you prefer to use an image file (PNG, JPG, etc.) for your logo, you can use the Next.js{" "}
							<code>Image</code> component:
						</p>

						<CodeBlock code={`import Image from "next/image"

// Then replace the icon with an Image component
<div className={cn("relative flex items-center justify-center", sizeConfig.container)}>
  <Image
    src="/your-logo.png"
    alt="Your Logo"
    width={24}
    height={24}
    className={cn("object-contain", sizeConfig.icon)}
  />
</div>`} />
					</TabsContent>

					<TabsContent value="text" className="space-y-4 mt-4">
						<h3 id="changing-text" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Changing the Text
						</h3>
						<p>
							You can change the text of the logo by modifying the text content in the <code>span</code> element:
						</p>

						<CodeBlock code={`// Change the text from "XeTask" to your brand name
{showText && <span className={cn("font-semibold tracking-tight", sizeConfig.text)}>YourBrandName</span>}`} />

						<h4 className="text-lg font-medium mt-4">Styling the Text</h4>
						<p>You can also customize the styling of the text by modifying the classes:</p>

						<CodeBlock code={`// Add custom styling to the text
{showText && (
  <span className={cn(
    "font-semibold tracking-tight text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500",
    sizeConfig.text
  )}>
    YourBrandName
  </span>
)}`} />

						<h4 className="text-lg font-medium mt-4">Using a Custom Font</h4>
						<p>
							If you want to use a custom font for your logo text, you can add the font to your project and apply it to
							the text:
						</p>

						<CodeBlock code={`// In your globals.css file
@import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');

/* Then in your Logo component */
{showText && (
  <span className={cn(
    "font-semibold tracking-tight font-pacifico",
    sizeConfig.text
  )}>
    YourBrandName
  </span>
)}`} />

						<p className="mt-4">
							Don't forget to add the custom font to your Tailwind configuration in <code>tailwind.config.js</code>:
						</p>

						<CodeBlock code={`// In tailwind.config.js
module.exports = {
  // ...
  theme: {
    extend: {
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],
      },
      // ...
    },
  },
  // ...
}`} />
					</TabsContent>

					<TabsContent value="custom" className="space-y-4 mt-4">
						<h3 id="custom-logo" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Implementing a Completely Custom Logo
						</h3>
						<p>
							If you want to completely replace the logo with a custom design, you can modify the entire{" "}
							<code>Logo</code> component:
						</p>

						<CodeBlock code={`import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className, showText = true, size = "default" }) {
  // Size variants for the logo
  const sizes = {
    small: {
      logo: { width: 24, height: 24 },
      text: "text-base",
    },
    default: {
      logo: { width: 32, height: 32 },
      text: "text-xl",
    },
    large: {
      logo: { width: 48, height: 48 },
      text: "text-2xl",
    },
  }

  const sizeConfig = sizes[size] || sizes.default

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Image
        src="/your-custom-logo.svg"
        alt="Your Brand Logo"
        width={sizeConfig.logo.width}
        height={sizeConfig.logo.height}
        className="object-contain"
      />
      {showText && (
        <span className={cn("font-semibold tracking-tight", sizeConfig.text)}>
          YourBrandName
        </span>
      )}
    </Link>
  )
}`} />

						<h4 className="text-lg font-medium mt-4">Logo Only (No Text)</h4>
						<p>If you prefer to use only a logo without any text, you can simplify the component:</p>

						<CodeBlock code={`import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

export function Logo({ className, size = "default" }) {
  // Size variants for the logo
  const sizes = {
    small: { width: 24, height: 24 },
    default: { width: 32, height: 32 },
    large: { width: 48, height: 48 },
  }

  const sizeConfig = sizes[size] || sizes.default

  return (
    <Link href="/" className={cn("flex items-center", className)}>
      <Image
        src="/your-custom-logo.svg"
        alt="Your Brand Logo"
        width={sizeConfig.width}
        height={sizeConfig.height}
        className="object-contain"
      />
    </Link>
  )
}`} />
					</TabsContent>
				</Tabs>

				<h2 id="complete-example" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Complete Example
				</h2>
				<p>Here's a complete example of a customized logo component:</p>

				<CodeBlock code={`import Link from "next/link"
import { CreditCard } from 'lucide-react'
import { cn } from "@/lib/utils"

export function Logo({ className, showText = true, size = "default" }) {
  // Size variants for the logo
  const sizes = {
    small: {
      container: "w-6 h-6",
      icon: "h-3.5 w-3.5",
      text: "text-base",
    },
    default: {
      container: "w-8 h-8",
      icon: "h-5 w-5",
      text: "text-xl",
    },
    large: {
      container: "w-12 h-12",
      icon: "h-7 w-7",
      text: "text-2xl",
    },
  }

  const sizeConfig = sizes[size] || sizes.default

  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative flex items-center justify-center bg-blue-600 rounded-full", sizeConfig.container)}>
        <CreditCard className={cn("text-white", sizeConfig.icon)} />
      </div>
      {showText && (
        <span className={cn(
          "font-semibold tracking-tight text-gradient bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400",
          sizeConfig.text
        )}>
          FinanceTracker
        </span>
      )}
    </Link>
  )
}`} />

				<h2 id="best-practices" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Best Practices
				</h2>
				<ul className="list-disc pl-6 space-y-2 my-4">
					<li>
						<strong>Responsive Design</strong> - Ensure your logo looks good at all sizes by using the size variants.
					</li>
					<li>
						<strong>Accessibility</strong> - Make sure your logo has sufficient contrast and includes proper alt text
						for images.
					</li>
					<li>
						<strong>File Formats</strong> - Use SVG for vector logos when possible for better scaling and smaller file
						sizes.
					</li>
					<li>
						<strong>Performance</strong> - Optimize image files to keep them as small as possible without sacrificing
						quality.
					</li>
					<li>
						<strong>Consistency</strong> - Keep your logo consistent with your brand guidelines and overall design
						aesthetic.
					</li>
				</ul>
			</div>
		</div>
	)
}
