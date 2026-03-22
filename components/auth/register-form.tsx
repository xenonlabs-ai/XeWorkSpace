"use client"

import { Logo } from "@/components/logo"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Lock, Mail, User } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export function RegisterForm() {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	})
	const [agreeTerms, setAgreeTerms] = useState(false)
	const [error, setError] = useState("")
	const [isLoading, setIsLoading] = useState(false)

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		setFormData((prev) => ({
			...prev,
			[id]: value,
		}))
	}

	const validatePassword = (password: string) => {
		// Basic password validation - at least 8 chars with a number and special char
		const hasNumber = /\d/.test(password)
		const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
		return password.length >= 8 && hasNumber && hasSpecial
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError("")

		const { password, confirmPassword, email } = formData

		// Validate passwords match
		if (password !== confirmPassword) {
			setError("Passwords do not match")
			return
		}

		// Validate password strength
		if (!validatePassword(password)) {
			setError("Password must be at least 8 characters long and include a number and a special character")
			return
		}

		// Validate terms agreement
		if (!agreeTerms) {
			setError("You must agree to the terms and conditions")
			return
		}

		setIsLoading(true)

		try {
			// Register the user
			const response = await fetch("/api/auth/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: formData.email,
					password: formData.password,
					firstName: formData.firstName,
					lastName: formData.lastName,
				}),
			})

			const data = await response.json()

			if (!response.ok) {
				setError(data.error || "Registration failed")
				return
			}

			// Auto sign-in after registration
			const { signIn } = await import("next-auth/react")
			const result = await signIn("credentials", {
				email: formData.email,
				password: formData.password,
				redirect: false,
			})

			if (result?.error) {
				// Registration succeeded but sign-in failed, redirect to login
				window.location.href = "/auth/login"
			} else {
				window.location.href = "/"
			}
		} catch (error) {
			setError("An error occurred during registration. Please try again.")
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
					<h2 className="mt-4 text-3xl font-semibold">Create an account</h2>
					<p className="mt-2 text-muted-foreground">Sign up for XeTask to manage your team</p>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Sign Up</CardTitle>
						<CardDescription>Enter your information to create an account</CardDescription>
					</CardHeader>
					<CardContent>
						{error && (
							<Alert variant="destructive" className="mb-4">
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>{error}</AlertDescription>
							</Alert>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="firstName">First Name</Label>
									<div className="relative">
										<User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
										<Input
											id="firstName"
											placeholder="John"
											className="pl-10"
											value={formData.firstName}
											onChange={handleChange}
											required
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="lastName">Last Name</Label>
									<Input id="lastName" placeholder="Doe" value={formData.lastName} onChange={handleChange} required />
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="email"
										type="email"
										placeholder="name@example.com"
										className="pl-10"
										value={formData.email}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										type="password"
										placeholder="••••••••"
										className="pl-10"
										value={formData.password}
										onChange={handleChange}
										required
									/>
								</div>
								<p className="text-xs text-muted-foreground">
									Password must be at least 8 characters long and include a number and a special character.
								</p>
							</div>

							<div className="space-y-2">
								<Label htmlFor="confirmPassword">Confirm Password</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
									<Input
										id="confirmPassword"
										type="password"
										placeholder="••••••••"
										className="pl-10"
										value={formData.confirmPassword}
										onChange={handleChange}
										required
									/>
								</div>
							</div>

							<div className="flex items-start space-x-2">
								<Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(checked === true)} className="mt-1" />
								<Label htmlFor="terms" className="text-sm">
									I agree to the{" "}
									<Link href="/terms" className="text-primary hover:underline">
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link href="/privacy" className="text-primary hover:underline">
										Privacy Policy
									</Link>
								</Label>
							</div>

							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Creating account..." : "Create account"}
							</Button>
						</form>
					</CardContent>
					<CardFooter className="flex justify-center">
						<p className="text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link href="/auth/login" className="text-primary hover:underline">
								Sign in
							</Link>
						</p>
					</CardFooter>
				</Card>
			</div>
		</div>
	)
}
