import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // ==================== CREATE ORGANIZATIONS ====================

  // Create XenonLabs Organization
  const xenonlabsOrg = await prisma.organization.upsert({
    where: { slug: "xenonlabs" },
    update: {},
    create: {
      name: "XenonLabs",
      slug: "xenonlabs",
      domain: "xenonlabs.ai",
      description: "AI-powered solutions company",
      industry: "Technology",
      size: "11-50",
      timezone: "Asia/Kolkata",
      plan: "ENTERPRISE",
    },
  });
  console.log("✅ Created XenonLabs organization:", xenonlabsOrg.name);

  // ==================== CREATE USERS ====================

  // Create XenonLabs Admin User (OWNER)
  const xenonAdminPassword = await bcrypt.hash("Xenon$1234", 10);
  const xenonAdmin = await prisma.user.upsert({
    where: { email: "support@xenonlabs.ai" },
    update: {
      password: xenonAdminPassword,
      organizationId: xenonlabsOrg.id,
      role: "OWNER",
    },
    create: {
      email: "support@xenonlabs.ai",
      password: xenonAdminPassword,
      firstName: "Support",
      lastName: "Admin",
      role: "OWNER",
      status: "ACTIVE",
      department: "Administration",
      jobTitle: "System Administrator",
      skills: JSON.stringify(["Administration", "Support", "Management"]),
      organizationId: xenonlabsOrg.id,
    },
  });
  console.log("✅ Created XenonLabs owner:", xenonAdmin.email);

  // Create XenonLabs Employee User
  const xenonEmployeePassword = await bcrypt.hash("Xenon$1234", 10);
  const xenonEmployee = await prisma.user.upsert({
    where: { email: "abhisek.sinha@xenonlabs.ai" },
    update: {
      password: xenonEmployeePassword,
      organizationId: xenonlabsOrg.id,
    },
    create: {
      email: "abhisek.sinha@xenonlabs.ai",
      password: xenonEmployeePassword,
      firstName: "Abhisek",
      lastName: "Sinha",
      role: "ADMIN",
      status: "ACTIVE",
      department: "Engineering",
      jobTitle: "Software Engineer",
      skills: JSON.stringify(["JavaScript", "React", "Node.js", "TypeScript"]),
      organizationId: xenonlabsOrg.id,
    },
  });
  console.log("✅ Created XenonLabs employee:", xenonEmployee.email);

  // Create Team for XenonLabs
  const team = await prisma.team.upsert({
    where: { id: "team-xenonlabs-engineering" },
    update: {},
    create: {
      id: "team-xenonlabs-engineering",
      name: "Engineering Team",
      description: "XenonLabs core engineering team",
      organizationId: xenonlabsOrg.id,
    },
  });
  console.log("✅ Created team:", team.name);

  // Add members to team
  await prisma.teamMember.upsert({
    where: {
      userId_teamId: {
        userId: xenonAdmin.id,
        teamId: team.id,
      },
    },
    update: {},
    create: {
      userId: xenonAdmin.id,
      teamId: team.id,
      role: "lead",
    },
  });

  await prisma.teamMember.upsert({
    where: {
      userId_teamId: {
        userId: xenonEmployee.id,
        teamId: team.id,
      },
    },
    update: {},
    create: {
      userId: xenonEmployee.id,
      teamId: team.id,
      role: "member",
    },
  });
  console.log("✅ Added members to team");

  // Create Project for XenonLabs
  await prisma.project.upsert({
    where: { id: "project-xeworkspace" },
    update: {},
    create: {
      id: "project-xeworkspace",
      name: "XeWorkspace Platform",
      description: "Main project for the XeWorkspace application development",
      status: "IN_PROGRESS",
      priority: "HIGH",
      progress: 45,
      teamId: team.id,
      organizationId: xenonlabsOrg.id,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-06-30"),
    },
  });
  console.log("✅ Created project: XeWorkspace Platform");

  console.log("\n🎉 Database seeding completed!");
  console.log("\n📝 Login Credentials:");
  console.log("   XenonLabs Admin: support@xenonlabs.ai / Xenon$1234");
  console.log("   XenonLabs Employee: abhisek.sinha@xenonlabs.ai / Xenon$1234");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
