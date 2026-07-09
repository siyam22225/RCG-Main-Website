import fs from "fs";
import path from "path";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required.");
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const prisma = new PrismaClient({ adapter });

const seedPath = path.join(process.cwd(), "prisma", "seed-data", "cms-export.json");

type Row = Record<string, any>;

function readSeedData(): Record<string, Row[]> {
  if (!fs.existsSync(seedPath)) {
    throw new Error(`CMS seed data not found: ${seedPath}`);
  }

  return JSON.parse(fs.readFileSync(seedPath, "utf8"));
}

function reviveDates(row: Row): Row {
  const next: Row = { ...row };

  for (const key of ["createdAt", "updatedAt", "publishedAt", "deadline"]) {
    if (next[key]) {
      next[key] = new Date(next[key]);
    }
  }

  return next;
}

function updateOnly(row: Row): Row {
  const next = { ...row };
  delete next.id;
  delete next.createdAt;
  delete next.updatedAt;
  return next;
}

async function upsertRows(
  modelName: string,
  rows: Row[] = [],
  whereFor: (row: Row) => Row
) {
  const delegate = (prisma as any)[modelName];

  if (!delegate) {
    console.log(`Skipping ${modelName}: Prisma delegate not found.`);
    return;
  }

  let count = 0;

  for (const rawRow of rows) {
    const row = reviveDates(rawRow);

    await delegate.upsert({
      where: whereFor(row),
      update: updateOnly(row),
      create: row,
    });

    count++;
  }

  console.log(`${modelName}: upserted ${count}`);
}

async function main() {
  const data = readSeedData();

  await upsertRows("officeSetting", data.officeSetting, (row) => ({ key: row.key }));
  await upsertRows("socialLink", data.socialLink, (row) => ({ label: row.label }));
  await upsertRows("websiteLogoSetting", data.websiteLogoSetting, (row) => ({ id: row.id }));
  await upsertRows("brandLogo", data.brandLogo, (row) => ({ id: row.id }));
  await upsertRows("clientLoginSetting", data.clientLoginSetting, (row) => ({ id: row.id }));
  await upsertRows("seoSetting", data.seoSetting, (row) => ({ id: row.id }));
  await upsertRows("sitePopupSetting", data.sitePopupSetting, (row) => ({ id: row.id }));
  await upsertRows("aboutPageContent", data.aboutPageContent, (row) => ({ pageKey: row.pageKey }));
  await upsertRows("formerChairmanMessage", data.formerChairmanMessage, (row) => ({ id: row.id }));
  await upsertRows("careerPageSetting", data.careerPageSetting, (row) => ({ id: row.id }));

  await upsertRows("homeSlide", data.homeSlide, (row) => ({ id: row.id }));
  await upsertRows("news", data.news, (row) => ({ slug: row.slug }));
  await upsertRows("blogPost", data.blogPost, (row) => ({ slug: row.slug }));
  await upsertRows("photo", data.photo, (row) => ({ id: row.id }));
  await upsertRows("video", data.video, (row) => ({ id: row.id }));
  await upsertRows("careerVacancy", data.careerVacancy, (row) => ({ slug: row.slug }));

  await upsertRows("enterprise", data.enterprise, (row) => ({ slug: row.slug }));
  await upsertRows("businessVerticalCategory", data.businessVerticalCategory, (row) => ({
    slug: row.slug,
  }));

  const exportedCategories = data.businessVerticalCategory ?? [];
  const categorySlugs = exportedCategories.map((category) => category.slug).filter(Boolean);

  const savedCategories = await prisma.businessVerticalCategory.findMany({
    where: { slug: { in: categorySlugs } },
    select: { id: true, slug: true },
  });

  const savedCategoryIdBySlug = new Map(
    savedCategories.map((category) => [category.slug, category.id])
  );

  const exportedCategoryIdToSlug = new Map(
    exportedCategories.map((category) => [category.id, category.slug])
  );

  const businessVerticalItems = (data.businessVerticalItem ?? []).map((item) => {
    const categorySlug = exportedCategoryIdToSlug.get(item.categoryId);
    const actualCategoryId = categorySlug
      ? savedCategoryIdBySlug.get(categorySlug)
      : undefined;

    return {
      ...item,
      categoryId: actualCategoryId ?? item.categoryId,
    };
  });

  await upsertRows("businessVerticalItem", businessVerticalItems, (row) => ({ id: row.id }));

  await upsertRows("enterpriseProject", data.enterpriseProject, (row) => ({
    enterpriseSlug_slug: {
      enterpriseSlug: row.enterpriseSlug,
      slug: row.slug,
    },
  }));

  console.log("CMS seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("CMS_SEED_ERROR:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
