import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/monitoring/consent - List all consent statuses (Admin/Manager)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["OWNER", "ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // "enabled", "pending", "consented", "all"
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    // Get all users with their consent status
    const users = await prisma.user.findMany({
      where: {
        role: { in: ["MEMBER", "MANAGER"] }, // Only non-admin users
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        department: true,
        jobTitle: true,
        monitoringConsent: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { firstName: "asc" },
    });

    // Filter by status if provided
    let filteredUsers = users;
    if (status === "enabled") {
      filteredUsers = users.filter((u) => u.monitoringConsent?.adminEnabled);
    } else if (status === "pending") {
      filteredUsers = users.filter(
        (u) => u.monitoringConsent?.adminEnabled && !u.monitoringConsent?.employeeConsented
      );
    } else if (status === "consented") {
      filteredUsers = users.filter(
        (u) => u.monitoringConsent?.adminEnabled && u.monitoringConsent?.employeeConsented
      );
    }

    const total = await prisma.user.count({
      where: { role: { in: ["MEMBER", "MANAGER"] } },
    });

    return NextResponse.json({
      users: filteredUsers.map((user) => ({
        ...user,
        consentStatus: getConsentStatus(user.monitoringConsent),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching consent list:", error);
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
