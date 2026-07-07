import "dotenv/config";
import { prisma } from "../src/lib/prisma";

async function main() {
  // Hide only obvious test/demo entries
  await prisma.enterprise.updateMany({
    where: {
      OR: [
        { name: { contains: "test", mode: "insensitive" } },
        { slug: { contains: "test", mode: "insensitive" } },
        { name: { contains: "demo", mode: "insensitive" } },
        { slug: { contains: "demo", mode: "insensitive" } },
        { name: { contains: "abcd", mode: "insensitive" } },
        { slug: { contains: "abcd", mode: "insensitive" } },
        { name: { contains: "bbbb", mode: "insensitive" } },
        { slug: { contains: "bbbb", mode: "insensitive" } },
      ],
    },
    data: { isActive: false },
  });

  // Restore original concern cards by name/slug keyword, not exact slug
  await prisma.enterprise.updateMany({
    where: {
      OR: [
        { name: { contains: "Property", mode: "insensitive" } },
        { slug: { contains: "property", mode: "insensitive" } },

        { name: { contains: "Holdings", mode: "insensitive" } },
        { slug: { contains: "holdings", mode: "insensitive" } },

        { name: { contains: "Bay", mode: "insensitive" } },
        { slug: { contains: "bay", mode: "insensitive" } },

        { name: { contains: "RESDA", mode: "insensitive" } },
        { slug: { contains: "resda", mode: "insensitive" } },

        { name: { contains: "Construction", mode: "insensitive" } },
        { slug: { contains: "construction", mode: "insensitive" } },

        { name: { contains: "Foundation", mode: "insensitive" } },
        { slug: { contains: "foundation", mode: "insensitive" } },

        { name: { contains: "Agro", mode: "insensitive" } },
        { slug: { contains: "agro", mode: "insensitive" } },
      ],
    },
    data: { isActive: true },
  });

  const active = await prisma.enterprise.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    select: { name: true, slug: true, isActive: true },
  });

  console.log("Active enterprise cards now:");
  console.table(active);
}

main()
  .catch((error) => {
    console.error("RESTORE_ORIGINAL_CONCERNS_ERROR", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
