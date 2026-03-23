import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Helper to validate agent token
async function validateAgentToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.substring(7);
  const agentToken = await prisma.agentToken.findUnique({
    where: { token, isActive: true },
    include: { user: true },
  });

  if (!agentToken || (agentToken.expiresAt && agentToken.expiresAt < new Date())) {
    return null;
  }

  return agentToken;
}

// GET /api/monitoring/consent/[userId] - Get consent status for a user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    // Check if it's an agent request or admin request
    const agentToken = await validateAgentToken(request);
    const session = await getServerSession(authOptions);

    // Agent can only check their own user's consent
    if (agentToken) {
      if (agentToken.userId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    } else if (!session || !["OWNER", "ADMIN", "MANAGER"].includes(session.user.role)) {
      // Non-agents need admin/manager role
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const consent = await prisma.monitoringConsent.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!consent) {
      return NextResponse.json({
        userId,
        adminEnabled: false,
        employeeConsented: false,
        status: "NOT_ENABLED",
        canMonitor: false,
      });
    }

    const status = getConsentStatus(consent);

    return NextResponse.json({
      ...consent,
      status,
      canMonitor: status === "ACTIVE",
    });
  } catch (error) {
    console.error("Error fetching consent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/monitoring/consent/[userId] - Enable monitoring (Admin) or Give consent (Employee via Agent)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const body = await request.json();
    const { action } = body; // "enable", "disable", "consent", "revoke"

    // Check if it's an agent request or admin request
    const agentToken = await validateAgentToken(request);
    const session = await getServerSession(authOptions);

    if (action === "enable" || action === "disable") {
      // Admin actions
      if (!session || !["OWNER", "ADMIN", "MANAGER"].includes(session.user.role)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const consent = await prisma.monitoringConsent.upsert({
        where: { userId },
        update: {
          adminEnabled: action === "enable",
          adminEnabledBy: action === "enable" ? session.user.id : null,
          adminEnabledAt: action === "enable" ? new Date() : null,
          revokedAt: action === "disable" ? new Date() : null,
          revokedBy: action === "disable" ? "ADMIN" : null,
        },
        create: {
          userId,
          adminEnabled: action === "enable",
          adminEnabledBy: session.user.id,
          adminEnabledAt: new Date(),
        },
      });

      // Create notification for user
      if (action === "enable") {
        await prisma.notification.create({
          data: {
            userId,
            title: "Monitoring Enabled",
            message:
              "Your administrator has enabled desktop monitoring for your account. Please review and accept the terms in the desktop agent.",
            type: "system",
            actionUrl: "/monitoring/consent",
          },
        });
      }

      return NextResponse.json({
        ...consent,
        status: getConsentStatus(consent),
        message:
          action === "enable"
            ? "Monitoring enabled. Waiting for employee consent."
            : "Monitoring disabled.",
      });
    } else if (action === "consent" || action === "revoke") {
      // Employee actions via Agent
      if (!agentToken || agentToken.userId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Check if admin has enabled monitoring
      const existingConsent = await prisma.monitoringConsent.findUnique({
        where: { userId },
      });

      if (action === "consent") {
        if (!existingConsent?.adminEnabled) {
          return NextResponse.json(
            { error: "Monitoring has not been enabled by administrator" },
            { status: 400 }
          );
        }

        const consent = await prisma.monitoringConsent.update({
          where: { userId },
          data: {
            employeeConsented: true,
            employeeConsentedAt: new Date(),
            employeeConsentIp: body.ipAddress || null,
            employeeDeviceId: body.deviceId || agentToken.deviceId,
            consentVersion: body.consentVersion || "1.0",
            revokedAt: null,
            revokedBy: null,
            revocationReason: null,
          },
        });

        return NextResponse.json({
          ...consent,
          status: "ACTIVE",
          canMonitor: true,
          message: "Consent given. Monitoring is now active.",
        });
      } else if (action === "revoke") {
        const consent = await prisma.monitoringConsent.update({
          where: { userId },
          data: {
            employeeConsented: false,
            revokedAt: new Date(),
            revokedBy: "EMPLOYEE",
            revocationReason: body.reason || "Employee revoked consent",
          },
        });

        return NextResponse.json({
          ...consent,
          status: "REVOKED",
          canMonitor: false,
          message: "Consent revoked. Monitoring has been stopped.",
        });
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating consent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function getConsentStatus(consent: any): string {
  if (!consent) return "NOT_ENABLED";
  if (consent.revokedAt) return "REVOKED";
  if (consent.adminEnabled && consent.employeeConsented) return "ACTIVE";
  if (consent.adminEnabled && !consent.employeeConsented) return "PENDING_EMPLOYEE";
  return "NOT_ENABLED";
}
