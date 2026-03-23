import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";

// Generate a 6-character alphanumeric setup code
function generateSetupCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed confusing chars like 0,O,1,I
  let code = "";
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

// POST /api/monitoring/agent/setup - Agent uses setup code to get configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { setupCode, deviceId } = body;

    if (!setupCode) {
      return NextResponse.json(
        { error: "Setup code is required" },
        { status: 400 }
      );
    }

    // Find consent with this setup code
    const consent = await prisma.monitoringConsent.findUnique({
      where: { setupCode: setupCode.toUpperCase() },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            organizationId: true,
          },
        },
      },
    });

    if (!consent) {
      return NextResponse.json(
        { error: "Invalid setup code" },
        { status: 404 }
      );
    }

    // Check if setup code has expired
    if (consent.setupCodeExpiresAt && consent.setupCodeExpiresAt < new Date()) {
      return NextResponse.json(
        { error: "Setup code has expired. Please generate a new one from the web portal." },
        { status: 410 }
      );
    }

    // Check if consent is valid
    if (!consent.adminEnabled) {
      return NextResponse.json(
        { error: "Monitoring has not been enabled by your administrator" },
        { status: 403 }
      );
    }

    if (!consent.employeeConsented) {
      return NextResponse.json(
        { error: "You must accept the monitoring consent on the web portal first" },
        { status: 403 }
      );
    }

    if (consent.revokedAt) {
      return NextResponse.json(
        { error: "Monitoring consent has been revoked" },
        { status: 403 }
      );
    }

    // Generate an agent token for this device
    const token = randomBytes(32).toString("hex");
    const agentDeviceId = deviceId || `device-${randomBytes(8).toString("hex")}`;

    // Create or update agent token
    const agentToken = await prisma.agentToken.upsert({
      where: {
        userId_deviceId: {
          userId: consent.userId,
          deviceId: agentDeviceId,
        },
      },
      update: {
        token,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      create: {
        userId: consent.userId,
        token,
        deviceId: agentDeviceId,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Clear the setup code after successful use (one-time use)
    await prisma.monitoringConsent.update({
      where: { id: consent.id },
      data: {
        setupCode: null,
        setupCodeExpiresAt: null,
        employeeDeviceId: agentDeviceId,
      },
    });

    // Return configuration for the agent
    return NextResponse.json({
      success: true,
      config: {
        token: agentToken.token,
        userId: consent.user.id,
        email: consent.user.email,
        deviceId: agentDeviceId,
        user: {
          firstName: consent.user.firstName,
          lastName: consent.user.lastName,
        },
      },
      message: "Agent configured successfully. Monitoring will start automatically.",
    });
  } catch (error) {
    console.error("Error processing setup code:", error);
    return NextResponse.json(
      { error: "Failed to process setup code" },
      { status: 500 }
    );
  }
}

// GET /api/monitoring/agent/setup/generate - Generate a new setup code (requires auth)
export async function GET(request: NextRequest) {
  try {
    // Get agent token from header
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);

    // Validate token
    const agentToken = await prisma.agentToken.findUnique({
      where: { token },
    });

    if (!agentToken || !agentToken.isActive) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Generate new setup code
    const setupCode = generateSetupCode();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.monitoringConsent.update({
      where: { userId: agentToken.userId },
      data: {
        setupCode,
        setupCodeExpiresAt: expiresAt,
      },
    });

    return NextResponse.json({
      setupCode,
      expiresAt,
    });
  } catch (error) {
    console.error("Error generating setup code:", error);
    return NextResponse.json(
      { error: "Failed to generate setup code" },
      { status: 500 }
    );
  }
}
