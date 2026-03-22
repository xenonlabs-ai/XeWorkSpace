import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/monitoring/stats - Get overall monitoring statistics
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get various statistics in parallel
    const [
      totalSessions,
      onlineSessions,
      idleSessions,
      offlineSessions,
      todayScreenshots,
      todayActivities,
      weeklyScreenshots,
      weeklyActivities,
      topApps,
      recentSessions,
    ] = await Promise.all([
      // Total unique users with sessions
      prisma.desktopSession.groupBy({
        by: ["userId"],
        _count: true,
      }),

      // Online sessions
      prisma.desktopSession.count({
        where: { status: "ONLINE" },
      }),

      // Idle sessions
      prisma.desktopSession.count({
        where: { status: "IDLE" },
      }),

      // Offline sessions
      prisma.desktopSession.count({
        where: { status: "OFFLINE" },
      }),

      // Today's screenshots
      prisma.screenshot.count({
        where: { capturedAt: { gte: todayStart } },
      }),

      // Today's activities
      prisma.activityLog.count({
        where: { createdAt: { gte: todayStart } },
      }),

      // Weekly screenshots
      prisma.screenshot.count({
        where: { capturedAt: { gte: weekAgo } },
      }),

      // Weekly activities
      prisma.activityLog.count({
        where: { createdAt: { gte: weekAgo } },
      }),

      // Top apps (last 7 days)
      prisma.activityLog.groupBy({
        by: ["appName"],
        where: {
          appName: { not: null },
          createdAt: { gte: weekAgo },
        },
        _count: { appName: true },
        _sum: { duration: true },
        orderBy: { _count: { appName: "desc" } },
        take: 10,
      }),

      // Recent active sessions
      prisma.desktopSession.findMany({
        where: { status: { in: ["ONLINE", "IDLE"] } },
        take: 10,
        orderBy: { lastActive: "desc" },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              department: true,
            },
          },
        },
      }),
    ]);

    // Calculate idle time from activity logs
    const idleActivities = await prisma.activityLog.findMany({
      where: {
        activityType: { in: ["idle_start", "idle_end"] },
        createdAt: { gte: todayStart },
      },
      orderBy: { createdAt: "asc" },
    });

    // Calculate total idle time (simplified)
    let totalIdleSeconds = 0;
    let idleStart: Date | null = null;
    for (const activity of idleActivities) {
      if (activity.activityType === "idle_start") {
        idleStart = activity.createdAt;
      } else if (activity.activityType === "idle_end" && idleStart) {
        totalIdleSeconds += Math.floor(
          (activity.createdAt.getTime() - idleStart.getTime()) / 1000
        );
        idleStart = null;
      }
    }

    return NextResponse.json({
      overview: {
        totalUsers: totalSessions.length,
        onlineCount: onlineSessions,
        idleCount: idleSessions,
        offlineCount: offlineSessions,
      },
      today: {
        screenshots: todayScreenshots,
        activities: todayActivities,
        totalIdleMinutes: Math.round(totalIdleSeconds / 60),
      },
      weekly: {
        screenshots: weeklyScreenshots,
        activities: weeklyActivities,
      },
      topApps: topApps.map((app) => ({
        name: app.appName,
        count: app._count.appName,
        totalDuration: app._sum.duration || 0,
      })),
      recentSessions,
    });
  } catch (error) {
    console.error("Error fetching monitoring stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
