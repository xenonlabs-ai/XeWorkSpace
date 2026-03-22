"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { AddMemberDialog } from "./add-member-dialog";
import { MembersHeader } from "./header";
import { MemberCard } from "./member-card";
import { MemberDialog } from "./member-dialog";

import { Member } from "./member-data";
export type { Member };

export function MembersContent() {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const members: Member[] = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Developer",
      email: "alex@example.com",
      accessLevel: "Admin",
      status: "Active",
      avatar: "AJ",
      skills: ["React", "Node.js", "TypeScript"],
      projects: ["Website Redesign", "Mobile App"],
      bio: "Full-stack developer with 5 years of experience in building web applications.",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      joinedDate: "Jan 15, 2024",
    },
    {
      id: 2,
      name: "Samantha Lee",
      role: "Designer",
      email: "samantha@example.com",
      accessLevel: "Member",
      status: "Active",
      avatar: "SL",
      skills: ["UI/UX", "Figma", "Illustration"],
      projects: ["Brand Refresh", "Website Redesign"],
      bio: "Creative designer passionate about crafting beautiful and intuitive user experiences.",
      phone: "+1 (555) 234-5678",
      location: "New York, NY",
      joinedDate: "Mar 3, 2024",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Developer",
      email: "michael@example.com",
      accessLevel: "Member",
      status: "Away",
      avatar: "MC",
      skills: ["Python", "Django", "AWS"],
      projects: ["Backend API", "Data Pipeline"],
      bio: "Backend developer specializing in scalable systems and cloud infrastructure.",
      phone: "+1 (555) 345-6789",
      location: "Seattle, WA",
      joinedDate: "Feb 10, 2024",
    },
    {
      id: 4,
      name: "Emily Rodriguez",
      role: "Marketer",
      email: "emily@example.com",
      accessLevel: "Viewer",
      status: "Active",
      avatar: "ER",
      skills: ["Content Strategy", "SEO", "Social Media"],
      projects: ["Q2 Campaign", "Product Launch"],
      bio: "Digital marketer with expertise in growth strategies and content creation.",
      phone: "+1 (555) 456-7890",
      location: "Austin, TX",
      joinedDate: "Apr 5, 2024",
    },
    {
      id: 5,
      name: "David Kim",
      role: "Designer",
      email: "david@example.com",
      accessLevel: "Member",
      status: "Active",
      avatar: "DK",
      skills: ["Product Design", "Prototyping", "Animation"],
      projects: ["Mobile App", "Design System"],
      bio: "Product designer focused on creating seamless user experiences across platforms.",
      phone: "+1 (555) 567-8901",
      location: "Chicago, IL",
      joinedDate: "Jan 20, 2024",
    },
    {
      id: 6,
      name: "Jessica Taylor",
      role: "Marketer",
      email: "jessica@example.com",
      accessLevel: "Member",
      status: "Away",
      avatar: "JT",
      skills: ["Email Marketing", "Analytics", "Copywriting"],
      projects: ["Newsletter Redesign", "Customer Retention"],
      bio: "Marketing specialist with a data-driven approach to campaign optimization.",
      phone: "+1 (555) 678-9012",
      location: "Miami, FL",
      joinedDate: "Mar 15, 2024",
    },
    {
      id: 7,
      name: "Ryan Wilson",
      role: "Developer",
      email: "ryan@example.com",
      accessLevel: "Admin",
      status: "Active",
      avatar: "RW",
      skills: ["JavaScript", "React Native", "GraphQL"],
      projects: ["Mobile App", "API Integration"],
      bio: "Mobile developer passionate about creating smooth, native-like experiences.",
      phone: "+1 (555) 789-0123",
      location: "Denver, CO",
      joinedDate: "Feb 1, 2024",
    },
    {
      id: 8,
      name: "Olivia Martinez",
      role: "Designer",
      email: "olivia@example.com",
      accessLevel: "Viewer",
      status: "Active",
      avatar: "OM",
      skills: ["Brand Design", "Typography", "Illustration"],
      projects: ["Brand Refresh", "Marketing Materials"],
      bio: "Visual designer with a strong background in branding and identity design.",
      phone: "+1 (555) 890-1234",
      location: "Portland, OR",
      joinedDate: "Apr 10, 2024",
    },
    {
      id: 9,
      name: "James Brown",
      role: "Marketer",
      email: "james@example.com",
      accessLevel: "Member",
      status: "Away",
      avatar: "JB",
      skills: ["Content Marketing", "PPC", "Market Research"],
      projects: ["Q2 Campaign", "Competitor Analysis"],
      bio: "Strategic marketer specializing in digital advertising and market analysis.",
      phone: "+1 (555) 901-2345",
      location: "Boston, MA",
      joinedDate: "Mar 1, 2024",
    },
  ];

  const handleOpenMemberDialog = (member: Member) => {
    setSelectedMember(member);
    setIsDialogOpen(true);
  };

  const handleCloseMemberDialog = () => {
    setIsDialogOpen(false);
  };

  const renderMembers = (filterRole?: Member["role"]) => {
    const filtered = filterRole
      ? members.filter((m) => m.role === filterRole)
      : members;
    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onClick={() => handleOpenMemberDialog(member)}
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
      />
      <AddMemberDialog
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
      />
    </>
  );
}
