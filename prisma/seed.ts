import bcrypt from "bcryptjs";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const ADMIN_PASSWORD_MIN_LENGTH = 12;

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

async function seedAdminIfConfigured() {
  const adminConfig = readAdminSeedConfig();

  if (!adminConfig) {
    console.log(
      "Skipping admin seed: CREATE_ADMIN_EMAIL and CREATE_ADMIN_PASSWORD are not set."
    );
    return;
  }

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminConfig.email },
  });

  if (existingAdmin && !adminConfig.overwrite) {
    console.log(
      "Skipping admin seed: configured admin already exists. Set CREATE_ADMIN_OVERWRITE=true to update it."
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

    console.log("Admin seed updated the configured protected super admin.");
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

  console.log("Admin seed created the configured protected super admin.");
}

async function main() {
  await prisma.news.createMany({
    data: [
      {
        title: "Project and customer service updates published",
        slug: "project-and-customer-service-updates",
        excerpt:
          "Latest updates highlight progress, service improvement, and better communication with clients.",
        content:
          "Real Capita Group has published new updates focused on project progress, customer communication, and service quality improvement.",
        imageUrl: "/images/news/photo-1.jpg",
      },
      {
        title: "Corporate office announces seasonal campaign",
        slug: "corporate-office-announces-seasonal-campaign",
        excerpt:
          "A new campaign has been introduced to improve brand visibility and customer engagement across channels.",
        content:
          "The corporate office has announced a new seasonal campaign designed to improve communication and outreach.",
        imageUrl: "/images/news/photo-2.jpg",
      },
      {
        title: "Real Capita shares updated service commitments",
        slug: "real-capita-shares-updated-service-commitments",
        excerpt:
          "The company published a fresh communication on service standards, transparency, and customer support.",
        content:
          "Real Capita Group has shared a new statement about service commitments and support quality.",
        imageUrl: "/images/news/photo-3.jpg",
      },
      {
        title: "Community support and social initiative",
        slug: "community-support-and-social-initiative",
        excerpt:
          "A new initiative has been launched to support community-oriented social programs.",
        content:
          "Real Capita Group continues to invest in community support through new social initiatives.",
        imageUrl: "/images/news/photo-4.jpg",
      },
      {
        title: "New enterprise milestone announced",
        slug: "new-enterprise-milestone-announced",
        excerpt:
          "A new enterprise milestone was announced as part of the group’s long-term expansion plan.",
        content:
          "The group has announced a new enterprise milestone aligned with long-term strategic growth.",
        imageUrl: "/images/news/photo-5.jpg",
      },
      {
        title: "Residential service desk enhancement completed",
        slug: "residential-service-desk-enhancement-completed",
        excerpt:
          "Customer response workflow and support communication were improved through a new service desk upgrade.",
        content:
          "Real Capita Group upgraded its residential support desk to improve efficiency and communication.",
        imageUrl: "/images/news/photo-6.jpg",
      },
    ],
    skipDuplicates: true,
  });
  await seedAdminIfConfigured();

  console.log("Seed completed successfully.");
}


main()

  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("SEED_ERROR:", e);
    await prisma.$disconnect();
    process.exit(1);
    
  });
  
