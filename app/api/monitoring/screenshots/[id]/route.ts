import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { unlink } from "fs/promises";
import path from "path";

// GET /api/monitoring/screenshots/[id] - Get screenshot details
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

    const screenshot = await prisma.screenshot.findUnique({
      where: { id },
      include: {
        session: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatar: true,
                department: true,
                jobTitle: true,
              },
            },
          },
        },
      },
    });

    if (!screenshot) {
      return NextResponse.json(
        { error: "Screenshot not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(screenshot);
  } catch (error) {
    console.error("Error fetching screenshot:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/monitoring/screenshots/[id] - Delete screenshot
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const screenshot = await prisma.screenshot.findUnique({
      where: { id },
    });

    if (!screenshot) {
      return NextResponse.json(
        { error: "Screenshot not found" },
        { status: 404 }
      );
    }

    // Delete file from disk
    try {
      const filename = path.basename(screenshot.imageUrl);
      const filepath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "screenshots",
        filename
      );
      await unlink(filepath);
    } catch (e) {
      // File might not exist, continue with database deletion
      console.warn("Could not delete screenshot file:", e);
    }

    // Delete from database
    await prisma.screenshot.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Screenshot deleted successfully" });
  } catch (error) {
    console.error("Error deleting screenshot:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
