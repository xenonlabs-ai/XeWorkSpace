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
  });

  if (!agentToken || (agentToken.expiresAt && agentToken.expiresAt < new Date())) {
    return null;
  }

  return agentToken;
}

// GET /api/monitoring/activity - List activity logs (Admin/Manager only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const userId = searchParams.get("userId");
    const activityType = searchParams.get("activityType");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};

    if (sessionId) {
      where.sessionId = sessionId;
    }

    if (userId) {
      where.session = { userId };
    }

    if (activityType) {
      where.activityType = activityType;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    const [activities, total] = await Promise.all([
      prisma.activityLog.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          session: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.activityLog.count({ where }),
    ]);

    return NextResponse.json({
      activities,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/monitoring/activity - Log activity (Agent) - supports batch
export async function POST(request: NextRequest) {
  try {
    const agentToken = await validateAgentToken(request);
    if (!agentToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Support both single activity and batch
    const activities = Array.isArray(body) ? body : [body];

    if (activities.length === 0) {
      return NextResponse.json(
        { error: "No activities provided" },
        { status: 400 }
      );
    }

    // Validate all activities have sessionId
    for (const activity of activities) {
      if (!activity.sessionId || !activity.activityType) {
        return NextResponse.json(
          { error: "Each activity must have sessionId and activityType" },
          { status: 400 }
        );
      }
    }

    // Verify first session belongs to agent's user (all should have same session)
    const sessionId = activities[0].sessionId;
    const session = await prisma.desktopSession.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.userId !== agentToken.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create all activity logs
    const createdActivities = await prisma.activityLog.createMany({
      data: activities.map((activity: any) => ({
        sessionId: activity.sessionId,
        activityType: activity.activityType,
        appName: activity.appName || null,
        windowTitle: activity.windowTitle || null,
        duration: activity.duration || null,
      })),
    });

    // Update session lastActive
    await prisma.desktopSession.update({
      where: { id: sessionId },
      data: { lastActive: new Date() },
    });

    return NextResponse.json(
      {
        message: "Activities logged successfully",
        count: createdActivities.count,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error logging activity:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
