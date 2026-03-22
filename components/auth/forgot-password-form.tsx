"use client"

import { Logo } from "@/components/logo"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function ForgotPasswordForm() {
	const [email, setEmail] = useState("")
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmitted, setIsSubmitted] = useState(false)

	const validateEmail = (email: string) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email)
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError("")

		// Validate email
		if (!validateEmail(email)) {
			setError("Please enter a valid email address")
			return
		}

		setIsLoading(true)

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500))
			setIsSubmitted(true)
		} catch (error) {
			setError("An error occurred. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-muted/40 px-4 py-12">
			<div className="max-w-md w-full space-y-8">
				<div className="text-center">
					<div className="flex justify-center">
						<Logo size="large" showText={false} />
					</div>
					<h2 className="mt-4 text-3xl font-semibold">Forgot Password</h2>
					<p className="mt-2 text-muted-foreground">Reset your XeTask account password</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Reset Password</CardTitle>
						<CardDescription>Enter your email address and we'll send you a link to reset your password</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						{isSubmitted ? (
							<div className="space-y-4">
								<Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
									<CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
									<AlertDescription className="text-green-800 dark:text-green-400">
										If an account exists with that email, we've sent a password reset link. Please check your inbox.
									</AlertDescription>
								</Alert>
								<div className="text-center mt-4">
									<Link href="/auth/login">
										<Button variant="outline">Back to Sign In</Button>
									</Link>
								</div>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="email">Email</Label>
									<div className="relative">
										<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											id="email"
											type="email"
											placeholder="name@example.com"
											className="pl-10"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											required
										/>
									</div>
								</div>

								<Button type="submit" className="w-full" disabled={isLoading}>
									{isLoading ? "Sending..." : "Send reset link"}
								</Button>
							</form>
						)}
					</CardContent>
					{!isSubmitted && (
						<CardFooter className="flex justify-center">
							<p className="text-sm text-muted-foreground">
								Remember your password?{" "}
								<Link href="/auth/login" className="text-primary hover:underline">
									Sign in
								</Link>
							</p>
						</CardFooter>
					)}
				</Card>
			</div>
		</div>
	)
}
