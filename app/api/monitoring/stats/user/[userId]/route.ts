import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/monitoring/stats/user/[userId] - Get user-specific monitoring statistics
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId } = await params;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        department: true,
        jobTitle: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get user's sessions
    const sessions = await prisma.desktopSession.findMany({
      where: { userId },
      select: { id: true },
    });
    const sessionIds = sessions.map((s) => s.id);

    // Get statistics in parallel
    const [
      currentSession,
      totalScreenshots,
      todayScreenshots,
      weeklyScreenshots,
      totalActivities,
      todayActivities,
      topApps,
      dailyStats,
      recentScreenshots,
    ] = await Promise.all([
      // Current active session
      prisma.desktopSession.findFirst({
        where: { userId, status: { in: ["ONLINE", "IDLE"] } },
        orderBy: { lastActive: "desc" },
      }),

      // Total screenshots
      prisma.screenshot.count({
        where: { sessionId: { in: sessionIds } },
      }),

      // Today's screenshots
      prisma.screenshot.count({
        where: {
          sessionId: { in: sessionIds },
          capturedAt: { gte: todayStart },
        },
      }),

      // Weekly screenshots
      prisma.screenshot.count({
        where: {
          sessionId: { in: sessionIds },
          capturedAt: { gte: weekAgo },
        },
      }),

      // Total activities
      prisma.activityLog.count({
        where: { sessionId: { in: sessionIds } },
      }),

      // Today's activities
      prisma.activityLog.count({
        where: {
          sessionId: { in: sessionIds },
          createdAt: { gte: todayStart },
        },
      }),

      // Top apps for this user (last 30 days)
      prisma.activityLog.groupBy({
        by: ["appName"],
        where: {
          sessionId: { in: sessionIds },
          appName: { not: null },
          createdAt: { gte: monthAgo },
        },
        _count: { appName: true },
        _sum: { duration: true },
        orderBy: { _count: { appName: "desc" } },
        take: 10,
      }),

      // Daily activity for last 7 days
      prisma.$queryRaw`
        SELECT
          DATE(createdAt) as date,
          COUNT(*) as activityCount
        FROM ActivityLog
        WHERE sessionId IN (${sessionIds.join(",") || "''"})
        AND createdAt >= ${weekAgo.toISOString()}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `.catch(() => []),

      // Recent screenshots
      prisma.screenshot.findMany({
        where: { sessionId: { in: sessionIds } },
        take: 12,
        orderBy: { capturedAt: "desc" },
      }),
    ]);

    // Calculate activity hours from app_switch events
    const appSwitches = await prisma.activityLog.findMany({
      where: {
        sessionId: { in: sessionIds },
        activityType: "app_switch",
        createdAt: { gte: todayStart },
      },
    });

    const totalActiveSeconds = appSwitches.reduce(
      (sum, activity) => sum + (activity.duration || 0),
      0
    );

    return NextResponse.json({
      user,
      currentSession,
      stats: {
        totalScreenshots,
        todayScreenshots,
        weeklyScreenshots,
        totalActivities,
        todayActivities,
        activeMinutesToday: Math.round(totalActiveSeconds / 60),
      },
      topApps: topApps.map((app) => ({
        name: app.appName,
        count: app._count.appName,
        totalDuration: app._sum.duration || 0,
      })),
      dailyActivity: dailyStats,
      recentScreenshots,
    });
  } catch (error) {
    console.error("Error fetching user monitoring stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
