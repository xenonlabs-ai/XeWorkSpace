import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { screenshotStorage } from "@/lib/storage";

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

// GET /api/monitoring/screenshots - List screenshots (Admin/Manager only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    const userId = searchParams.get("userId");
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

    if (startDate || endDate) {
      where.capturedAt = {};
      if (startDate) where.capturedAt.gte = new Date(startDate);
      if (endDate) where.capturedAt.lte = new Date(endDate);
    }

    const [screenshots, total] = await Promise.all([
      prisma.screenshot.findMany({
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
        orderBy: { capturedAt: "desc" },
      }),
      prisma.screenshot.count({ where }),
    ]);

    return NextResponse.json({
      screenshots,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching screenshots:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/monitoring/screenshots - Upload screenshot (Agent)
export async function POST(request: NextRequest) {
  try {
    const agentToken = await validateAgentToken(request);
    if (!agentToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("screenshot") as File;
    const sessionId = formData.get("sessionId") as string;

    if (!file || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields: screenshot, sessionId" },
        { status: 400 }
      );
    }

    // Verify session belongs to agent's user and get organization
    const session = await prisma.desktopSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: { organizationId: true },
        },
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.userId !== agentToken.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get organization ID for storage partitioning
    const organizationId = session.user.organizationId || "default";

    // Upload to storage (S3 or local based on config)
    const timestamp = Date.now();
    const filename = `${sessionId}-${timestamp}.png`;
    const bytes = await file.arrayBuffer();
    const imageUrl = await screenshotStorage.upload(
      Buffer.from(bytes),
      filename,
      organizationId
    );

    // Create screenshot record
    const screenshot = await prisma.screenshot.create({
      data: {
        sessionId,
        imageUrl,
        thumbnailUrl: imageUrl, // Same for now, can generate thumbnails later
      },
    });

    // Update session lastActive
    await prisma.desktopSession.update({
      where: { id: sessionId },
      data: { lastActive: new Date(), status: "ONLINE" },
    });

    return NextResponse.json(screenshot, { status: 201 });
  } catch (error) {
    console.error("Error uploading screenshot:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
