"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  Clock,
  Copy,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Invitation {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  createdAt: string;
  inviteLink?: string;
}

interface InvitedMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  requiresPasswordChange: boolean;
  tempPassword?: string;
  createdAt: string;
}

export function TeamSettings() {
  const { data: session } = useSession();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [recentInvites, setRecentInvites] = useState<InvitedMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteInviteId, setDeleteInviteId] = useState<string | null>(null);

  // Form state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteFirstName, setInviteFirstName] = useState("");
  const [inviteLastName, setInviteLastName] = useState("");
  const [inviteRole, setInviteRole] = useState("MEMBER");
  const [inviteDepartment, setInviteDepartment] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  // Result state
  const [inviteResult, setInviteResult] = useState<{
    email: string;
    tempPassword: string;
  } | null>(null);

  const userRole = (session?.user as any)?.role;
  const canInvite = ["OWNER", "ADMIN", "MANAGER"].includes(userRole);

  // Fetch pending invitations
  useEffect(() => {
    if (canInvite) {
      fetchInvitations();
    }
  }, [canInvite]);

  const fetchInvitations = async () => {
    try {
      const response = await fetch("/api/organizations/invitations");
      if (response.ok) {
        const data = await response.json();
        setInvitations(data.invitations || []);
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
    }
  };

  const handleInviteMember = async () => {
    if (!inviteEmail || !inviteFirstName || !inviteLastName) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsInviting(true);
    try {
      const response = await fetch("/api/organizations/members/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail,
          firstName: inviteFirstName,
          lastName: inviteLastName,
          role: inviteRole,
          department: inviteDepartment || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to invite member");
      }

      // Show result with temp password
      setInviteResult({
        email: data.user.email,
        tempPassword: data.tempPassword,
      });

      toast.success("Team member invited successfully", {
        description: `An email with login credentials has been sent to ${inviteEmail}`,
      });

      // Reset form
      setInviteEmail("");
      setInviteFirstName("");
      setInviteLastName("");
      setInviteRole("MEMBER");
      setInviteDepartment("");
    } catch (error: any) {
      toast.error("Failed to invite member", {
        description: error.message || "Please try again later",
      });
    } finally {
      setIsInviting(false);
    }
  };

  const handleDeleteInvitation = async (id: string) => {
    try {
      const response = await fetch(`/api/organizations/invitations?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setInvitations((prev) => prev.filter((inv) => inv.id !== id));
        toast.success("Invitation cancelled");
      }
    } catch (error) {
      toast.error("Failed to cancel invitation");
    }
    setDeleteInviteId(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const closeInviteDialog = () => {
    setIsInviteDialogOpen(false);
    setInviteResult(null);
    setInviteEmail("");
    setInviteFirstName("");
    setInviteLastName("");
    setInviteRole("MEMBER");
    setInviteDepartment("");
  };

  if (!canInvite) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>
            You don&apos;t have permission to manage team members.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Invite Team Members */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-semibold">
                Invite Team Members
              </CardTitle>
            </div>
            <Button onClick={() => setIsInviteDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Invite Member
            </Button>
          </div>
          <CardDescription>
            Invite new members to your organization. They will receive a temporary
            password and be prompted to change it on first login.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {invitations.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">
                        {invitation.email}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{invitation.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className="bg-yellow-100 text-yellow-700"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(invitation.expiresAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteInviteId(invitation.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending invitations</p>
              <p className="text-sm">
                Click &quot;Invite Member&quot; to add new team members
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={closeInviteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Invite Team Member
            </DialogTitle>
            <DialogDescription>
              Enter the details for the new team member. They will receive a
              temporary password to log in.
            </DialogDescription>
          </DialogHeader>

          {inviteResult ? (
            // Success state - show credentials
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-lg">Invitation Sent!</h3>
                <p className="text-sm text-muted-foreground">
                  Share these credentials with the new team member
                </p>
              </div>

              <div className="space-y-3 p-4 bg-muted rounded-lg">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Email</Label>
                  <div className="flex items-center gap-2">
                    <Input value={inviteResult.email} readOnly className="font-mono" />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(inviteResult.email)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Temporary Password
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={inviteResult.tempPassword}
                      readOnly
                      className="font-mono"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard(inviteResult.tempPassword)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                The user will be required to change their password on first login.
              </p>

              <DialogFooter>
                <Button onClick={closeInviteDialog} className="w-full">
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            // Form state
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={inviteFirstName}
                    onChange={(e) => setInviteFirstName(e.target.value)}
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={inviteLastName}
                    onChange={(e) => setInviteLastName(e.target.value)}
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="john.doe@company.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select value={inviteRole} onValueChange={setInviteRole}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="VIEWER">Viewer</SelectItem>
                      <SelectItem value="MEMBER">Member</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      {userRole === "OWNER" && (
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={inviteDepartment}
                    onChange={(e) => setInviteDepartment(e.target.value)}
                    placeholder="Engineering"
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button variant="outline" onClick={closeInviteDialog}>
                  Cancel
                </Button>
                <Button onClick={handleInviteMember} disabled={isInviting}>
                  {isInviting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inviting...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Invitation
                    </>
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteInviteId}
        onOpenChange={() => setDeleteInviteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Invitation</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this invitation? The invite link
              will no longer work.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Invitation</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteInviteId && handleDeleteInvitation(deleteInviteId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
