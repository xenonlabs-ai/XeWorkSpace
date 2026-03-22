import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// POST /api/organizations/invitations/accept - Accept invitation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    // Find invitation
    const invitation = await prisma.orgInvitation.findUnique({
      where: { token },
      include: { organization: true },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid invitation" },
        { status: 404 }
      );
    }

    if (invitation.acceptedAt) {
      return NextResponse.json(
        { error: "Invitation already accepted" },
        { status: 400 }
      );
    }

    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { error: "Invitation expired" },
        { status: 400 }
      );
    }

    // Verify email matches
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (user?.email !== invitation.email) {
      return NextResponse.json(
        { error: "Invitation is for a different email" },
        { status: 403 }
      );
    }

    // Check if user is already in an organization
    if (user.organizationId) {
      return NextResponse.json(
        { error: "Already in an organization" },
        { status: 400 }
      );
    }

    // Accept invitation - add user to organization
    await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          organizationId: invitation.organizationId,
          role: invitation.role,
        },
      }),
      prisma.orgInvitation.update({
        where: { id: invitation.id },
        data: { acceptedAt: new Date() },
      }),
    ]);

    return NextResponse.json({
      success: true,
      organization: {
        id: invitation.organization.id,
        name: invitation.organization.name,
        slug: invitation.organization.slug,
      },
    });
  } catch (error) {
    console.error("Error accepting invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/organizations/invitations/accept?token=xxx - Get invitation details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token required" }, { status: 400 });
    }

    const invitation = await prisma.orgInvitation.findUnique({
      where: { token },
      include: {
        organization: {
          select: {
            name: true,
            logo: true,
          },
        },
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: "Invalid invitation" },
        { status: 404 }
      );
    }

    if (invitation.acceptedAt) {
      return NextResponse.json(
        { error: "Invitation already accepted", accepted: true },
        { status: 400 }
      );
    }

    if (new Date() > invitation.expiresAt) {
      return NextResponse.json(
        { error: "Invitation expired", expired: true },
        { status: 400 }
      );
    }

    return NextResponse.json({
      invitation: {
        email: invitation.email,
        role: invitation.role,
        organizationName: invitation.organization.name,
        organizationLogo: invitation.organization.logo,
        expiresAt: invitation.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error getting invitation:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
