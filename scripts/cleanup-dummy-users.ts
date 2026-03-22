import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Starting cleanup of dummy users...");

  // List of dummy user emails to delete
  const dummyEmails = [
    "admin@xetask.com",
    "manager@xetask.com",
    "alex.johnson@xetask.com",
    "samantha.lee@xetask.com",
    "michael.chen@xetask.com",
    "emily.rodriguez@xetask.com",
    "david.kim@xetask.com",
  ];

  for (const email of dummyEmails) {
    try {
      // First delete related records (due to foreign key constraints)
      const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (user) {
        // Delete related team memberships
        await prisma.teamMember.deleteMany({
          where: { userId: user.id },
        });

        // Delete related tasks (as assignee)
        await prisma.task.deleteMany({
          where: { assigneeId: user.id },
        });

        // Delete related tasks (as creator)
        await prisma.task.deleteMany({
          where: { creatorId: user.id },
        });

        // Delete related attendance records
        await prisma.attendance.deleteMany({
          where: { userId: user.id },
        });

        // Delete related performance reviews (as employee)
        await prisma.performanceReview.deleteMany({
          where: { employeeId: user.id },
        });

        // Delete related performance reviews (as reviewer)
        await prisma.performanceReview.deleteMany({
          where: { reviewerId: user.id },
        });

        // Delete related goals
        await prisma.goal.deleteMany({
          where: { userId: user.id },
        });

        // Delete related desktop sessions
        await prisma.desktopSession.deleteMany({
          where: { userId: user.id },
        });

        // Delete related monitoring consents
        await prisma.monitoringConsent.deleteMany({
          where: { userId: user.id },
        });

        // Finally delete the user
        await prisma.user.delete({
          where: { email },
        });

        console.log(`✅ Deleted user: ${email}`);
      } else {
        console.log(`⏭️  User not found: ${email}`);
      }
    } catch (error) {
      console.error(`❌ Error deleting ${email}:`, error);
    }
  }

  // Also delete the demo organization if it exists
  try {
    const demoOrg = await prisma.organization.findUnique({
      where: { slug: "demo-company" },
    });

    if (demoOrg) {
      // Delete related teams
      await prisma.team.deleteMany({
        where: { organizationId: demoOrg.id },
      });

      // Delete related projects
      await prisma.project.deleteMany({
        where: { organizationId: demoOrg.id },
      });

      // Delete the organization
      await prisma.organization.delete({
        where: { slug: "demo-company" },
      });

      console.log("✅ Deleted demo organization");
    }
  } catch (error) {
    console.error("❌ Error deleting demo organization:", error);
  }

  console.log("\n🎉 Cleanup completed!");
}

main()
  .catch((e) => {
    console.error("❌ Cleanup error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
