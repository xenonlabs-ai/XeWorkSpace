import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/monitoring/consent/employee - Employee submits consent from agent
export async function POST(request: NextRequest) {
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
      include: { user: true },
    });

    if (!agentToken || !agentToken.isActive) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { accepted, deviceId, consentVersion } = body;

    if (!accepted) {
      return NextResponse.json(
        { error: "Consent must be accepted" },
        { status: 400 }
      );
    }

    // Get client IP
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    // Check if monitoring is enabled by admin
    const existingConsent = await prisma.monitoringConsent.findUnique({
      where: { userId: agentToken.userId },
    });

    if (!existingConsent || !existingConsent.adminEnabled) {
      return NextResponse.json(
        { error: "Monitoring is not enabled for this user" },
        { status: 403 }
      );
    }

    if (existingConsent.revokedAt) {
      return NextResponse.json(
        { error: "Monitoring consent has been revoked" },
        { status: 403 }
      );
    }

    // Update consent with employee acceptance
    const consent = await prisma.monitoringConsent.update({
      where: { userId: agentToken.userId },
      data: {
        employeeConsented: true,
        employeeConsentedAt: new Date(),
        employeeConsentIp: ip,
        employeeDeviceId: deviceId || agentToken.deviceId,
        consentVersion: consentVersion || "1.0",
      },
    });

    return NextResponse.json({
      success: true,
      consent: {
        adminEnabled: consent.adminEnabled,
        employeeConsented: consent.employeeConsented,
        consentedAt: consent.employeeConsentedAt,
      },
    });
  } catch (error) {
    console.error("Error processing employee consent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/monitoring/consent/employee - Check consent status from agent
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
      include: { user: true },
    });

    if (!agentToken || !agentToken.isActive) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Get consent status
    const consent = await prisma.monitoringConsent.findUnique({
      where: { userId: agentToken.userId },
    });

    if (!consent) {
      return NextResponse.json({
        status: "NOT_ENABLED",
        adminEnabled: false,
        employeeConsented: false,
        canMonitor: false,
      });
    }

    if (consent.revokedAt) {
      return NextResponse.json({
        status: "REVOKED",
        adminEnabled: consent.adminEnabled,
        employeeConsented: consent.employeeConsented,
        revokedAt: consent.revokedAt,
        revokedBy: consent.revokedBy,
        canMonitor: false,
      });
    }

    if (consent.adminEnabled && consent.employeeConsented) {
      return NextResponse.json({
        status: "ACTIVE",
        adminEnabled: true,
        employeeConsented: true,
        consentedAt: consent.employeeConsentedAt,
        canMonitor: true,
      });
    }

    if (consent.adminEnabled && !consent.employeeConsented) {
      return NextResponse.json({
        status: "PENDING_EMPLOYEE",
        adminEnabled: true,
        employeeConsented: false,
        canMonitor: false,
        requiresConsent: true,
      });
    }

    return NextResponse.json({
      status: "NOT_ENABLED",
      adminEnabled: false,
      employeeConsented: false,
      canMonitor: false,
    });
  } catch (error) {
    console.error("Error checking consent status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
