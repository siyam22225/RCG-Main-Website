import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

try {
  const afsenItems = await prisma.businessVerticalItem.findMany({
    where: {
      OR: [
        { label: { contains: "AFSEN", mode: "insensitive" } },
        { enterpriseSlug: { contains: "afsen", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      label: true,
      enterpriseSlug: true,
      targetUrl: true,
      isActive: true,
    },
  });

  const afsenProjects = await prisma.enterpriseProject.findMany({
    where: {
      OR: [
        { name: { contains: "sdfghjkl", mode: "insensitive" } },
        { enterpriseSlug: { contains: "afsen", mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      name: true,
      slug: true,
      enterpriseSlug: true,
      isActive: true,
      displayOrder: true,
    },
    orderBy: [{ enterpriseSlug: "asc" }, { createdAt: "asc" }],
  });

  console.log("");
  console.log("AFSEN BUSINESS VERTICAL SUB-CATEGORIES");
  console.table(afsenItems);

  console.log("");
  console.log("AFSEN FEATURED PROJECTS");
  console.table(afsenProjects);

  console.log("");
  console.log("PUBLIC URLs BASED ON CURRENT DB:");
  for (const project of afsenProjects) {
    console.log(`/business-verticals/${project.enterpriseSlug}/${project.slug}`);
  }
  console.log("");
} finally {
  await prisma.$disconnect();
}
