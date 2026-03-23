import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";

const prisma = new PrismaClient();

// Generate a 6-character alphanumeric setup code
function generateSetupCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  const bytes = randomBytes(6);
  for (let i = 0; i < 6; i++) {
    code += chars[bytes[i] % chars.length];
  }
  return code;
}

async function generateSetupCodeForUser() {
  // Get email from command line argument or use default
  const email = process.argv[2] || "abhisek.sinha@xenonlabs.ai";

  console.log(`\nGenerating setup code for: ${email}\n`);

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, firstName: true, lastName: true },
  });

  if (!user) {
    console.error(`User not found: ${email}`);
    console.log("\nUsage: npx ts-node scripts/generate-setup-code.ts <email>");
    return;
  }

  console.log(`Found user: ${user.firstName} ${user.lastName} (${user.email})`);

  // Get the admin user
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { id: true },
  });

  if (!admin) {
    console.error("No admin user found!");
    return;
  }

  // Generate setup code
  const setupCode = generateSetupCode();
  const setupCodeExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  // Enable monitoring and generate setup code in one operation
  const consent = await prisma.monitoringConsent.upsert({
    where: { userId: user.id },
    update: {
      adminEnabled: true,
      adminEnabledBy: admin.id,
      adminEnabledAt: new Date(),
      employeeConsented: true,
      employeeConsentedAt: new Date(),
      consentVersion: "1.0",
      setupCode,
      setupCodeExpiresAt,
      // Clear any previous revocation
      revokedAt: null,
      revokedBy: null,
      revocationReason: null,
    },
    create: {
      userId: user.id,
      adminEnabled: true,
      adminEnabledBy: admin.id,
      adminEnabledAt: new Date(),
      employeeConsented: true,
      employeeConsentedAt: new Date(),
      consentVersion: "1.0",
      setupCode,
      setupCodeExpiresAt,
    },
  });

  console.log("\n" + "=".repeat(50));
  console.log("✓ Monitoring enabled and consent recorded");
  console.log("=".repeat(50));
  console.log("\n  SETUP CODE:  " + setupCode);
  console.log("\n  Expires: " + setupCodeExpiresAt.toLocaleString());
  console.log("\n" + "=".repeat(50));
  console.log("\nHow to use:");
  console.log("1. Open the XeWorkspace Agent Settings window");
  console.log("2. Select 'Quick Setup' tab");
  console.log("3. Enter Server URL: http://localhost:3000");
  console.log("4. Enter Setup Code: " + setupCode);
  console.log("5. Click 'Connect with Code'");
  console.log("=".repeat(50) + "\n");
}

generateSetupCodeForUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
