"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { monitoringApi } from "@/lib/api";
import { Eye, EyeOff, Search, Shield, ShieldOff, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface ConsentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  department?: string;
  jobTitle?: string;
  consentStatus: "NOT_ENABLED" | "PENDING_EMPLOYEE" | "ACTIVE" | "REVOKED";
  monitoringConsent?: {
    adminEnabled: boolean;
    adminEnabledAt?: string;
    employeeConsented: boolean;
    employeeConsentedAt?: string;
    revokedAt?: string;
    revokedBy?: string;
    revocationReason?: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function ConsentManagement() {
  const [users, setUsers] = useState<ConsentUser[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [revokeDialog, setRevokeDialog] = useState<{ open: boolean; userId: string; userName: string }>({
    open: false,
    userId: "",
    userName: "",
  });
  const [revokeReason, setRevokeReason] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string> = {};
      if (statusFilter !== "all") params.status = statusFilter;

      const data = await monitoringApi.getConsentList(params);
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching consent list:", error);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEnableMonitoring = async (userId: string) => {
    setActionLoading(userId);
    try {
      await monitoringApi.enableMonitoring(userId);
      await fetchUsers();
    } catch (error) {
      console.error("Error enabling monitoring:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDisableMonitoring = async (userId: string) => {
    setActionLoading(userId);
    try {
      await monitoringApi.disableMonitoring(userId);
      await fetchUsers();
    } catch (error) {
      console.error("Error disabling monitoring:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleRevokeConsent = async () => {
    setActionLoading(revokeDialog.userId);
    try {
      await monitoringApi.revokeConsent(revokeDialog.userId, revokeReason);
      setRevokeDialog({ open: false, userId: "", userName: "" });
      setRevokeReason("");
      await fetchUsers();
    } catch (error) {
      console.error("Error revoking consent:", error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: ConsentUser["consentStatus"]) => {
    switch (status) {
      case "ACTIVE":
        return (
          <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        );
      case "PENDING_EMPLOYEE":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
            <Clock className="h-3 w-3 mr-1" />
            Pending Consent
          </Badge>
        );
      case "REVOKED":
        return (
          <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">
            <XCircle className="h-3 w-3 mr-1" />
            Revoked
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <EyeOff className="h-3 w-3 mr-1" />
            Not Enabled
          </Badge>
        );
    }
  };

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchLower) ||
      user.lastName.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.department?.toLowerCase().includes(searchLower)
    );
  });

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Consent Management
            </CardTitle>
            <CardDescription>
              Manage employee monitoring permissions and consent status
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchUsers} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="enabled">Enabled</SelectItem>
              <SelectItem value="pending">Pending Consent</SelectItem>
              <SelectItem value="consented">Active</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No employees found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={`${user.firstName} ${user.lastName}`} />
                    <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.department && (
                      <p className="text-xs text-muted-foreground">{user.department}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {getStatusBadge(user.consentStatus)}

                  <div className="flex items-center gap-2">
                    {user.consentStatus === "NOT_ENABLED" || user.consentStatus === "REVOKED" ? (
                      <Button
                        size="sm"
                        onClick={() => handleEnableMonitoring(user.id)}
                        disabled={actionLoading === user.id}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Enable
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisableMonitoring(user.id)}
                          disabled={actionLoading === user.id}
                        >
                          <EyeOff className="h-4 w-4 mr-2" />
                          Disable
                        </Button>
                        {user.consentStatus === "ACTIVE" && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              setRevokeDialog({
                                open: true,
                                userId: user.id,
                                userName: `${user.firstName} ${user.lastName}`,
                              })
                            }
                            disabled={actionLoading === user.id}
                          >
                            <ShieldOff className="h-4 w-4 mr-2" />
                            Revoke
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <p className="text-sm text-muted-foreground">
              Showing {filteredUsers.length} of {pagination.total} employees
            </p>
          </div>
        )}
      </CardContent>

      <Dialog open={revokeDialog.open} onOpenChange={(open) => !open && setRevokeDialog({ open: false, userId: "", userName: "" })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Monitoring Consent</DialogTitle>
            <DialogDescription>
              This will immediately stop all monitoring for {revokeDialog.userName}. The employee will need to
              re-consent if monitoring is enabled again.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">Reason for revocation (optional)</label>
            <Textarea
              placeholder="Enter reason..."
              value={revokeReason}
              onChange={(e) => setRevokeReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeDialog({ open: false, userId: "", userName: "" })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevokeConsent} disabled={actionLoading === revokeDialog.userId}>
              Revoke Consent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
