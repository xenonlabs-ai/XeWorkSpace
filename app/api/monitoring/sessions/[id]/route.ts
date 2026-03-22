import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/monitoring/sessions/[id] - Get session details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const desktopSession = await prisma.desktopSession.findUnique({
      where: { id },
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
        screenshots: {
          orderBy: { capturedAt: "desc" },
          take: 20,
        },
        activityLogs: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
        _count: {
          select: { screenshots: true, activityLogs: true },
        },
      },
    });

    if (!desktopSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json(desktopSession);
  } catch (error) {
    console.error("Error fetching session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/monitoring/sessions/[id] - End session
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const desktopSession = await prisma.desktopSession.findUnique({
      where: { id },
    });

    if (!desktopSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    await prisma.desktopSession.update({
      where: { id },
      data: {
        status: "OFFLINE",
        endedAt: new Date(),
      },
    });

    return NextResponse.json({ message: "Session ended successfully" });
  } catch (error) {
    console.error("Error ending session:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
