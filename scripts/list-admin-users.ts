import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  const admins = await prisma.adminUser.findMany({
    select: {
      id: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  console.table(admins);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });