import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const allowedSlugs = [
  "rc-property",
  "rc-holdings",
  "rc-bay",
  "resda",
  "afsen-construction",
  "afsen-agro-firm",
  "abd-foundation",
];

async function main() {
  await prisma.enterprise.updateMany({
    where: {
      slug: {
        notIn: allowedSlugs,
      },
    },
    data: {
      isActive: false,
    },
  });

  await prisma.enterprise.updateMany({
    where: {
      slug: {
        in: allowedSlugs,
      },
    },
    data: {
      isActive: true,
    },
  });

  console.log("Enterprise public grid restored to original allowed concerns only.");
}

main()
  .catch((error) => {
    console.error("RESTORE_ENTERPRISE_GRID_ERROR", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
