"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ChevronRight, Home, Mail, MessageSquare, MoreHorizontal, UserPlus, Calendar, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"

import type { Member } from "@/components/members"

interface MemberProfileHeaderProps {
	member: Member
}

export function MemberProfileHeader({ member }: MemberProfileHeaderProps) {
  const router = useRouter()
  const [isFollowing, setIsFollowing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const toggleFollow = () => {
    setIsFollowing(!isFollowing)
  }

  // Add this function to handle dialog opening
  const openDialog = (action: string) => {
    setIsDialogOpen(true)
  }

  return (
    <div className="mb-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-3 w-3 mr-1" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-3 w-3" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/members">Members</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-3 w-3" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink>{member.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Back button */}
      <Button variant="ghost" className="mb-4 pl-0 hover:bg-transparent" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Members
      </Button>

      {/* Profile header */}
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        <div className="relative">
          <Avatar className="h-24 w-24 border-4 border-primary/10">
            <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">{member.avatar}</AvatarFallback>
          </Avatar>
          <div
            className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-background ${member.status === "Active" ? "bg-green-500" : "bg-amber-500"}`}
          ></div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <h1 className="text-3xl font-bold">{member.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <Badge variant="outline">{member.role}</Badge>
              <Badge variant="secondary">{member.accessLevel}</Badge>
            </div>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">{member.bio}</p>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Joined {member.joinedDate}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{member.email}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4 md:mt-0">
          <Button variant="outline" className="gap-2" onClick={toggleFollow}>
            <UserPlus className="h-4 w-4" />
            {isFollowing ? "Following" : "Follow"}
          </Button>
          <Button className="gap-2" onClick={() => router.push(`/messages?user=${member.id}`)}>
            <MessageSquare className="h-4 w-4" />
            Message
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => openDialog("edit")}>Edit Profile</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openDialog("assign")}>Assign to Project</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openDialog("role")}>Change Role</DropdownMenuItem>
              <DropdownMenuItem onSelect={() => openDialog("remove")} className="text-destructive">
                Remove Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 p-4 bg-muted/40 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold">{member.projects.length}</div>
          <div className="text-sm text-muted-foreground">Projects</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">{member.skills.length}</div>
          <div className="text-sm text-muted-foreground">Skills</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">24</div>
          <div className="text-sm text-muted-foreground">Tasks</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold">92%</div>
          <div className="text-sm text-muted-foreground">Completion</div>
        </div>
      </div>

      {/* Add the dialog for member actions */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Member Actions</DialogTitle>
            <DialogDescription>Perform actions on {member.name}'s profile.</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p>You can manage this team member's profile, assignments, and permissions here.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsDialogOpen(false)}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
