import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const ADMIN_PASSWORD_MIN_LENGTH = 12;

function readRequiredEnv(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

function readAdminConfig() {
  const email = readRequiredEnv("CREATE_ADMIN_EMAIL").toLowerCase();
  const password = process.env.CREATE_ADMIN_PASSWORD || "";
  const name = process.env.CREATE_ADMIN_NAME?.trim() || null;
  const overwrite = process.env.CREATE_ADMIN_OVERWRITE === "true";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("CREATE_ADMIN_EMAIL must be a valid email address.");
  }

  if (password.length < ADMIN_PASSWORD_MIN_LENGTH) {
    throw new Error(
      `CREATE_ADMIN_PASSWORD must be at least ${ADMIN_PASSWORD_MIN_LENGTH} characters.`
    );
  }

  return { email, password, name, overwrite };
}

async function main() {
  const databaseUrl = readRequiredEnv("DATABASE_URL");
  const adminConfig = readAdminConfig();

  const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });

  try {
    const existingAdmin = await prisma.adminUser.findUnique({
      where: { email: adminConfig.email },
    });

    if (existingAdmin && !adminConfig.overwrite) {
      console.log(
        "Admin creation skipped: configured admin already exists. Set CREATE_ADMIN_OVERWRITE=true to update it."
      );
      return;
    }

    const hashedPassword = await bcrypt.hash(adminConfig.password, 10);

    if (existingAdmin) {
      await prisma.adminUser.update({
        where: { email: adminConfig.email },
        data: {
          password: hashedPassword,
          name: adminConfig.name ?? existingAdmin.name,
          role: "super_admin",
          isProtected: true,
          isActive: true,
          isHiddenFromAdminPanel: false,
        },
      });

      console.log("Configured protected super admin updated.");
      return;
    }

    await prisma.adminUser.create({
      data: {
        email: adminConfig.email,
        password: hashedPassword,
        name: adminConfig.name,
        role: "super_admin",
        isProtected: true,
        isActive: true,
        isHiddenFromAdminPanel: false,
      },
    });

    console.log("Configured protected super admin created.");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(
    error instanceof Error ? error.message : "Admin creation failed."
  );
  process.exit(1);
});
