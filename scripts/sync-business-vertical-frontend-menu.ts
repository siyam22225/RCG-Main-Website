import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const menuGroups = [
  {
    label: "Real Estate (Housing)",
    slug: "real-estate-housing",
    displayOrder: 0,
    legacyLabels: ["Real Estate"],
    items: [{ label: "RC Property", enterpriseSlug: "rc-property", displayOrder: 0 }],
  },
  {
    label: "Real Estate (Apartment)",
    slug: "real-estate-apartment",
    displayOrder: 1,
    legacyLabels: [],
    items: [{ label: "RC Holdings", enterpriseSlug: "rc-holdings", displayOrder: 0 }],
  },
  {
    label: "Real Estate (Hospitality)",
    slug: "real-estate-hospitality",
    displayOrder: 2,
    legacyLabels: [],
    items: [{ label: "RC Bay", enterpriseSlug: "rc-bay", displayOrder: 0 }],
  },
  {
    label: "Information Technology",
    slug: "information-technology",
    displayOrder: 3,
    legacyLabels: [],
    items: [{ label: "RESDA", enterpriseSlug: "resda", displayOrder: 0 }],
  },
  {
    label: "Supply Chain",
    slug: "supply-chain",
    displayOrder: 4,
    legacyLabels: [],
    items: [{ label: "AFSEN Construction", enterpriseSlug: "afsen-construction", displayOrder: 0 }],
  },
];

async function main() {
  for (const group of menuGroups) {
    let category = await prisma.businessVerticalCategory.findFirst({
      where: {
        OR: [
          { slug: group.slug },
          { label: group.label },
          ...group.legacyLabels.map((label) => ({ label })),
        ],
      },
    });

    if (!category) {
      category = await prisma.businessVerticalCategory.create({
        data: {
          label: group.label,
          slug: group.slug,
          displayOrder: group.displayOrder,
          isActive: true,
        },
      });
    } else {
      category = await prisma.businessVerticalCategory.update({
        where: { id: category.id },
        data: {
          label: group.label,
          slug: group.slug,
          displayOrder: group.displayOrder,
          isActive: true,
        },
      });
    }

    for (const item of group.items) {
      const existingItem = await prisma.businessVerticalItem.findFirst({
        where: {
          OR: [
            { enterpriseSlug: item.enterpriseSlug },
            { label: item.label },
          ],
        },
      });

      if (existingItem) {
        await prisma.businessVerticalItem.update({
          where: { id: existingItem.id },
          data: {
            categoryId: category.id,
            label: item.label,
            enterpriseSlug: item.enterpriseSlug,
            targetUrl: `/business-verticals/${item.enterpriseSlug}`,
            displayOrder: item.displayOrder,
            isActive: true,
          },
        });
      } else {
        await prisma.businessVerticalItem.create({
          data: {
            categoryId: category.id,
            label: item.label,
            enterpriseSlug: item.enterpriseSlug,
            targetUrl: `/business-verticals/${item.enterpriseSlug}`,
            displayOrder: item.displayOrder,
            isActive: true,
          },
        });
      }
    }
  }

  await prisma.businessVerticalCategory.updateMany({
    where: {
      label: {
        in: ["Real Estate", "Hospitality", "Agro", "Grocery", "Rea demo"],
      },
    },
    data: { isActive: false },
  });

  console.log("Business Vertical menu aligned with frontend header.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
