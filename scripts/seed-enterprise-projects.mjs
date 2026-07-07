import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed
      .slice(index + 1)
      .trim()
      .replace(/^["']|["']$/g, "");

    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function loadArrayFromTs(filePath, exportName) {
  let code = fs.readFileSync(filePath, "utf8");

  code = code.replace(/export type [\s\S]*?};\n\n/g, "");
  code = code.replace(
    new RegExp(`export const ${exportName}: [^=]+ =`),
    `const ${exportName} =`
  );

  return new Function(`${code}\nreturn ${exportName};`)();
}

const propertyProjects = loadArrayFromTs(
  path.join(process.cwd(), "src/data/rcPropertyProjects.ts"),
  "rcPropertyProjects"
);

const holdingsProjects = loadArrayFromTs(
  path.join(process.cwd(), "src/data/rcHoldingsProjects.ts"),
  "rcHoldingsProjects"
);

async function seedProjects(enterpriseSlug, projects) {
  for (const project of projects) {
    await prisma.enterpriseProject.upsert({
      where: {
        enterpriseSlug_slug: {
          enterpriseSlug,
          slug: project.slug,
        },
      },
      update: {
        name: project.name,
        location: project.location,
        image: project.image,
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription || [],
        media: project.media || [],
        profilePdf: project.profilePdf || "",
        websiteUrl: "",
        tour360Image: project.tour360Image || "",
        isActive: true,
        displayOrder: project.id || 0,
      },
      create: {
        enterpriseSlug,
        slug: project.slug,
        name: project.name,
        location: project.location,
        image: project.image,
        shortDescription: project.shortDescription,
        fullDescription: project.fullDescription || [],
        media: project.media || [],
        profilePdf: project.profilePdf || "",
        websiteUrl: "",
        tour360Image: project.tour360Image || "",
        isActive: true,
        displayOrder: project.id || 0,
      },
    });
  }
}

await seedProjects("land-rpcdl", propertyProjects);
await seedProjects("apartment-rchl", holdingsProjects);

console.log("Enterprise projects seeded successfully.");

await prisma.$disconnect();
await pool.end();
