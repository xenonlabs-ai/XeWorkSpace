import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/organizations/members - Get organization members
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.organizationId) {
      return NextResponse.json({ members: [] });
    }

    const members = await prisma.user.findMany({
      where: { organizationId: user.organizationId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        role: true,
        status: true,
        department: true,
        jobTitle: true,
        joinedAt: true,
      },
      orderBy: { firstName: "asc" },
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Error fetching members:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/organizations/members - Update member role
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser?.organizationId) {
      return NextResponse.json({ error: "No organization" }, { status: 404 });
    }

    // Only OWNER or ADMIN can update roles
    if (!["OWNER", "ADMIN"].includes(currentUser.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: "userId and role are required" },
        { status: 400 }
      );
    }

    // Verify target user is in same org
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (targetUser?.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cannot change OWNER role unless you're the OWNER
    if (targetUser.role === "OWNER" && currentUser.role !== "OWNER") {
      return NextResponse.json(
        { error: "Cannot modify owner" },
        { status: 403 }
      );
    }

    // Cannot set someone as OWNER unless you're the OWNER
    if (role === "OWNER" && currentUser.role !== "OWNER") {
      return NextResponse.json(
        { error: "Only owner can transfer ownership" },
        { status: 403 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    return NextResponse.json({ member: updatedUser });
  } catch (error) {
    console.error("Error updating member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations/members - Remove member from organization
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!currentUser?.organizationId) {
      return NextResponse.json({ error: "No organization" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    // Only OWNER or ADMIN can remove members (or user removing themselves)
    if (!["OWNER", "ADMIN"].includes(currentUser.role) && userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (targetUser?.organizationId !== currentUser.organizationId) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Cannot remove the OWNER
    if (targetUser.role === "OWNER") {
      return NextResponse.json(
        { error: "Cannot remove organization owner" },
        { status: 403 }
      );
    }

    // Remove from organization
    await prisma.user.update({
      where: { id: userId },
      data: {
        organizationId: null,
        role: "MEMBER",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
