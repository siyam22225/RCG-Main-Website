import "dotenv/config";
import { prisma } from "../src/lib/prisma";

const categories = [
  {
    label: "Real Estate",
    slug: "real-estate",
    displayOrder: 0,
    items: [
      { label: "RC Property", enterpriseSlug: "rc-property", displayOrder: 0 },
      { label: "RC Holdings", enterpriseSlug: "rc-holdings", displayOrder: 1 },
      { label: "RC Bay", enterpriseSlug: "rc-bay", displayOrder: 2 },
    ],
  },
  {
    label: "Information Technology",
    slug: "information-technology",
    displayOrder: 1,
    items: [
      { label: "RESDA", enterpriseSlug: "resda", displayOrder: 0 },
    ],
  },
  {
    label: "Supply Chain",
    slug: "supply-chain",
    displayOrder: 2,
    items: [
      { label: "AFSEN Construction", enterpriseSlug: "afsen-construction", displayOrder: 0 },
    ],
  },
  {
    label: "Agro",
    slug: "agro",
    displayOrder: 3,
    items: [
      { label: "AFSEN Agro Firm", enterpriseSlug: "afsen-agro-firm", displayOrder: 0 },
    ],
  },
  {
    label: "Hospitality",
    slug: "hospitality",
    displayOrder: 4,
    items: [
      { label: "ABD Foundation", enterpriseSlug: "abd-foundation", displayOrder: 0 },
    ],
  },
];

async function main() {
  // Hide only the accidental demo category if it exists.
  await prisma.businessVerticalCategory.updateMany({
    where: { label: { equals: "Rea demo", mode: "insensitive" } },
    data: { isActive: false },
  });

  for (const category of categories) {
    let dbCategory =
      (await prisma.businessVerticalCategory.findFirst({
        where: {
          OR: [{ slug: category.slug }, { label: category.label }],
        },
      })) ||
      (await prisma.businessVerticalCategory.create({
        data: {
          label: category.label,
          slug: category.slug,
          displayOrder: category.displayOrder,
          isActive: true,
        },
      }));

    dbCategory = await prisma.businessVerticalCategory.update({
      where: { id: dbCategory.id },
      data: {
        label: category.label,
        displayOrder: category.displayOrder,
        isActive: true,
      },
    });

    for (const item of category.items) {
      const existingItem = await prisma.businessVerticalItem.findFirst({
        where: {
          categoryId: dbCategory.id,
          label: item.label,
        },
      });

      if (existingItem) {
        await prisma.businessVerticalItem.update({
          where: { id: existingItem.id },
          data: {
            label: item.label,
            enterpriseSlug: item.enterpriseSlug,
            targetUrl: `/enterprise/${item.enterpriseSlug}`,
            displayOrder: item.displayOrder,
            isActive: true,
          },
        });
      } else {
        await prisma.businessVerticalItem.create({
          data: {
            categoryId: dbCategory.id,
            label: item.label,
            enterpriseSlug: item.enterpriseSlug,
            targetUrl: `/enterprise/${item.enterpriseSlug}`,
            displayOrder: item.displayOrder,
            isActive: true,
          },
        });
      }
    }
  }

  console.log("Old Business Vertical categories restored into database.");
}

main()
  .catch((error) => {
    console.error("BUSINESS_VERTICAL_RESTORE_ERROR", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
