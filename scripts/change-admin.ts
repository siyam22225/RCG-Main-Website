import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const ADMIN_PASSWORD_MIN_LENGTH = 12;

function readRequiredEnv(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is required.`);
  return value;
}

async function main() {
  const email = readRequiredEnv("CHANGE_ADMIN_EMAIL").toLowerCase();
  const newPassword = readRequiredEnv("CHANGE_ADMIN_PASSWORD");
  const name = process.env.CHANGE_ADMIN_NAME?.trim();

  if (newPassword.length < ADMIN_PASSWORD_MIN_LENGTH) {
    throw new Error(
      `CHANGE_ADMIN_PASSWORD must be at least ${ADMIN_PASSWORD_MIN_LENGTH} characters.`
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email },
  });

  if (!existingAdmin) {
    throw new Error("Admin user not found. Use npm run admin:create to create the first admin.");
  }

  await prisma.adminUser.update({
    where: { id: existingAdmin.id },
    data: {
      password: hashedPassword,
      ...(name ? { name } : {}),
    },
  });

  console.log("Admin password updated successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
