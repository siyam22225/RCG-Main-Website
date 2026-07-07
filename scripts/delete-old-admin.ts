import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const KEEP_EMAIL = process.env.KEEP_ADMIN_EMAIL?.trim().toLowerCase();
const CONFIRM_DELETE = process.env.DELETE_OLD_ADMINS_CONFIRM === "DELETE";

async function main() {
  if (!KEEP_EMAIL) {
    throw new Error("KEEP_ADMIN_EMAIL is required.");
  }

  if (!CONFIRM_DELETE) {
    throw new Error("Set DELETE_OLD_ADMINS_CONFIRM=DELETE before deleting admin users.");
  }

  const keepAdmin = await prisma.adminUser.findUnique({
    where: { email: KEEP_EMAIL },
  });

  if (!keepAdmin) {
    throw new Error(`Keep admin not found: ${KEEP_EMAIL}`);
  }

  const result = await prisma.adminUser.deleteMany({
    where: {
      email: {
        not: KEEP_EMAIL,
      },
    },
  });

  console.log(`Deleted old admin users: ${result.count}`);

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
  .catch((error) => {
    console.error("DELETE_OLD_ADMIN_ERROR", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
