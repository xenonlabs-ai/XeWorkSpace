"use client"

import type { Member } from "@/components/members"
import { useEffect, useState } from "react"
import { MemberProfileHeader } from "./profile-header"
import { MemberProfileTabs } from "./profile-tabs"

interface MemberProfileContentProps {
	memberId: string
}

export function MemberProfileContent({ memberId }: MemberProfileContentProps) {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMember = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/organizations/members")
        if (!response.ok) {
          throw new Error("Failed to fetch members")
        }
        const data = await response.json()
        const foundMember = data.members?.find((m: any) => m.id === memberId)
        if (foundMember) {
          // Transform API response to Member type
          setMember({
            id: foundMember.id,
            name: `${foundMember.firstName || ""} ${foundMember.lastName || ""}`.trim() || foundMember.email,
            role: foundMember.jobTitle || foundMember.role || "Member",
            email: foundMember.email,
            accessLevel: foundMember.role || "Member",
            status: foundMember.status || "Active",
            avatar: foundMember.avatar || "",
            skills: [],
            projects: [],
            bio: "",
            phone: "",
            location: "",
            joinedDate: foundMember.joinedAt || "",
          })
        } else {
          setMember(null)
        }
      } catch (error) {
        console.error("Error fetching member:", error)
        setError("Failed to load member profile. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchMember()
  }, [memberId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-destructive/15 text-destructive px-4 py-3 rounded-md border border-destructive/20">
            <h3 className="font-semibold">Error</h3>
            <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h2 className="text-2xl font-bold">Member not found</h2>
        <p className="text-muted-foreground mt-2">The member you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <>
      <MemberProfileHeader member={member} />
      <MemberProfileTabs member={member} />
    </>
  )
}
