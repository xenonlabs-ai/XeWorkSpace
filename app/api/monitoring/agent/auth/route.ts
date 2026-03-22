import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import bcrypt from "bcryptjs";

// POST /api/monitoring/agent/auth - Authenticate desktop agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, deviceId } = body;

    if (!email || !password || !deviceId) {
      return NextResponse.json(
        { error: "Missing required fields: email, password, deviceId" },
        { status: 400 }
      );
    }

    // Find user by email (include password for verification)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, firstName: true, lastName: true, role: true, password: true },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Check for existing active token for this device
    let agentToken = await prisma.agentToken.findFirst({
      where: {
        userId: user.id,
        deviceId,
        isActive: true,
      },
    });

    if (agentToken) {
      // Return existing token
      return NextResponse.json({
        token: agentToken.token,
        userId: user.id,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    }

    // Create new token
    const token = randomBytes(32).toString("hex");

    agentToken = await prisma.agentToken.create({
      data: {
        userId: user.id,
        token,
        deviceId,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    return NextResponse.json(
      {
        token: agentToken.token,
        userId: user.id,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error authenticating agent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
