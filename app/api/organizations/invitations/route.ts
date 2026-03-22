import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import crypto from "crypto";

// GET /api/organizations/invitations - Get pending invitations
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
      return NextResponse.json({ invitations: [] });
    }

    // Only OWNER, ADMIN, or MANAGER can view invitations
    if (!["OWNER", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const invitations = await prisma.orgInvitation.findMany({
      where: {
        organizationId: user.organizationId,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ invitations });
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/organizations/invitations - Send invitation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true },
    });

    if (!user?.organizationId || !user.organization) {
      return NextResponse.json({ error: "No organization" }, { status: 404 });
    }

    // Only OWNER, ADMIN, or MANAGER can invite
    if (!["OWNER", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { email, role = "MEMBER" } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists in organization
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        organizationId: user.organizationId,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already in organization" },
        { status: 400 }
      );
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.orgInvitation.findFirst({
      where: {
        organizationId: user.organizationId,
        email,
        acceptedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (existingInvitation) {
      return NextResponse.json(
        { error: "Invitation already sent" },
        { status: 400 }
      );
    }

    // Cannot invite with higher role than yourself
    const roleHierarchy = ["VIEWER", "MEMBER", "MANAGER", "ADMIN", "OWNER"];
    if (roleHierarchy.indexOf(role) > roleHierarchy.indexOf(user.role)) {
      return NextResponse.json(
        { error: "Cannot invite with higher role" },
        { status: 403 }
      );
    }

    // Create invitation
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const invitation = await prisma.orgInvitation.create({
      data: {
        organizationId: user.organizationId,
        email,
        role,
        token,
        expiresAt,
      },
    });

    // TODO: Send invitation email
    // For now, return the invitation link
    const inviteLink = `${process.env.NEXTAUTH_URL}/invite/${token}`;

    return NextResponse.json({
      invitation: {
        id: invitation.id,
        email: invitation.email,
        role: invitation.role,
        expiresAt: invitation.expiresAt,
        inviteLink,
      },
    });
  } catch (error) {
    console.error("Error creating invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/organizations/invitations - Cancel invitation
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.organizationId) {
      return NextResponse.json({ error: "No organization" }, { status: 404 });
    }

    if (!["OWNER", "ADMIN", "MANAGER"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get("id");

    if (!invitationId) {
      return NextResponse.json(
        { error: "Invitation ID required" },
        { status: 400 }
      );
    }

    await prisma.orgInvitation.deleteMany({
      where: {
        id: invitationId,
        organizationId: user.organizationId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
