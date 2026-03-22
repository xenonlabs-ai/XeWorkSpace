import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/teams - List all teams
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Filter by organization for multi-tenancy
    const where: any = {};
    if (session.user.organizationId) {
      where.organizationId = session.user.organizationId;
    }

    const teams = await prisma.team.findMany({
      where,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                jobTitle: true,
              },
            },
          },
        },
        _count: {
          select: {
            projects: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/teams - Create new team
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, memberIds } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Team name is required" },
        { status: 400 }
      );
    }

    if (!session.user.organizationId) {
      return NextResponse.json(
        { error: "You must be part of an organization to create teams" },
        { status: 403 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name,
        description,
        organization: {
          connect: { id: session.user.organizationId },
        },
        members: memberIds
          ? {
              create: memberIds.map((userId: string) => ({
                userId,
                role: "member",
              })),
            }
          : undefined,
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (error) {
    console.error("Error creating team:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
