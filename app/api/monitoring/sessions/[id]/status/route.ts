import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

// PATCH /api/monitoring/sessions/[id]/status - Update session status (Agent)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const agentToken = await validateAgentToken(request);
    if (!agentToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, lastActive } = body;

    // Verify session belongs to agent's user
    const session = await prisma.desktopSession.findUnique({
      where: { id },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    if (session.userId !== agentToken.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updateData: any = {
      lastActive: lastActive ? new Date(lastActive) : new Date(),
    };

    if (status && ["ONLINE", "OFFLINE", "IDLE", "STREAMING"].includes(status)) {
      updateData.status = status;
    }

    if (status === "OFFLINE") {
      updateData.endedAt = new Date();
    }

    const updatedSession = await prisma.desktopSession.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedSession);
  } catch (error) {
    console.error("Error updating session status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
