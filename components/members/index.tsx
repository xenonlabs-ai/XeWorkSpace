"use client";

import { monitoringApi } from "@/lib/api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AddMemberDialog } from "./add-member-dialog";
import { MembersHeader } from "./header";
import { MemberCard } from "./member-card";
import { MemberDialog } from "./member-dialog";

import { Member } from "./member-data";
export type { Member };

export function MembersContent() {
  const { data: session } = useSession();
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current user is Admin or Owner
  const userRole = (session?.user as any)?.role;
  const isAdminOrOwner = userRole === "ADMIN" || userRole === "OWNER";

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setIsLoading(true);

        // Fetch users and consent data in parallel
        const [usersResponse, consentResponse] = await Promise.all([
          fetch("/api/users"),
          isAdminOrOwner ? fetch("/api/monitoring/consent") : Promise.resolve(null),
        ]);

        if (!usersResponse.ok) {
          throw new Error("Failed to fetch users");
        }

        const usersData = await usersResponse.json();
        const consentData = consentResponse && consentResponse.ok
          ? await consentResponse.json()
          : { users: [] };

        // Create a map of userId to monitoring status
        const consentMap = new Map<string, string>();
        consentData.users?.forEach((user: any) => {
          consentMap.set(user.id, user.consentStatus || "NOT_ENABLED");
        });

        // Transform API data to Member format
        const transformedMembers: Member[] = usersData.users.map((user: any) => ({
          id: user.id,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
          role: user.jobTitle || user.department || "Member",
          email: user.email,
          accessLevel: user.role === "OWNER"
            ? "Owner"
            : user.role === "ADMIN"
            ? "Admin"
            : user.role === "MANAGER"
            ? "Manager"
            : user.role === "VIEWER"
            ? "Viewer"
            : "Member",
          status: user.status === "ACTIVE"
            ? "Active"
            : user.status === "AWAY"
            ? "Away"
            : user.status === "OFFLINE"
            ? "Offline"
            : "Active",
          avatar: user.avatar || `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`,
          skills: user.skills || [],
          projects: [],
          bio: "",
          phone: user.phone || "",
          location: user.location || "",
          joinedDate: user.joinedAt
            ? new Date(user.joinedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
              })
            : "",
          monitoringStatus: (consentMap.get(user.id) || "NOT_ENABLED") as Member["monitoringStatus"],
        }));

        setMembers(transformedMembers);
      } catch (error) {
        console.error("Error fetching members:", error);
        toast.error("Failed to load members");
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchMembers();
    }
  }, [session, isAdminOrOwner]);

  const handleOpenMemberDialog = (member: Member) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleCloseMemberDialog = () => {
    setIsDialogOpen(false);
  };

  const handleToggleMonitoring = async (memberId: string | number) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const isCurrentlyEnabled =
      member.monitoringStatus === "ACTIVE" ||
      member.monitoringStatus === "PENDING_EMPLOYEE";

    try {
      if (isCurrentlyEnabled) {
        await monitoringApi.disableMonitoring(String(memberId));
        toast.success("Monitoring disabled", {
          description: `Monitoring has been disabled for ${member.name}.`,
        });
      } else {
        await monitoringApi.enableMonitoring(String(memberId));
        toast.success("Monitoring enabled", {
          description: `A consent request has been sent to ${member.name}.`,
        });
      }

      // Update local state
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? {
                ...m,
                monitoringStatus: isCurrentlyEnabled
                  ? ("NOT_ENABLED" as const)
                  : ("PENDING_EMPLOYEE" as const),
              }
            : m
        )
      );
    } catch (error) {
      toast.error("Failed to update monitoring", {
        description: "Please try again later.",
      });
    }
  };

  const handleDeleteMember = async (memberId: string | number) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    try {
      const response = await fetch(`/api/organizations/members?userId=${memberId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to remove member");
      }

      // Update local state
      setMembers((prev) => prev.filter((m) => m.id !== memberId));

      toast.success("Employee removed", {
        description: `${member.name} has been removed from the organization.`,
      });
    } catch (error: any) {
      toast.error("Failed to remove employee", {
        description: error.message || "Please try again later.",
      });
    }
  };

  const renderMembers = (filterRole?: Member["role"]) => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }

    const filtered = filterRole
      ? members.filter((m) => m.role === filterRole)
      : members;

    if (filtered.length === 0) {
      return (
        <div className="text-center py-12 text-muted-foreground">
          No members found
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onClick={() => handleOpenMemberDialog(member)}
            isAdminOrOwner={isAdminOrOwner}
            onToggleMonitoring={handleToggleMonitoring}
            onDeleteMember={handleDeleteMember}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <MembersHeader onAddMemberClick={() => setIsAddMemberOpen(true)} />

      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="flex flex-wrap bg-muted/40 dark:bg-muted/30 w-full h-auto gap-2 p-2 mb-4">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-background dark:data-[state=active]:bg-card dark:data-[state=active]:text-foreground dark:data-[state=active]:border dark:data-[state=active]:border-border dark:data-[state=active]:shadow-[0_1px_3px_rgba(0,0,0,0.3)] dark:data-[state=active]:font-semibold transition-all"
          >
            All Members
          </TabsTrigger>
          <TabsTrigger
            value="developer"
            className="data-[state=active]:bg-background dark:data-[state=active]:bg-card dark:data-[state=active]:text-foreground dark:data-[state=active]:border dark:data-[state=active]:border-border dark:data-[state=active]:shadow-[0_1px_3px_rgba(0,0,0,0.3)] dark:data-[state=active]:font-semibold transition-all"
          >
            Developers
          </TabsTrigger>
          <TabsTrigger
            value="designer"
            className="data-[state=active]:bg-background dark:data-[state=active]:bg-card dark:data-[state=active]:text-foreground dark:data-[state=active]:border dark:data-[state=active]:border-border dark:data-[state=active]:shadow-[0_1px_3px_rgba(0,0,0,0.3)] dark:data-[state=active]:font-semibold transition-all"
          >
            Designers
          </TabsTrigger>
          <TabsTrigger
            value="marketer"
            className="data-[state=active]:bg-background dark:data-[state=active]:bg-card dark:data-[state=active]:text-foreground dark:data-[state=active]:border dark:data-[state=active]:border-border dark:data-[state=active]:shadow-[0_1px_3px_rgba(0,0,0,0.3)] dark:data-[state=active]:font-semibold transition-all"
          >
            Marketers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">{renderMembers()}</TabsContent>
        <TabsContent value="developer">
          {renderMembers("Developer")}
        </TabsContent>
        <TabsContent value="designer">{renderMembers("Designer")}</TabsContent>
        <TabsContent value="marketer">{renderMembers("Marketer")}</TabsContent>
      </Tabs>

      <MemberDialog
        member={selectedMember}
        isOpen={isDialogOpen}
        onClose={handleCloseMemberDialog}
        isAdminOrOwner={isAdminOrOwner}
        onToggleMonitoring={handleToggleMonitoring}
        onDeleteMember={handleDeleteMember}
      />
      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
      />
    </>
  );
}
