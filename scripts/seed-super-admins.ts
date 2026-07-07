import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

const ADMIN_PASSWORD_MIN_LENGTH = 12;

function readSuperAdminConfig(index: number) {
  const emailEnv = `SUPER_ADMIN_${index}_EMAIL`;
  const passwordEnv = `SUPER_ADMIN_${index}_PASSWORD`;
  const nameEnv = `SUPER_ADMIN_${index}_NAME`;

  const email = process.env[emailEnv]?.trim().toLowerCase();
  const rawPassword = process.env[passwordEnv];
  const name = process.env[nameEnv]?.trim() || null;

  if (!email && !rawPassword) {
    return null;
  }

  if (!email || !rawPassword) {
    throw new Error(`${emailEnv} and ${passwordEnv} must both be set.`);
  }

  if (rawPassword.length < ADMIN_PASSWORD_MIN_LENGTH) {
    throw new Error(
      `${passwordEnv} must be at least ${ADMIN_PASSWORD_MIN_LENGTH} characters.`
    );
  }

  return { email, name, rawPassword };
}

async function main() {
  const superAdmins = [1, 2]
    .map((index) => readSuperAdminConfig(index))
    .filter((admin): admin is NonNullable<typeof admin> => Boolean(admin));

  if (superAdmins.length === 0) {
    console.log("Skipping super admin seed: no SUPER_ADMIN_* env vars configured.");
    return;
  }

  for (const admin of superAdmins) {
    const hashedPassword = await bcrypt.hash(admin.rawPassword, 10);

    await prisma.adminUser.upsert({
      where: { email: admin.email },
      update: {
        name: admin.name,
        password: hashedPassword,
        role: "super_admin",
        isProtected: true,
        isActive: true,
      },
      create: {
        email: admin.email,
        name: admin.name,
        password: hashedPassword,
        role: "super_admin",
        isProtected: true,
        isActive: true,
        isHiddenFromAdminPanel: false,
      },
    });
  }

  console.log(`Protected super admin seed completed for ${superAdmins.length} account(s).`);
}

main()
  .catch((error) => {
    console.error("SEED_SUPER_ADMINS_ERROR", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
