"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";

type ConsentStatus = "NOT_ENABLED" | "PENDING_EMPLOYEE" | "ACTIVE" | "REVOKED";

export function MonitoringConsentBanner() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<ConsentStatus | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConsentStatus = async () => {
      try {
        const response = await fetch("/api/monitoring/consent/me");
        if (response.ok) {
          const data = await response.json();
          setStatus(data.status);
        }
      } catch (error) {
        console.error("Failed to fetch consent status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchConsentStatus();
    } else {
      setIsLoading(false);
    }
  }, [session]);

  // Don't show if loading, dismissed, or not pending
  if (isLoading || dismissed || status !== "PENDING_EMPLOYEE") {
    return null;
  }

  return (
    <Alert className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
      <AlertTriangle className="h-5 w-5 text-amber-600" />
      <AlertTitle className="text-amber-800 dark:text-amber-400 font-semibold">
        Action Required: Monitoring Consent Pending
      </AlertTitle>
      <AlertDescription className="text-amber-700 dark:text-amber-300 mt-2">
        <p className="mb-3">
          Your administrator has enabled activity monitoring for your account. Please review and provide your consent to continue.
        </p>
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
            <Link href="/monitoring/consent">Review & Consent</Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="text-amber-700 hover:text-amber-800 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900/30"
          >
            <X className="h-4 w-4 mr-1" />
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
