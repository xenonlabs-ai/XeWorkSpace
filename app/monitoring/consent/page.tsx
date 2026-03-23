"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { monitoringApi } from "@/lib/api";
import {
  Shield,
  ShieldCheck,
  ShieldOff,
  Clock,
  Monitor,
  Camera,
  Activity,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  Download,
  Laptop,
  MonitorDown,
  MonitorSmartphone,
  Copy,
  RefreshCw,
  Sparkles,
  Wifi,
  WifiOff
} from "lucide-react";

interface ConnectedDevice {
  deviceId: string;
  connectedAt: string;
  expiresAt?: string;
}

interface ConsentData {
  status: "NOT_ENABLED" | "PENDING_EMPLOYEE" | "ACTIVE" | "REVOKED";
  consent: {
    adminEnabled: boolean;
    adminEnabledAt?: string;
    employeeConsented: boolean;
    employeeConsentedAt?: string;
    consentVersion: string;
    revokedAt?: string;
    revokedBy?: string;
    revocationReason?: string;
  } | null;
  connectedDevices?: ConnectedDevice[];
}

export default function ConsentPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  const [consentData, setConsentData] = useState<ConsentData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [revokeReason, setRevokeReason] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [agentDownloadDialogOpen, setAgentDownloadDialogOpen] = useState(false);
  const [serverUrl, setServerUrl] = useState("");
  const [agentAvailability, setAgentAvailability] = useState<{
    windows: { available: boolean; label: string };
    mac: { available: boolean; label: string };
    linux: { available: boolean; label: string };
  } | null>(null);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [setupCode, setSetupCode] = useState<string | null>(null);
  const [setupCodeExpiresAt, setSetupCodeExpiresAt] = useState<string | null>(null);
  const [isRegeneratingCode, setIsRegeneratingCode] = useState(false);
  const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);

  useEffect(() => {
    // Set server URL from current origin
    setServerUrl(window.location.origin);
  }, []);

  // Check agent availability when dialog opens
  useEffect(() => {
    if (agentDownloadDialogOpen) {
      checkAgentAvailability();
    }
  }, [agentDownloadDialogOpen]);

  const checkAgentAvailability = async () => {
    try {
      const response = await fetch("/api/downloads/agent/status");
      if (response.ok) {
        const data = await response.json();
        setAgentAvailability(data.availability);
      }
    } catch (error) {
      console.error("Failed to check agent availability:", error);
    }
  };

  const handleDownload = (platform: "windows" | "mac" | "linux") => {
    // Open download URL directly - browser will handle the redirect and download
    window.open(`/api/downloads/agent?platform=${platform}`, "_blank");
  };

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/auth/login");
      return;
    }

    if (sessionStatus === "authenticated") {
      fetchConsentStatus();
    }
  }, [sessionStatus, router]);

  const fetchConsentStatus = async () => {
    try {
      setIsLoading(true);
      const data = await monitoringApi.getMyConsent();
      setConsentData(data);
      // Capture setup code if available
      if (data.setupCode) {
        setSetupCode(data.setupCode);
        setSetupCodeExpiresAt(data.setupCodeExpiresAt);
      }
      // Capture connected devices
      if (data.connectedDevices) {
        setConnectedDevices(data.connectedDevices);
      }
    } catch (error) {
      console.error("Error fetching consent status:", error);
      setMessage({ type: "error", text: "Failed to load consent status" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptConsent = async () => {
    if (!acknowledged) {
      setMessage({ type: "error", text: "Please acknowledge the monitoring terms" });
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await monitoringApi.submitMyConsent(true, "1.0");
      setMessage({ type: "success", text: "Consent submitted successfully. Monitoring is now active." });
      // Capture setup code from response
      if (result.setupCode) {
        setSetupCode(result.setupCode);
        setSetupCodeExpiresAt(result.setupCodeExpiresAt);
      }
      await fetchConsentStatus();
      // Show the desktop agent download dialog after successful consent
      setAgentDownloadDialogOpen(true);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to submit consent" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineConsent = async () => {
    try {
      setIsSubmitting(true);
      await monitoringApi.submitMyConsent(false);
      setMessage({ type: "success", text: "You have declined monitoring consent." });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to process request" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegenerateSetupCode = async () => {
    try {
      setIsRegeneratingCode(true);
      console.log("Regenerating setup code...");
      const result = await monitoringApi.regenerateSetupCode();
      console.log("Regenerate result:", result);
      if (result.setupCode) {
        setSetupCode(result.setupCode);
        setSetupCodeExpiresAt(result.setupCodeExpiresAt);
        setMessage({ type: "success", text: "Setup code generated!" });
      } else if (result.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "error", text: "Failed to generate setup code. Please try again." });
      }
    } catch (error: any) {
      console.error("Regenerate setup code error:", error);
      setMessage({ type: "error", text: error.message || "Failed to generate setup code" });
    } finally {
      setIsRegeneratingCode(false);
    }
  };

  const copySetupCode = () => {
    if (setupCode) {
      navigator.clipboard.writeText(setupCode);
      setMessage({ type: "success", text: "Setup code copied to clipboard!" });
    }
  };

  const handleRevokeConsent = async () => {
    try {
      setIsSubmitting(true);
      await monitoringApi.revokeMyConsent(revokeReason);
      setMessage({ type: "success", text: "Consent revoked successfully. Monitoring has been disabled." });
      setRevokeDialogOpen(false);
      setRevokeReason("");
      await fetchConsentStatus();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to revoke consent" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500"><ShieldCheck className="h-3 w-3 mr-1" /> Active</Badge>;
      case "PENDING_EMPLOYEE":
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" /> Pending Your Consent</Badge>;
      case "REVOKED":
        return <Badge className="bg-red-500"><ShieldOff className="h-3 w-3 mr-1" /> Revoked</Badge>;
      default:
        return <Badge variant="secondary"><Shield className="h-3 w-3 mr-1" /> Not Enabled</Badge>;
    }
  };

  if (sessionStatus === "loading" || isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Desktop Monitoring Consent</h1>
          <p className="text-muted-foreground">
            Review and manage your desktop monitoring consent settings
          </p>
        </div>

        {message && (
          <Alert className={`mb-6 ${message.type === "error" ? "border-red-500" : "border-green-500"}`}>
            {message.type === "error" ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
            <AlertTitle>{message.type === "error" ? "Error" : "Success"}</AlertTitle>
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Current Status Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Current Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-medium">Monitoring Status</p>
                <p className="text-sm text-muted-foreground">
                  {consentData?.status === "ACTIVE" && "Your desktop activity is being monitored"}
                  {consentData?.status === "PENDING_EMPLOYEE" && "Your administrator has requested monitoring consent"}
                  {consentData?.status === "REVOKED" && "Monitoring consent has been revoked"}
                  {consentData?.status === "NOT_ENABLED" && "Monitoring has not been enabled for your account"}
                </p>
              </div>
              {consentData && getStatusBadge(consentData.status)}
            </div>

            {consentData?.consent?.employeeConsentedAt && consentData.status === "ACTIVE" && (
              <p className="text-xs text-muted-foreground mt-4">
                Consent given on: {new Date(consentData.consent.employeeConsentedAt).toLocaleString()}
              </p>
            )}

            {consentData?.consent?.revokedAt && (
              <p className="text-xs text-muted-foreground mt-4">
                Revoked on: {new Date(consentData.consent.revokedAt).toLocaleString()}
                {consentData.consent.revokedBy && ` by ${consentData.consent.revokedBy}`}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Consent Required - Show form */}
        {consentData?.status === "PENDING_EMPLOYEE" && (
          <>
            {/* What Will Be Monitored */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  What Will Be Monitored
                </CardTitle>
                <CardDescription>
                  By providing consent, you agree to the following monitoring activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Camera className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Periodic Screenshots</p>
                      <p className="text-sm text-muted-foreground">
                        Screenshots are captured at regular intervals during work hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Monitor className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Application Usage</p>
                      <p className="text-sm text-muted-foreground">
                        Active applications and window titles are tracked
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Activity className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Activity Time</p>
                      <p className="text-sm text-muted-foreground">
                        Active and idle time is recorded for productivity tracking
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <Eye className="h-5 w-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="font-medium">Live Screen View</p>
                      <p className="text-sm text-muted-foreground">
                        Administrators may view your screen in real-time
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Rights */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Your Privacy Rights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>You will be notified when monitoring is active via the desktop agent</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Monitoring only occurs during designated work hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>You can revoke consent at any time from this page</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Personal data is handled in accordance with privacy regulations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>You may request access to data collected about you</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Consent Form */}
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle>Provide Your Consent</CardTitle>
                <CardDescription>
                  Please review the information above and provide your consent
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3 mb-6">
                  <Checkbox
                    id="acknowledge"
                    checked={acknowledged}
                    onCheckedChange={(checked) => setAcknowledged(checked as boolean)}
                  />
                  <label
                    htmlFor="acknowledge"
                    className="text-sm leading-relaxed cursor-pointer"
                  >
                    I have read and understood the monitoring terms described above. I understand that my
                    desktop activity will be monitored during work hours and that I can revoke this consent
                    at any time.
                  </label>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleAcceptConsent}
                    disabled={!acknowledged || isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Processing..." : "Accept & Enable Monitoring"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleDeclineConsent}
                    disabled={isSubmitting}
                  >
                    Decline
                  </Button>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Active Monitoring - Show revoke option */}
        {consentData?.status === "ACTIVE" && (
          <>
            <Card className="border-green-200 bg-green-50/50 dark:bg-green-950/20 mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <ShieldCheck className="h-5 w-5" />
                  Monitoring Active
                </CardTitle>
                <CardDescription>
                  Your desktop monitoring is currently active. Install the desktop agent to start monitoring.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Quick Setup Code Section - Always visible for easy access */}
                <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h4 className="text-sm font-semibold">Desktop Agent Setup Code</h4>
                  </div>

                  {setupCode ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Enter this code in the desktop agent to auto-configure:
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-background border-2 border-dashed rounded-lg p-3 text-center">
                          <span className="text-2xl font-mono font-bold tracking-widest text-primary">
                            {setupCode}
                          </span>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={copySetupCode}
                          title="Copy setup code"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleRegenerateSetupCode}
                          disabled={isRegeneratingCode}
                          title="Generate new code"
                        >
                          <RefreshCw className={`h-4 w-4 ${isRegeneratingCode ? "animate-spin" : ""}`} />
                        </Button>
                      </div>
                      {setupCodeExpiresAt && (
                        <p className="text-xs text-muted-foreground text-center">
                          Code expires: {new Date(setupCodeExpiresAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Generate a setup code to easily configure the desktop agent. The code will auto-fill your credentials.
                      </p>
                      <Button
                        variant="default"
                        onClick={handleRegenerateSetupCode}
                        disabled={isRegeneratingCode}
                        className="w-full"
                      >
                        {isRegeneratingCode ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Setup Code
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Connected Devices Section */}
                <div className="rounded-xl border p-4 mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {connectedDevices.length > 0 ? (
                        <Wifi className="h-5 w-5 text-green-500" />
                      ) : (
                        <WifiOff className="h-5 w-5 text-muted-foreground" />
                      )}
                      <h4 className="text-sm font-semibold">Connected Devices</h4>
                    </div>
                    <Badge variant={connectedDevices.length > 0 ? "default" : "secondary"}>
                      {connectedDevices.length} {connectedDevices.length === 1 ? "device" : "devices"}
                    </Badge>
                  </div>

                  {connectedDevices.length > 0 ? (
                    <div className="space-y-2">
                      {connectedDevices.map((device) => (
                        <div
                          key={device.deviceId}
                          className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800"
                        >
                          <div className="flex items-center gap-3">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <div>
                              <p className="text-sm font-medium">{device.deviceId}</p>
                              <p className="text-xs text-muted-foreground">
                                Connected: {new Date(device.connectedAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-600 border-green-300">
                            Active
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <WifiOff className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No devices connected yet</p>
                      <p className="text-xs">Use the setup code above to connect your desktop agent</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <Button
                    variant="outline"
                    onClick={() => setAgentDownloadDialogOpen(true)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Desktop Agent
                  </Button>
                </div>

                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Revoking consent will stop all monitoring activities. Your administrator will be notified.
                  </AlertDescription>
                </Alert>

                <Button
                  variant="destructive"
                  onClick={() => setRevokeDialogOpen(true)}
                >
                  <ShieldOff className="h-4 w-4 mr-2" />
                  Revoke Consent
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Not Enabled */}
        {consentData?.status === "NOT_ENABLED" && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Monitoring Not Enabled</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Desktop monitoring has not been enabled for your account by your administrator.
                  No action is required from you at this time.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Revoked */}
        {consentData?.status === "REVOKED" && (
          <Card className="border-red-200 bg-red-50/50 dark:bg-red-950/20">
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <ShieldOff className="h-12 w-12 mx-auto text-red-500 mb-4" />
                <h3 className="text-lg font-medium mb-2">Consent Revoked</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Monitoring consent has been revoked. If you need to re-enable monitoring,
                  please contact your administrator.
                </p>
                {consentData.consent?.revocationReason && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Reason: {consentData.consent.revocationReason}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Revoke Dialog */}
        <Dialog open={revokeDialogOpen} onOpenChange={setRevokeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Revoke Monitoring Consent</DialogTitle>
              <DialogDescription>
                Are you sure you want to revoke your monitoring consent? This will stop all
                desktop monitoring activities.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <label className="text-sm font-medium mb-2 block">
                Reason (optional)
              </label>
              <Textarea
                placeholder="Please provide a reason for revoking consent..."
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRevokeDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRevokeConsent}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Revoke Consent"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Desktop Agent Download Dialog */}
        <Dialog open={agentDownloadDialogOpen} onOpenChange={setAgentDownloadDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MonitorDown className="h-5 w-5 text-primary" />
                Install Desktop Agent
              </DialogTitle>
              <DialogDescription>
                To start monitoring, please download and install the XeWorkspace Desktop Agent on your computer.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-800 dark:text-blue-400">Consent Accepted</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                  Your consent has been recorded. Install the desktop agent to begin monitoring.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Select your operating system:</p>

                {agentAvailability && !agentAvailability.windows.available && !agentAvailability.mac.available && !agentAvailability.linux.available && (
                  <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800 dark:text-amber-400">Agent Not Built</AlertTitle>
                    <AlertDescription className="text-amber-700 dark:text-amber-300">
                      The desktop agent installers have not been built yet. Please contact your administrator to build and deploy the agent.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-3">
                  <Button
                    variant="outline"
                    className={`h-auto py-4 justify-start gap-4 hover:bg-primary/5 hover:border-primary ${agentAvailability?.windows.available === false ? "opacity-50" : ""}`}
                    onClick={() => handleDownload("windows")}
                    disabled={isDownloading !== null || agentAvailability?.windows.available === false}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                      <Laptop className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Windows</p>
                      <p className="text-xs text-muted-foreground">
                        {agentAvailability?.windows.available === false ? "Not available" : "Download .exe installer"}
                      </p>
                    </div>
                    {isDownloading === "windows" ? (
                      <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Download className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className={`h-auto py-4 justify-start gap-4 hover:bg-primary/5 hover:border-primary ${agentAvailability?.mac.available === false ? "opacity-50" : ""}`}
                    onClick={() => handleDownload("mac")}
                    disabled={isDownloading !== null || agentAvailability?.mac.available === false}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                      <MonitorSmartphone className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">macOS</p>
                      <p className="text-xs text-muted-foreground">
                        {agentAvailability?.mac.available === false ? "Not available" : "Download .dmg installer"}
                      </p>
                    </div>
                    {isDownloading === "mac" ? (
                      <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Download className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className={`h-auto py-4 justify-start gap-4 hover:bg-primary/5 hover:border-primary ${agentAvailability?.linux.available === false ? "opacity-50" : ""}`}
                    onClick={() => handleDownload("linux")}
                    disabled={isDownloading !== null || agentAvailability?.linux.available === false}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900">
                      <Monitor className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Linux</p>
                      <p className="text-xs text-muted-foreground">
                        {agentAvailability?.linux.available === false ? "Not available" : "Download .AppImage"}
                      </p>
                    </div>
                    {isDownloading === "linux" ? (
                      <div className="ml-auto h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <Download className="ml-auto h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick Setup Code Section */}
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-4 mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h4 className="text-sm font-semibold">Quick Setup (Recommended)</h4>
                </div>

                {setupCode ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      Enter this code in the desktop agent to auto-configure:
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-background border-2 border-dashed rounded-lg p-3 text-center">
                        <span className="text-2xl font-mono font-bold tracking-widest text-primary">
                          {setupCode}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={copySetupCode}
                        title="Copy setup code"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleRegenerateSetupCode}
                        disabled={isRegeneratingCode}
                        title="Generate new code"
                      >
                        <RefreshCw className={`h-4 w-4 ${isRegeneratingCode ? "animate-spin" : ""}`} />
                      </Button>
                    </div>
                    {setupCodeExpiresAt && (
                      <p className="text-xs text-muted-foreground text-center">
                        Code expires: {new Date(setupCodeExpiresAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground text-center">
                      Generate a setup code to easily configure the desktop agent
                    </p>
                    <div className="text-center">
                      <Button
                        variant="default"
                        onClick={handleRegenerateSetupCode}
                        disabled={isRegeneratingCode}
                        className="min-w-[200px]"
                      >
                        {isRegeneratingCode ? (
                          <>
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Setup Code
                          </>
                        )}
                      </Button>
                    </div>
                    {message && (
                      <p className={`text-xs text-center ${message.type === "error" ? "text-red-500" : "text-green-500"}`}>
                        {message.text}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Manual Setup Instructions */}
              <details className="rounded-lg border p-4 mt-2">
                <summary className="text-sm font-medium cursor-pointer">Manual Setup Instructions</summary>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside mt-3">
                  <li>Launch the XeWorkspace Agent application</li>
                  <li>Enter the server URL: <code className="bg-muted px-1 rounded">{serverUrl}</code></li>
                  <li>Sign in with your email and password</li>
                  <li>The agent will start monitoring automatically</li>
                </ol>
              </details>
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setAgentDownloadDialogOpen(false)}>
                I'll do this later
              </Button>
              <Button onClick={() => setAgentDownloadDialogOpen(false)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
