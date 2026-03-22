import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CreateWalletGuidePage() {
	return (
		<div className="space-y-6">
			<div className="space-y-3">
				<h1 className="text-3xl font-semibold tracking-tight">Creating a Wallet</h1>
				<p className="text-muted-foreground">Learn how to create and set up a new wallet in XeTask.</p>
			</div>

			<div className="space-y-4">
				<h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
				<p>
					Wallets are the foundation of your financial management in XeTask. Each wallet represents a financial
					account, such as a checking account, savings account, credit card, or investment account. This guide will walk
					you through the process of creating a new wallet.
				</p>

				<Alert className="mt-4">
					<Info className="h-4 w-4" />
					<AlertTitle>Tip</AlertTitle>
					<AlertDescription>
						For the most accurate financial tracking, we recommend creating a separate wallet for each of your
						real-world financial accounts.
					</AlertDescription>
				</Alert>

				<h2 className="text-2xl font-semibold tracking-tight pt-4">Step 1: Navigate to Wallets</h2>
				<p>
					From the dashboard, click on the "Wallets" option in the main navigation menu, or click the "View All Wallets"
					button in the Wallet Overview section.
				</p>
				<div className="my-4 border rounded-md overflow-hidden">
					<Image
						src="/crypto-wallet-dashboard.png"
						alt="Navigate to Wallets"
						width={600}
						height={300}
						className="w-full"
					/>
				</div>

				<h2 className="text-2xl font-semibold tracking-tight pt-4">Step 2: Add a New Wallet</h2>
				<p>
					On the Wallets page, click the "Add Wallet" button in the top-right corner of the screen. This will open the
					Add Wallet form.
				</p>
				<div className="my-4 border rounded-md overflow-hidden">
					<Image src="/digital-wallet-button.png" alt="Add Wallet Button" width={600} height={300} className="w-full" />
				</div>

				<h2 className="text-2xl font-semibold tracking-tight pt-4">Step 3: Fill in Wallet Details</h2>
				<p>In the Add Wallet form, fill in the following information:</p>
				<ul className="list-disc pl-6 space-y-2 mt-2">
					<li>
						<strong>Wallet Name:</strong> A descriptive name for your wallet (e.g., "Chase Checking", "Savings Account")
					</li>
					<li>
						<strong>Wallet Type:</strong> Select the type of account (Checking, Savings, Credit Card, Investment, Cash,
						Other)
					</li>
					<li>
						<strong>Currency:</strong> Select the currency for this wallet
					</li>
					<li>
						<strong>Initial Balance:</strong> Enter the current balance of the account
					</li>
					<li>
						<strong>Description (Optional):</strong> Add any additional notes about this wallet
					</li>
				</ul>
				<div className="my-4 border rounded-md overflow-hidden">
					<Image
						src="/digital-wallet-fields.png"
						alt="Wallet Form Fields"
						width={600}
						height={400}
						className="w-full"
					/>
				</div>

				<h2 className="text-2xl font-semibold tracking-tight pt-4">Step 4: Save the Wallet</h2>
				<p>
					After filling in all the required information, click the "Create Wallet" button to save your new wallet.
					You'll be redirected to the wallet details page for your newly created wallet.
				</p>

				<h2 className="text-2xl font-semibold tracking-tight pt-4">Next Steps</h2>
				<p>Now that you've created a wallet, you can:</p>
				<ul className="list-disc pl-6 space-y-2 mt-2">
					<li>Add transactions to track your spending and income</li>
					<li>Set up recurring transactions for regular bills or income</li>
					<li>Transfer money between wallets</li>
					<li>View detailed reports and analytics for this wallet</li>
				</ul>

				<div className="flex gap-4 pt-4">
					<Button asChild>
						<Link href="/docs/guides/setup-budget">Next: Setting Up a Budget</Link>
					</Button>
					<Button variant="outline" asChild>
						<Link href="/docs/guides">Back to Guides</Link>
					</Button>
				</div>
			</div>
		</div>
	)
}
