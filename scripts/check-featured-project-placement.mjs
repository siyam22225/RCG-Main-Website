import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

try {
  const allProjects = await prisma.enterpriseProject.findMany({
    orderBy: [
      { enterpriseSlug: "asc" },
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ],
    select: {
      id: true,
      enterpriseSlug: true,
      slug: true,
      name: true,
      isActive: true,
      displayOrder: true,
    },
  });

  const landRpcdlProjects = allProjects.filter(
    (project) => project.enterpriseSlug === "land-rpcdl"
  );

  console.log("");
  console.log("========================================");
  console.log("ALL FEATURED PROJECTS IN DATABASE");
  console.log("========================================");
  console.table(allProjects);

  console.log("");
  console.log("========================================");
  console.log("PROJECTS SAVED UNDER land-rpcdl");
  console.log("========================================");
  console.table(landRpcdlProjects);

  console.log("");
  console.log("TOTAL under land-rpcdl:", landRpcdlProjects.length);
  console.log("");
} finally {
  await prisma.$disconnect();
}
