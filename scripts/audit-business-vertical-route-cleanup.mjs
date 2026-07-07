import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const root = process.cwd();
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const sourceRoots = [
  path.join(root, "src"),
  path.join(root, "prisma"),
];

const ignoredParts = [
  "node_modules",
  ".next",
  ".git",
  ".backup",
  ".zip",
];

const allowedExt = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".json",
  ".prisma",
]);

function shouldIgnore(filePath) {
  return ignoredParts.some((part) => filePath.includes(part));
}

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (shouldIgnore(full)) continue;

    if (entry.isDirectory()) {
      walk(full, files);
      continue;
    }

    if (entry.isFile() && allowedExt.has(path.extname(full))) {
      files.push(full);
    }
  }

  return files;
}

function findMatches(files, regex) {
  const rows = [];

  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    const lines = text.split(/\r?\n/);

    lines.forEach((line, index) => {
      if (regex.test(line)) {
        rows.push({
          file: path.relative(root, file),
          line: index + 1,
          text: line.trim(),
        });
      }
      regex.lastIndex = 0;
    });
  }

  return rows;
}

try {
  const files = sourceRoots.flatMap((dir) => walk(dir));

  const oldEnterpriseRouteRefs = findMatches(
    files,
    /\/enterprise\//g
  );

  const businessVerticalRouteRefs = findMatches(
    files,
    /\/business-verticals\//g
  );

  const enterpriseRouteFolder = path.join(root, "src", "app", "enterprise");
  const enterpriseRouteFolderExists = fs.existsSync(enterpriseRouteFolder);

  const businessVerticalItems = await prisma.businessVerticalItem.findMany({
    select: {
      id: true,
      label: true,
      enterpriseSlug: true,
      targetUrl: true,
      isActive: true,
    },
    orderBy: [{ createdAt: "asc" }],
  });

  const wrongDbTargetUrls = businessVerticalItems.filter((item) => {
    if (!item.enterpriseSlug) return false;
    const expected = `/business-verticals/${item.enterpriseSlug}`;
    return item.targetUrl !== expected;
  });

  const enterpriseDbTargetUrls = businessVerticalItems.filter((item) =>
    item.targetUrl?.startsWith("/enterprise/")
  );

  const featuredProjects = await prisma.enterpriseProject.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      enterpriseSlug: true,
      isActive: true,
    },
    orderBy: [{ enterpriseSlug: "asc" }, { createdAt: "asc" }],
  });

  console.log("");
  console.log("==================================================");
  console.log("1. OLD /enterprise/ ROUTE REFERENCES IN SOURCE");
  console.log("==================================================");
  if (oldEnterpriseRouteRefs.length === 0) {
    console.log("PASS: No /enterprise/ source references found.");
  } else {
    console.table(oldEnterpriseRouteRefs);
  }

  console.log("");
  console.log("==================================================");
  console.log("2. /business-verticals/ REFERENCES IN SOURCE");
  console.log("==================================================");
  console.log(`Found references: ${businessVerticalRouteRefs.length}`);
  if (businessVerticalRouteRefs.length > 0) {
    console.table(businessVerticalRouteRefs);
  }

  console.log("");
  console.log("==================================================");
  console.log("3. OLD src/app/enterprise ROUTE FOLDER");
  console.log("==================================================");
  console.log(
    enterpriseRouteFolderExists
      ? "FOUND: src/app/enterprise still exists."
      : "PASS: src/app/enterprise folder not found."
  );

  console.log("");
  console.log("==================================================");
  console.log("4. BUSINESS VERTICAL DB TARGET URL CHECK");
  console.log("==================================================");
  if (wrongDbTargetUrls.length === 0) {
    console.log("PASS: All Business Vertical targetUrl values match /business-verticals/[slug].");
  } else {
    console.table(
      wrongDbTargetUrls.map((item) => ({
        label: item.label,
        enterpriseSlug: item.enterpriseSlug,
        currentTargetUrl: item.targetUrl,
        expectedTargetUrl: item.enterpriseSlug
          ? `/business-verticals/${item.enterpriseSlug}`
          : "[no slug]",
        isActive: item.isActive,
      }))
    );
  }

  console.log("");
  console.log("==================================================");
  console.log("5. DB ITEMS STILL USING /enterprise/");
  console.log("==================================================");
  if (enterpriseDbTargetUrls.length === 0) {
    console.log("PASS: No DB Business Vertical targetUrl uses /enterprise/.");
  } else {
    console.table(
      enterpriseDbTargetUrls.map((item) => ({
        label: item.label,
        enterpriseSlug: item.enterpriseSlug,
        targetUrl: item.targetUrl,
      }))
    );
  }

  console.log("");
  console.log("==================================================");
  console.log("6. FEATURED PROJECT PARENT SLUGS");
  console.log("==================================================");
  console.table(
    featuredProjects.map((project) => ({
      name: project.name,
      projectSlug: project.slug,
      parentSubCategorySlug: project.enterpriseSlug,
      publicExpectedUrl: `/business-verticals/${project.enterpriseSlug}/${project.slug}`,
      isActive: project.isActive,
    }))
  );

  console.log("");
  console.log("==================================================");
  console.log("FINAL SUMMARY");
  console.log("==================================================");

  console.log(`Old /enterprise/ source references: ${oldEnterpriseRouteRefs.length}`);
  console.log(`DB targetUrl mismatches: ${wrongDbTargetUrls.length}`);
  console.log(`DB /enterprise/ targetUrls: ${enterpriseDbTargetUrls.length}`);
  console.log(`src/app/enterprise exists: ${enterpriseRouteFolderExists ? "YES" : "NO"}`);
  console.log("");
} finally {
  await prisma.$disconnect();
}
