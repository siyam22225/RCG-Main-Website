import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
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
const ADMIN_PASSWORD_MIN_LENGTH = 12;

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

function readAdminSeedConfig() {
  const email = process.env.CREATE_ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.CREATE_ADMIN_PASSWORD;
  const name = process.env.CREATE_ADMIN_NAME?.trim();
  const overwrite = process.env.CREATE_ADMIN_OVERWRITE === "true";

  if (!email && !password) {
    return null;
  }

  if (!email || !password) {
    throw new Error(
      "CREATE_ADMIN_EMAIL and CREATE_ADMIN_PASSWORD must both be set to seed an admin user."
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("CREATE_ADMIN_EMAIL must be a valid email address.");
  }

  if (password.length < ADMIN_PASSWORD_MIN_LENGTH) {
    throw new Error(
      `CREATE_ADMIN_PASSWORD must be at least ${ADMIN_PASSWORD_MIN_LENGTH} characters.`
    );
  }

  return {
    email,
    password,
    name: name || null,
    overwrite,
  };
}

async function seedAdminUser() {
  const adminConfig = readAdminSeedConfig();

  if (!adminConfig) {
    console.log(
      "AdminUser: skipped because CREATE_ADMIN_EMAIL and CREATE_ADMIN_PASSWORD are not set."
    );
    return;
  }

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminConfig.email },
  });

  if (existingAdmin && !adminConfig.overwrite) {
    await prisma.adminUser.update({
      where: { email: adminConfig.email },
      data: {
        name: adminConfig.name ?? existingAdmin.name,
        role: "super_admin",
        isProtected: true,
        isActive: true,
        isHiddenFromAdminPanel: false,
      },
    });

    console.log(
      "AdminUser: updated existing protected super admin without changing password."
    );
    return;
  }

  const hashedPassword = await bcrypt.hash(adminConfig.password, 10);

  await prisma.adminUser.upsert({
    where: { email: adminConfig.email },
    update: {
      password: hashedPassword,
      name: adminConfig.name ?? existingAdmin?.name ?? null,
      role: "super_admin",
      isProtected: true,
      isActive: true,
      isHiddenFromAdminPanel: false,
    },
    create: {
      email: adminConfig.email,
      password: hashedPassword,
      name: adminConfig.name,
      role: "super_admin",
      isProtected: true,
      isActive: true,
      isHiddenFromAdminPanel: false,
    },
  });

  console.log(
    existingAdmin
      ? "AdminUser: password updated for configured protected super admin."
      : "AdminUser: created configured protected super admin."
  );
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

  await seedAdminUser();

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
