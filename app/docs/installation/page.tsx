import { CodeBlock } from "@/components/docs/code-block"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function InstallationPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h1 id="installation" className="scroll-m-20 text-3xl font-semibold tracking-tight">
					Installation
				</h1>
				<p className="text-muted-foreground">
					Learn how to install and set up XeTask for your Next.js application.
				</p>
			</div>

			<div className="space-y-4">
				<h2 id="prerequisites" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-4">
					Prerequisites
				</h2>
				<p>Before you begin, make sure you have the following installed on your system:</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>
						<strong>Node.js 18.0.0</strong> or later
					</li>
					<li>
						<strong>npm 9.0.0</strong> or later (comes with Node.js) or <strong>yarn</strong> or <strong>pnpm</strong>
					</li>
					<li>Basic knowledge of React and Next.js</li>
				</ul>

				<h2 id="installation-options" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Installation Options
				</h2>
				<p>You can install XeTask using one of the following methods:</p>

				<Tabs defaultValue="create-next-app">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="create-next-app">Create Next App</TabsTrigger>
						<TabsTrigger value="manual">Manual Setup</TabsTrigger>
						<TabsTrigger value="docker">Docker</TabsTrigger>
					</TabsList>

					<TabsContent value="create-next-app" className="space-y-4 mt-4">
						<h3 id="create-next-app" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Using Create Next App
						</h3>
						<p>The easiest way to get started with XeTask is to use Create Next App with our template.</p>
						<CodeBlock code="npx create-next-app@latest my-wallet-app --example https://github.com/XeTask/template" />
						<p>This will create a new Next.js project with XeTask pre-configured and ready to use.</p>
					</TabsContent>

					<TabsContent value="manual" className="space-y-4 mt-4">
						<h3 id="manual-setup" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Manual Setup
						</h3>
						<p>If you already have an existing Next.js project, you can install XeTask manually.</p>
						<h4 id="step-1" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 1: Create or use an existing Next.js project
						</h4>
						<CodeBlock code="npx create-next-app@latest my-wallet-app" />

						<h4 id="step-2" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 2: Install XeTask and its dependencies
						</h4>
						<CodeBlock code="npm install @XeTask/core @XeTask/ui" />

						<h4 id="step-3" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 3: Set up the configuration
						</h4>
						<p>
							Create a <code>XeTask.config.js</code> file in the root of your project:
						</p>
						<CodeBlock code={`// XeTask.config.js
module.exports = {
  theme: {
    primaryColor: '#0070f3',
    layout: 'horizontal', // or 'vertical'
  },
  features: {
    wallets: true,
    budget: true,
    bills: true,
    goals: true,
    reports: true,
  },
  api: {
    baseUrl: process.env.API_URL || 'https://api.example.com',
  },
}`} />

						<h4 id="step-4" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 4: Import and use XeTask components
						</h4>
						<p>Now you can import and use XeTask components in your Next.js application:</p>
						<CodeBlock code={`// app/page.js
import { Dashboard } from '@XeTask/ui'

export default function Home() {
  return (
    <main>
      <Dashboard />
    </main>
  )
}`} />
					</TabsContent>

					<TabsContent value="docker" className="space-y-4 mt-4">
						<h3 id="docker-setup" className="scroll-m-20 text-xl font-semibold tracking-tight">
							Using Docker
						</h3>
						<p>You can also run XeTask using Docker for a containerized setup.</p>
						<h4 id="docker-step-1" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 1: Create a Dockerfile
						</h4>
						<p>
							Create a <code>Dockerfile</code> in the root of your project:
						</p>
						<CodeBlock code={`FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]`} />

						<h4 id="docker-step-2" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 2: Create a docker-compose.yml file
						</h4>
						<p>
							Create a <code>docker-compose.yml</code> file in the root of your project:
						</p>
						<CodeBlock code={`version: '3'

services:
  XeTask:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - API_URL=https://api.example.com
      - NODE_ENV=production`} />

						<h4 id="docker-step-3" className="scroll-m-20 text-lg font-semibold tracking-tight mt-4">
							Step 3: Build and run the Docker container
						</h4>
						<p>Run the following command to build and start the Docker container:</p>
						<CodeBlock code="docker-compose up -d" />
						<p>
							Your XeTask application will now be running at <code>http://localhost:3000</code>.
						</p>
					</TabsContent>
				</Tabs>

				<h2 id="next-steps" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Next Steps
				</h2>
				<p>Now that you have installed XeTask, you can:</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>
						<a href="/docs/configuration/theme-config" className="text-primary hover:underline">
							Configure the theme
						</a>{" "}
						to match your brand
					</li>
					<li>
						<a href="/docs/guides/create-wallet" className="text-primary hover:underline">
							Create your first wallet
						</a>{" "}
						to start managing your finances
					</li>
					<li>
						<a href="/docs/api/authentication" className="text-primary hover:underline">
							Set up authentication
						</a>{" "}
						to secure your application
					</li>
				</ul>

				<h2 id="troubleshooting" className="scroll-m-20 text-2xl font-semibold tracking-tight pt-6">
					Troubleshooting
				</h2>
				<p>If you encounter any issues during installation, check the following:</p>
				<ul className="list-disc pl-6 space-y-2">
					<li>Make sure you have the correct versions of Node.js and npm installed</li>
					<li>Check that all dependencies are properly installed</li>
					<li>Verify that your configuration file is correctly formatted</li>
					<li>Check the console for any error messages</li>
				</ul>
				<p className="mt-4">
					If you still have issues, please{" "}
					<a href="https://github.com/XeTask/XeTask/issues" className="text-primary hover:underline">
						open an issue
					</a>{" "}
					on our GitHub repository.
				</p>
			</div>
		</div>
	)
}
