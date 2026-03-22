import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/monitoring/reports/daily - Get daily activity report
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const dateStr = searchParams.get("date"); // YYYY-MM-DD format

    // Parse date or use today
    const targetDate = dateStr ? new Date(dateStr) : new Date();
    const dayStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate());
    const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);

    // Build where clause
    const sessionWhere: any = {
      startedAt: { lt: dayEnd },
      OR: [
        { endedAt: null },
        { endedAt: { gte: dayStart } }
      ]
    };

    if (userId) {
      sessionWhere.userId = userId;
    }

    // Get sessions for the day
    const sessions = await prisma.desktopSession.findMany({
      where: sessionWhere,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatar: true,
            department: true,
            jobTitle: true,
          },
        },
      },
    });

    const sessionIds = sessions.map(s => s.id);

    // Get activity logs for these sessions on this day
    const activities = await prisma.activityLog.findMany({
      where: {
        sessionId: { in: sessionIds },
        createdAt: { gte: dayStart, lt: dayEnd },
      },
      orderBy: { createdAt: "asc" },
    });

    // Get screenshots count for the day
    const screenshotCounts = await prisma.screenshot.groupBy({
      by: ["sessionId"],
      where: {
        sessionId: { in: sessionIds },
        capturedAt: { gte: dayStart, lt: dayEnd },
      },
      _count: true,
    });

    // Process data per user
    const userReports: Record<string, any> = {};

    for (const sess of sessions) {
      const uid = sess.userId;

      if (!userReports[uid]) {
        userReports[uid] = {
          user: sess.user,
          date: dayStart.toISOString().split("T")[0],
          totalActiveSeconds: 0,
          totalIdleSeconds: 0,
          screenshotCount: 0,
          applications: {} as Record<string, { count: number; duration: number; category: string }>,
          websites: {} as Record<string, { count: number; duration: number }>,
          timeline: [] as { time: string; app: string; duration: number }[],
          firstActivity: null as string | null,
          lastActivity: null as string | null,
        };
      }

      // Add screenshot count
      const ssCount = screenshotCounts.find(s => s.sessionId === sess.id);
      if (ssCount) {
        userReports[uid].screenshotCount += ssCount._count;
      }
    }

    // Process activities
    let currentIdleStart: Record<string, Date> = {};

    for (const activity of activities) {
      const sess = sessions.find(s => s.id === activity.sessionId);
      if (!sess) continue;

      const uid = sess.userId;
      const report = userReports[uid];

      // Track first/last activity
      const activityTime = activity.createdAt.toISOString();
      if (!report.firstActivity || activityTime < report.firstActivity) {
        report.firstActivity = activityTime;
      }
      if (!report.lastActivity || activityTime > report.lastActivity) {
        report.lastActivity = activityTime;
      }

      // Handle idle tracking
      if (activity.activityType === "idle_start") {
        currentIdleStart[uid] = activity.createdAt;
      } else if (activity.activityType === "idle_end" && currentIdleStart[uid]) {
        const idleSeconds = Math.floor(
          (activity.createdAt.getTime() - currentIdleStart[uid].getTime()) / 1000
        );
        report.totalIdleSeconds += idleSeconds;
        delete currentIdleStart[uid];
      }

      // Handle app switches
      if (activity.activityType === "app_switch" && activity.appName) {
        const appName = activity.appName;
        const duration = activity.duration || 0;

        if (!report.applications[appName]) {
          report.applications[appName] = {
            count: 0,
            duration: 0,
            category: categorizeApp(appName),
          };
        }
        report.applications[appName].count += 1;
        report.applications[appName].duration += duration;
        report.totalActiveSeconds += duration;

        // Track timeline
        report.timeline.push({
          time: activity.createdAt.toISOString(),
          app: appName,
          duration,
        });

        // Check if it's a browser and extract website from window title
        if (isBrowser(appName) && activity.windowTitle) {
          const website = extractWebsite(activity.windowTitle);
          if (website) {
            if (!report.websites[website]) {
              report.websites[website] = { count: 0, duration: 0 };
            }
            report.websites[website].count += 1;
            report.websites[website].duration += duration;
          }
        }
      }
    }

    // Convert to array and sort
    const reports = Object.values(userReports).map((report: any) => {
      // Convert applications object to sorted array
      const appList = Object.entries(report.applications)
        .map(([name, data]: [string, any]) => ({
          name,
          ...data,
        }))
        .sort((a, b) => b.duration - a.duration);

      // Convert websites object to sorted array
      const websiteList = Object.entries(report.websites)
        .map(([name, data]: [string, any]) => ({
          name,
          ...data,
        }))
        .sort((a, b) => b.duration - a.duration);

      // Calculate productivity score (simple heuristic)
      const productiveApps = appList.filter(a =>
        ["productive", "development"].includes(a.category)
      );
      const productiveTime = productiveApps.reduce((sum, a) => sum + a.duration, 0);
      const totalTime = report.totalActiveSeconds + report.totalIdleSeconds;
      const productivityScore = totalTime > 0
        ? Math.round((productiveTime / totalTime) * 100)
        : 0;

      return {
        ...report,
        applications: appList,
        websites: websiteList.slice(0, 20), // Top 20 websites
        productivityScore,
        totalActiveMinutes: Math.round(report.totalActiveSeconds / 60),
        totalIdleMinutes: Math.round(report.totalIdleSeconds / 60),
      };
    });

    // Sort by user name
    reports.sort((a, b) =>
      `${a.user.firstName} ${a.user.lastName}`.localeCompare(
        `${b.user.firstName} ${b.user.lastName}`
      )
    );

    return NextResponse.json({
      date: dayStart.toISOString().split("T")[0],
      reports,
      summary: {
        totalUsers: reports.length,
        totalActiveMinutes: reports.reduce((sum, r) => sum + r.totalActiveMinutes, 0),
        totalIdleMinutes: reports.reduce((sum, r) => sum + r.totalIdleMinutes, 0),
        averageProductivity: reports.length > 0
          ? Math.round(reports.reduce((sum, r) => sum + r.productivityScore, 0) / reports.length)
          : 0,
      },
    });
  } catch (error) {
    console.error("Error generating daily report:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to categorize apps
function categorizeApp(appName: string): string {
  const lowerName = appName.toLowerCase();

  // Development tools
  if (/code|studio|intellij|webstorm|pycharm|vim|sublime|atom|terminal|iterm|cmd|powershell|git/i.test(lowerName)) {
    return "development";
  }

  // Productivity
  if (/word|excel|powerpoint|sheets|docs|notion|slack|teams|zoom|meet|outlook|mail|calendar/i.test(lowerName)) {
    return "productive";
  }

  // Browsers
  if (/chrome|firefox|safari|edge|brave|opera/i.test(lowerName)) {
    return "browser";
  }

  // Entertainment/Social
  if (/spotify|music|netflix|youtube|twitter|facebook|instagram|tiktok|discord|game/i.test(lowerName)) {
    return "entertainment";
  }

  // System
  if (/finder|explorer|system|settings|preferences/i.test(lowerName)) {
    return "system";
  }

  return "other";
}

// Check if app is a browser
function isBrowser(appName: string): boolean {
  return /chrome|firefox|safari|edge|brave|opera/i.test(appName.toLowerCase());
}

// Extract website from browser window title
function extractWebsite(windowTitle: string): string | null {
  // Common patterns: "Page Title - Website Name - Browser" or "Page Title | Website"
  const parts = windowTitle.split(/[-–|]/);

  if (parts.length >= 2) {
    // Try to find a domain-like pattern
    for (const part of parts) {
      const trimmed = part.trim();
      if (/\.(com|org|net|io|ai|dev|app|co)$/i.test(trimmed)) {
        return trimmed;
      }
      // Common website names
      if (/google|youtube|github|stackoverflow|linkedin|twitter|facebook|reddit|notion|slack|figma|vercel|aws/i.test(trimmed)) {
        return trimmed;
      }
    }
    // Return last meaningful part (often the website name)
    const lastPart = parts[parts.length - 1].trim();
    if (lastPart.length > 2 && lastPart.length < 50) {
      // Remove browser name if present
      return lastPart.replace(/\s*(Chrome|Firefox|Safari|Edge|Brave)$/i, "").trim() || null;
    }
  }

  return null;
}
