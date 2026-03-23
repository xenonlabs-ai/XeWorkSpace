import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("👤 Adding new team member...");

  // Get XenonLabs organization
  const xenonlabsOrg = await prisma.organization.findUnique({
    where: { slug: "xenonlabs" },
  });

  if (!xenonlabsOrg) {
    throw new Error("XenonLabs organization not found. Please run seed first.");
  }

  // Create new employee
  const password = await bcrypt.hash("Xenon$1234", 10);
  const newEmployee = await prisma.user.upsert({
    where: { email: "abhisek.sinha+1@xenonlabs.ai" },
    update: {
      password: password,
      organizationId: xenonlabsOrg.id,
      role: "MEMBER",
    },
    create: {
      email: "abhisek.sinha+1@xenonlabs.ai",
      password: password,
      firstName: "Abhisek",
      lastName: "Sinha",
      role: "MEMBER",
      status: "ACTIVE",
      department: "Engineering",
      jobTitle: "Software Engineer",
      skills: JSON.stringify(["JavaScript", "React", "Node.js", "TypeScript"]),
      organizationId: xenonlabsOrg.id,
    },
  });

  console.log("✅ Created new employee:", newEmployee.email);
  console.log("   Role:", newEmployee.role);
  console.log("   Organization:", xenonlabsOrg.name);

  // Optionally add to the engineering team
  const team = await prisma.team.findFirst({
    where: {
      organizationId: xenonlabsOrg.id,
      name: "Engineering Team"
    },
  });

  if (team) {
    await prisma.teamMember.upsert({
      where: {
        userId_teamId: {
          userId: newEmployee.id,
          teamId: team.id,
        },
      },
      update: {},
      create: {
        userId: newEmployee.id,
        teamId: team.id,
        role: "member",
      },
    });
    console.log("✅ Added to team:", team.name);
  }

  console.log("\n🎉 Team member added successfully!");
  console.log("\n📝 Login Credentials:");
  console.log("   Email: abhisek.sinha+1@xenonlabs.ai");
  console.log("   Password: Xenon$1234");
}

main()
  .catch((e) => {
    console.error("❌ Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
