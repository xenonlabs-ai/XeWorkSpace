import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/monitoring/consent/me - Get current user's consent status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    const consent = await prisma.monitoringConsent.findUnique({
      where: { userId },
    });

    // Determine status
    let status: "NOT_ENABLED" | "PENDING_EMPLOYEE" | "ACTIVE" | "REVOKED" = "NOT_ENABLED";

    if (consent) {
      if (consent.revokedAt) {
        status = "REVOKED";
      } else if (consent.adminEnabled && consent.employeeConsented) {
        status = "ACTIVE";
      } else if (consent.adminEnabled && !consent.employeeConsented) {
        status = "PENDING_EMPLOYEE";
      }
    }

    return NextResponse.json({
      status,
      consent: consent ? {
        adminEnabled: consent.adminEnabled,
        adminEnabledAt: consent.adminEnabledAt,
        employeeConsented: consent.employeeConsented,
        employeeConsentedAt: consent.employeeConsentedAt,
        consentVersion: consent.consentVersion,
        revokedAt: consent.revokedAt,
        revokedBy: consent.revokedBy,
        revocationReason: consent.revocationReason,
      } : null,
    });
  } catch (error) {
    console.error("Error fetching consent status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/monitoring/consent/me - Submit or revoke consent
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { action, accepted, consentVersion, reason } = body;

    // Get existing consent
    const existingConsent = await prisma.monitoringConsent.findUnique({
      where: { userId },
    });

    // Handle revoke action
    if (action === "revoke") {
      if (!existingConsent) {
        return NextResponse.json(
          { error: "No consent record found" },
          { status: 404 }
        );
      }

      await prisma.monitoringConsent.update({
        where: { userId },
        data: {
          revokedAt: new Date(),
          revokedBy: "EMPLOYEE",
          revocationReason: reason || "Employee revoked consent via web",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Consent revoked successfully",
      });
    }

    // Handle consent submission
    if (accepted !== undefined) {
      if (!existingConsent) {
        return NextResponse.json(
          { error: "Monitoring has not been enabled by your administrator" },
          { status: 400 }
        );
      }

      if (!existingConsent.adminEnabled) {
        return NextResponse.json(
          { error: "Monitoring has not been enabled by your administrator" },
          { status: 400 }
        );
      }

      if (existingConsent.revokedAt) {
        return NextResponse.json(
          { error: "Consent was previously revoked. Please contact your administrator." },
          { status: 400 }
        );
      }

      if (!accepted) {
        // Employee declined - we could track this
        return NextResponse.json({
          success: true,
          message: "Consent declined. Monitoring will not be enabled.",
        });
      }

      // Get client IP
      const forwardedFor = request.headers.get("x-forwarded-for");
      const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

      // Update consent
      await prisma.monitoringConsent.update({
        where: { userId },
        data: {
          employeeConsented: true,
          employeeConsentedAt: new Date(),
          employeeConsentIp: clientIp,
          consentVersion: consentVersion || "1.0",
          // Clear any previous revocation
          revokedAt: null,
          revokedBy: null,
          revocationReason: null,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Consent submitted successfully. Monitoring is now active.",
      });
    }

    return NextResponse.json(
      { error: "Invalid request. Provide 'accepted' or 'action'" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error processing consent:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
