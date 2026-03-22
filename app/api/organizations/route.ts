import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// GET /api/organizations - Get current user's organization
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        organization: true,
      },
    });

    if (!user?.organization) {
      return NextResponse.json({ organization: null });
    }

    return NextResponse.json({ organization: user.organization });
  } catch (error) {
    console.error("Error fetching organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/organizations - Create a new organization
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, slug, domain, industry, size, timezone } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug is already taken
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      return NextResponse.json(
        { error: "Organization slug already exists" },
        { status: 400 }
      );
    }

    // Check if domain is already taken (if provided)
    if (domain) {
      const domainExists = await prisma.organization.findUnique({
        where: { domain },
      });
      if (domainExists) {
        return NextResponse.json(
          { error: "Domain already registered" },
          { status: 400 }
        );
      }
    }

    // Create organization and update user as OWNER
    const organization = await prisma.organization.create({
      data: {
        name,
        slug: slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
        domain: domain || null,
        industry: industry || null,
        size: size || null,
        timezone: timezone || "UTC",
        users: {
          connect: { id: session.user.id },
        },
      },
    });

    // Update user role to OWNER
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role: "OWNER",
        organizationId: organization.id,
      },
    });

    return NextResponse.json({ organization }, { status: 201 });
  } catch (error) {
    console.error("Error creating organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/organizations - Update organization
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user?.organizationId) {
      return NextResponse.json(
        { error: "No organization found" },
        { status: 404 }
      );
    }

    // Only OWNER or ADMIN can update
    if (!["OWNER", "ADMIN"].includes(user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, logo, description, website, industry, size, timezone, settings } = body;

    const organization = await prisma.organization.update({
      where: { id: user.organizationId },
      data: {
        ...(name && { name }),
        ...(logo !== undefined && { logo }),
        ...(description !== undefined && { description }),
        ...(website !== undefined && { website }),
        ...(industry !== undefined && { industry }),
        ...(size !== undefined && { size }),
        ...(timezone && { timezone }),
        ...(settings !== undefined && { settings: JSON.stringify(settings) }),
      },
    });

    return NextResponse.json({ organization });
  } catch (error) {
    console.error("Error updating organization:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
