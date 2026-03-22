"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, KeyRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function ResetPasswordForm() {
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const [error, setError] = useState("")
	const [success, setSuccess] = useState(false)

	const validatePassword = (password: string) => {
		if (password.length < 8) {
			return "Password must be at least 8 characters long"
		}
		return null
	}

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError("")

		// Validate passwords match
		if (password !== confirmPassword) {
			setError("Passwords do not match")
			return
		}

		// Validate password strength
		const passwordError = validatePassword(password)
		if (passwordError) {
			setError(passwordError)
			return
		}

		setIsLoading(true)

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1500))
			setSuccess(true)
			// In a real app, you would call your API to reset the password
		} catch (err) {
			setError("Failed to reset password. Please try again.")
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
			<Card className="mx-auto w-full max-w-md">
				<CardHeader className="space-y-1 text-center">
					<CardTitle className="text-2xl font-semibold">Reset Password</CardTitle>
					<CardDescription>Enter your new password below</CardDescription>
				</CardHeader>
				<CardContent>
					{success ? (
						<div className="space-y-4 text-center">
							<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
								<KeyRound className="h-6 w-6 text-green-600" />
							</div>
							<h3 className="text-xl font-medium text-gray-900">Password Reset Successful</h3>
							<p className="text-sm text-gray-500">
								Your password has been reset successfully. You can now log in with your new password.
							</p>
							<Button className="w-full" onClick={() => router.push("/auth/login")}>
								Go to Login
							</Button>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="password">New Password</Label>
								<Input
									id="password"
									type="password"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									placeholder="Enter your new password"
									required
								/>
								<p className="text-xs text-muted-foreground">Password must be at least 8 characters long.</p>
							</div>
							<div className="space-y-2">
								<Label htmlFor="confirm-password">Confirm Password</Label>
								<Input
									id="confirm-password"
									type="password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									placeholder="Confirm your new password"
									required
								/>
							</div>
							{error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">{error}</div>}
							<Button type="submit" className="w-full" disabled={isLoading}>
								{isLoading ? "Resetting Password..." : "Reset Password"}
							</Button>
						</form>
					)}
				</CardContent>
				<CardFooter className="flex justify-center border-t p-4">
					<Link href="/auth/login" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to login
					</Link>
				</CardFooter>
			</Card>
		</div>
	)
}
