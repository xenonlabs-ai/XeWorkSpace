import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/performance/reviews/[id] - Get single review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const review = await prisma.performanceReview.findUnique({
      where: { id },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
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
        feedbacks: true,
      },
    });

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Check access - only employee, reviewer, or admin can view
    if (
      review.employeeId !== session.user.id &&
      review.reviewerId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/performance/reviews/[id] - Update review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existingReview = await prisma.performanceReview.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Determine what can be updated based on role
    const isEmployee = existingReview.employeeId === session.user.id;
    const isReviewer = existingReview.reviewerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isEmployee && !isReviewer && !isAdmin) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let updateData: any = {};

    // Employee can only update self-assessment
    if (isEmployee && !isReviewer && !isAdmin) {
      updateData = {
        employeeSelfAssessment: body.employeeSelfAssessment,
        status:
          body.employeeSelfAssessment && existingReview.status === "SELF_ASSESSMENT_PENDING"
            ? "MANAGER_REVIEW_PENDING"
            : existingReview.status,
      };
    } else {
      // Reviewer/Admin can update all fields
      const {
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
        status,
      } = body;

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
          : existingReview.overallRating;

      updateData = {
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
        status,
        submittedAt: status === "COMPLETED" ? new Date() : existingReview.submittedAt,
      };
    }

    // Remove undefined values
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const review = await prisma.performanceReview.update({
      where: { id },
      data: updateData,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        reviewer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/performance/reviews/[id] - Delete review (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.performanceReview.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
