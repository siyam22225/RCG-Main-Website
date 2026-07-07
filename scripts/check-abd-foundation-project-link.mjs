import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

try {
  const project = await prisma.enterpriseProject.findFirst({
    where: {
      name: {
        contains: "abddd",
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      slug: true,
      enterpriseSlug: true,
      isActive: true,
      displayOrder: true,
    },
  });

  const abdItems = await prisma.businessVerticalItem.findMany({
    where: {
      OR: [
        { label: { contains: "ABD", mode: "insensitive" } },
        { enterpriseSlug: { contains: "abd", mode: "insensitive" } },
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

  console.log("");
  console.log("FEATURED PROJECT MATCH");
  console.table(project ? [project] : []);

  console.log("");
  console.log("ABD-RELATED BUSINESS VERTICAL SUB-CATEGORIES");
  console.table(abdItems);

  console.log("");
  if (project) {
    console.log("Expected public project URL:");
    console.log(`/business-verticals/${project.enterpriseSlug}/${project.slug}`);
    console.log("");
    console.log("Expected parent public URL:");
    console.log(`/business-verticals/${project.enterpriseSlug}`);
  }
  console.log("");
} finally {
  await prisma.$disconnect();
}
