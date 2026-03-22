import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { streamingStore } from "@/lib/streaming";

// Helper to validate agent token
async function validateAgentToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const agentToken = await prisma.agentToken.findUnique({
    where: { token, isActive: true },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true },
      },
    },
  });

  if (!agentToken || (agentToken.expiresAt && agentToken.expiresAt < new Date())) {
    return null;
  }

  return agentToken;
}

// GET /api/monitoring/stream - Get active streaming sessions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      // Get single frame
      const frame = streamingStore.getFrame(sessionId);
      return NextResponse.json({ frame });
    }

    // Get all active sessions
    const sessions = streamingStore.getActiveSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error fetching stream sessions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/monitoring/stream - Post a frame (Agent)
export async function POST(request: NextRequest) {
  try {
    const agentToken = await validateAgentToken(request);
    if (!agentToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sessionId, frame } = body;

    if (!sessionId || !frame) {
      return NextResponse.json(
        { error: "Missing sessionId or frame" },
        { status: 400 }
      );
    }

    // Verify session belongs to agent's user
    const desktopSession = await prisma.desktopSession.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    if (!desktopSession || desktopSession.userId !== agentToken.userId) {
      return NextResponse.json({ error: "Invalid session" }, { status: 403 });
    }

    // Update streaming store
    streamingStore.updateFrame(sessionId, frame, {
      userId: desktopSession.userId,
      deviceName: desktopSession.deviceName,
      userName: `${desktopSession.user.firstName} ${desktopSession.user.lastName}`,
    });

    // Update session status to STREAMING
    await prisma.desktopSession.update({
      where: { id: sessionId },
      data: { status: "STREAMING", lastActive: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error posting frame:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
