import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.enterprise.findMany({
    where: {
      slug: { in: ["land-rpcdl", "rc-property"] }
    },
    select: {
      slug: true,
      name: true,
      isActive: true
    }
  });

  console.log(JSON.stringify(rows, null, 2));
}

main()
  .finally(async () => prisma.$disconnect());
