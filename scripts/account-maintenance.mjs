import fs from "fs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function readDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;

  if (!fs.existsSync(".env")) {
    throw new Error(".env file not found and DATABASE_URL is not set.");
  }

  const env = fs.readFileSync(".env", "utf8");
  const match = env.match(/^DATABASE_URL="?([^"\n]+)"?/m);

  if (!match?.[1]) {
    throw new Error("DATABASE_URL not found in .env.");
  }

  return match[1];
}

const [, , action, emailArg] = process.argv;
const email = String(emailArg || "").trim().toLowerCase();

if (!["hide", "show"].includes(action) || !email) {
  console.error("Usage:");
  console.error("  node scripts/account-maintenance.mjs hide admin@example.com");
  console.error("  node scripts/account-maintenance.mjs show admin@example.com");
  process.exit(1);
}

const pool = new Pool({ connectionString: readDatabaseUrl() });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

try {
  const target = await prisma.adminUser.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      role: true,
      isActive: true,
      isProtected: true,
      isHiddenFromAdminPanel: true,
    },
  });

  if (!target) throw new Error("Admin user not found.");

  if (target.role !== "super_admin") {
    throw new Error("Only super_admin accounts can be changed with this maintenance command.");
  }

  if (action === "hide") {
    const visibleSuperAdmins = await prisma.adminUser.findMany({
      where: {
        role: "super_admin",
        isHiddenFromAdminPanel: false,
      },
      select: { id: true },
    });

    if (!target.isHiddenFromAdminPanel && visibleSuperAdmins.length <= 1) {
      throw new Error("Refused: at least one visible super_admin must remain in the admin panel.");
    }

    await prisma.adminUser.update({
      where: { email },
      data: { isHiddenFromAdminPanel: true },
    });

    console.log("Account maintenance completed: hidden from admin panel.");
  }

  if (action === "show") {
    await prisma.adminUser.update({
      where: { email },
      data: { isHiddenFromAdminPanel: false },
    });

    console.log("Account maintenance completed: visible in admin panel.");
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : "Account maintenance failed.");
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
  await pool.end();
}
