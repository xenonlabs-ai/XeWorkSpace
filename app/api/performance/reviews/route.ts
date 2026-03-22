import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/performance/reviews - List performance reviews
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");
    const reviewType = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");

    const where: any = {};

    // Non-admins/managers can only see their own reviews
    if (!["ADMIN", "MANAGER"].includes(session.user.role)) {
      where.employeeId = session.user.id;
    } else if (employeeId) {
      where.employeeId = employeeId;
    }

    if (status) where.status = status;
    if (reviewType) where.reviewType = reviewType;

    const [reviews, total] = await Promise.all([
      prisma.performanceReview.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          employee: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              jobTitle: true,
              department: true,
            },
          },
          reviewer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          goals: true,
          _count: {
            select: {
              feedbacks: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.performanceReview.count({ where }),
    ]);

    return NextResponse.json({
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/performance/reviews - Create new performance review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["ADMIN", "MANAGER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      employeeId,
      reviewPeriod,
      reviewType,
      scheduledDate,
      productivityRating,
      qualityRating,
      communicationRating,
      teamworkRating,
      initiativeRating,
      punctualityRating,
      technicalSkillsRating,
      strengths,
      areasForImprovement,
      managerComments,
      goalsForNextPeriod,
    } = body;

    if (!employeeId || !reviewPeriod) {
      return NextResponse.json(
        { error: "Employee ID and review period are required" },
        { status: 400 }
      );
    }

    // Calculate overall rating
    const ratings = [
      productivityRating,
      qualityRating,
      communicationRating,
      teamworkRating,
      initiativeRating,
      punctualityRating,
      technicalSkillsRating,
    ].filter((r) => r !== undefined && r !== null);

    const overallRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null;

    const review = await prisma.performanceReview.create({
      data: {
        employeeId,
        reviewerId: session.user.id,
        reviewPeriod,
        reviewType: reviewType || "QUARTERLY",
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
        status: "SELF_ASSESSMENT_PENDING",
        productivityRating,
        qualityRating,
        communicationRating,
        teamworkRating,
        initiativeRating,
        punctualityRating,
        technicalSkillsRating,
        overallRating,
        strengths,
        areasForImprovement,
        managerComments,
        goalsForNextPeriod,
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    // Create notification for employee
    await prisma.notification.create({
      data: {
        userId: employeeId,
        title: "New Performance Review",
        message: `A ${reviewType?.toLowerCase() || "quarterly"} performance review for ${reviewPeriod} has been initiated. Please complete your self-assessment.`,
        type: "review",
        actionUrl: `/performance/reviews/${review.id}`,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
