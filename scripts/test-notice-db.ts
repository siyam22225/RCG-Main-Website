import "dotenv/config";
import { prisma } from "../src/lib/prisma";

function maskDatabaseUrl() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.log("DATABASE_URL loaded: NO");
    return;
  }

  try {
    const parsed = new URL(url);
    console.log("DATABASE_URL loaded: YES");
    console.log("DB host:", parsed.hostname);
    console.log("DB name:", parsed.pathname.replace("/", ""));
    console.log("DB username exists:", parsed.username ? "YES" : "NO");
    console.log("DB password exists:", parsed.password ? "YES" : "NO");
  } catch {
    console.log("DATABASE_URL loaded but invalid URL format.");
  }
}

async function main() {
  maskDatabaseUrl();

  const notice = await prisma.notice.create({
    data: {
      title: "Test Notice from Database",
      slug: "test-notice-from-database-" + Date.now(),
      category: "General Notice",
      shortDescription: "This is a database test notice.",
      details: "If this appears in admin list, database connection is working.",
      status: "published",
      isFeatured: true,
    },
  });

  const count = await prisma.notice.count();

  console.log("Created notice:", notice.title);
  console.log("Total notices:", count);
}

main()
  .catch((error) => {
    console.error("NOTICE_DB_TEST_ERROR", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
