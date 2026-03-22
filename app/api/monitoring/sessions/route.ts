import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper to validate agent token
async function validateAgentToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const agentToken = await prisma.agentToken.findUnique({
    where: { token, isActive: true },
    include: { user: { select: { id: true, firstName: true, lastName: true } } },
  });

  if (!agentToken || (agentToken.expiresAt && agentToken.expiresAt < new Date())) {
    return null;
  }

  return agentToken;
}

// GET /api/monitoring/sessions - List active sessions (Admin/Manager only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const userId = searchParams.get("userId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const [sessions, total] = await Promise.all([
      prisma.desktopSession.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              department: true,
              jobTitle: true,
              email: true,
            },
          },
          _count: {
            select: { screenshots: true, activityLogs: true },
          },
        },
        orderBy: { lastActive: "desc" },
      }),
      prisma.desktopSession.count({ where }),
    ]);

    return NextResponse.json({
      sessions,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/monitoring/sessions - Create or update session (Agent)
export async function POST(request: NextRequest) {
  try {
    const agentToken = await validateAgentToken(request);
    if (!agentToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { deviceName, deviceId, ipAddress } = body;

    if (!deviceName || !deviceId) {
      return NextResponse.json(
        { error: "Missing required fields: deviceName, deviceId" },
        { status: 400 }
      );
    }

    // Upsert session by deviceId
    const desktopSession = await prisma.desktopSession.upsert({
      where: { deviceId },
      update: {
        status: "ONLINE",
        lastActive: new Date(),
        ipAddress,
        deviceName,
      },
      create: {
        userId: agentToken.userId,
        deviceName,
        deviceId,
        ipAddress,
        status: "ONLINE",
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(desktopSession, { status: 201 });
  } catch (error) {
    console.error("Error creating session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
