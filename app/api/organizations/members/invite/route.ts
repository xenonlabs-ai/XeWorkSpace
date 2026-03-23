import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

// Generate a random temporary password
function generateTempPassword(): string {
  // Generate a 12-character password with letters, numbers, and special chars
  const length = 12;
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let password = "";
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  return password;
}

// POST /api/organizations/members/invite - Invite a new member with temp password
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { organization: true },
    });

    if (!currentUser?.organizationId || !currentUser.organization) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 404 }
      );
    }

    // Only OWNER, ADMIN, or MANAGER can invite members
    if (!["OWNER", "ADMIN", "MANAGER"].includes(currentUser.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { email, firstName, lastName, role = "MEMBER", department, jobTitle } = body;

    // Validate required fields
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Email, first name, and last name are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // If user exists but not in this organization, add them
      if (existingUser.organizationId === currentUser.organizationId) {
        return NextResponse.json(
          { error: "User is already a member of this organization" },
          { status: 400 }
        );
      }
      // User exists in another org
      return NextResponse.json(
        { error: "User already has an account. They can request to join your organization." },
        { status: 400 }
      );
    }

    // Cannot invite with higher role than yourself
    const roleHierarchy = ["VIEWER", "MEMBER", "MANAGER", "ADMIN", "OWNER"];
    if (roleHierarchy.indexOf(role) >= roleHierarchy.indexOf(currentUser.role)) {
      return NextResponse.json(
        { error: "Cannot invite member with equal or higher role than yourself" },
        { status: 403 }
      );
    }

    // Generate temporary password
    const tempPassword = generateTempPassword();
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create the user
    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
        role,
        department,
        jobTitle,
        organizationId: currentUser.organizationId,
        requiresPasswordChange: true,
        invitedBy: currentUser.id,
        status: "ACTIVE",
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        department: true,
        jobTitle: true,
        createdAt: true,
      },
    });

    // Create a notification for the new user
    await prisma.notification.create({
      data: {
        userId: newUser.id,
        type: "SYSTEM",
        title: "Welcome to " + currentUser.organization.name,
        message: `You've been invited to join ${currentUser.organization.name}. Please change your password after logging in.`,
      },
    });

    // TODO: Send email with credentials
    // For now, return the temp password in the response
    // In production, this should be sent via email only

    return NextResponse.json({
      user: newUser,
      tempPassword, // Only return this for display, should be sent via email in production
      message: "User created successfully. Temporary password generated.",
    }, { status: 201 });
  } catch (error) {
    console.error("Error inviting member:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
