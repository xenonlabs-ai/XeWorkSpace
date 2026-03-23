import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function enableMonitoringForUsers() {
  const emails = ["support@xenonlabs.ai", "abhisek.sinha@xenonlabs.ai"];

  console.log("Enabling monitoring for users...\n");

  for (const email of emails) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    if (!user) {
      console.log(`User not found: ${email}`);
      continue;
    }

    console.log(`Found user: ${user.firstName} ${user.lastName} (${user.email})`);

    // Get the admin user to set as enabler
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { id: true },
    });

    if (!admin) {
      console.log("No admin user found!");
      continue;
    }

    // Enable monitoring for the user
    const consent = await prisma.monitoringConsent.upsert({
      where: { userId: user.id },
      update: {
        adminEnabled: true,
        adminEnabledBy: admin.id,
        adminEnabledAt: new Date(),
        revokedAt: null,
        revokedBy: null,
      },
      create: {
        userId: user.id,
        adminEnabled: true,
        adminEnabledBy: admin.id,
        adminEnabledAt: new Date(),
      },
    });

    // Create notification for the user
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "Monitoring Enabled",
        message:
          "Your administrator has enabled desktop monitoring for your account. Please download the desktop agent and accept the monitoring terms to begin.",
        type: "system",
        actionUrl: "/monitoring/consent",
      },
    });

    console.log(`  ✓ Monitoring enabled for ${user.email}`);
    console.log(`  ✓ Notification sent`);
    console.log(`  Status: PENDING_EMPLOYEE (waiting for consent)\n`);
  }

  console.log("Done!");
}

enableMonitoringForUsers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
