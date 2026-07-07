import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

try {
  const item = await prisma.businessVerticalItem.findFirst({
    where: { enterpriseSlug: "rc-bay" },
    select: {
      id: true,
      label: true,
      enterpriseSlug: true,
      targetUrl: true,
      isActive: true,
    },
  });

  const projects = await prisma.enterpriseProject.findMany({
    where: { enterpriseSlug: "rc-bay" },
    select: {
      id: true,
      name: true,
      slug: true,
      enterpriseSlug: true,
      isActive: true,
      displayOrder: true,
    },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });

  console.log("");
  console.log("RC BAY BUSINESS VERTICAL ITEM");
  console.table(item ? [item] : []);

  console.log("");
  console.log("RC BAY FEATURED PROJECTS");
  console.table(projects);

  console.log("");
} finally {
  await prisma.$disconnect();
}
