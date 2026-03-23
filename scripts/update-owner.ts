import { prisma } from "../lib/db";

async function main() {
  // Update support@xenonlabs.ai to OWNER role
  const user = await prisma.user.update({
    where: { email: "support@xenonlabs.ai" },
    data: { role: "OWNER" },
    select: { id: true, email: true, firstName: true, lastName: true, role: true }
  });
  console.log("Updated user:", JSON.stringify(user, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
