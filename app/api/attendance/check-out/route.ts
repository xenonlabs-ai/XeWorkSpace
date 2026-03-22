import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/attendance/check-out - Quick check-out
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's attendance record
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "No check-in record found for today" },
        { status: 404 }
      );
    }

    if (existing.checkOut) {
      return NextResponse.json(
        { error: "Already checked out today", record: existing },
        { status: 409 }
      );
    }

    const now = new Date();
    const checkIn = existing.checkIn ? new Date(existing.checkIn) : null;
    const hoursWorked = checkIn
      ? (now.getTime() - checkIn.getTime()) / (1000 * 60 * 60)
      : null;

    const record = await prisma.attendance.update({
      where: { id: existing.id },
      data: {
        checkOut: now,
        hoursWorked: hoursWorked ? Math.round(hoursWorked * 100) / 100 : null,
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

    return NextResponse.json({
      message: "Checked out successfully",
      record,
    });
  } catch (error) {
    console.error("Error checking out:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
