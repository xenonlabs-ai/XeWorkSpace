import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/attendance/check-in - Quick check-in
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { workType, notes } = body;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if already checked in today
    const existing = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already checked in today", record: existing },
        { status: 409 }
      );
    }

    // Determine if late (after 9 AM)
    const now = new Date();
    const nineAM = new Date(today);
    nineAM.setHours(9, 0, 0, 0);
    const isLate = now > nineAM;

    const record = await prisma.attendance.create({
      data: {
        userId: session.user.id,
        date: today,
        checkIn: now,
        status: isLate ? "LATE" : "PRESENT",
        workType: workType || "OFFICE",
        notes,
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
      message: isLate ? "Checked in (Late)" : "Checked in successfully",
      record,
    });
  } catch (error) {
    console.error("Error checking in:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
