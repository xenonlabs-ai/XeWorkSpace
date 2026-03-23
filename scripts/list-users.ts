import { prisma } from "../lib/db";

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true, role: true }
  });
  console.log("All users:");
  users.forEach(u => {
    console.log(`  ${u.email} - ${u.role} (${u.firstName} ${u.lastName})`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
