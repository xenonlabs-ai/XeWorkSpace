"use client"

import type { Member } from "@/components/members"
import { getMemberById } from "@/components/members/member-data"
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
    // Simulate fetching member data
    const fetchMember = async () => {
      setLoading(true)
      setError(null)
      try {
        // In a real app, this would be an API call
        const id = Number.parseInt(memberId)
        if (isNaN(id)) {
             throw new Error("Invalid member ID")
        }
        const memberData = getMemberById(id)
        setMember(memberData)
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
