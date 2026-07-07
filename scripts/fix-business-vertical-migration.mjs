import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const itemTables = await prisma.$queryRawUnsafe(`
    SELECT table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    GROUP BY table_name
    HAVING
      bool_or(column_name = 'label')
      AND bool_or(column_name = 'enterpriseSlug')
      AND bool_or(column_name = 'targetUrl');
  `);

  if (!itemTables.length) {
    throw new Error("Business Vertical item table not found.");
  }

  const itemTable = itemTables[0].table_name;

  const mappings = [
    ["RC Property", "land-rpcdl", "/business-verticals/land-rpcdl"],
    ["RC Holdings", "apartment-rchl", "/business-verticals/apartment-rchl"],
    ["RC Bay", "hotel-rc-bay", "/business-verticals/hotel-rc-bay"],
    ["RESDA", "resda", "/business-verticals/resda"],
    ["AFSEN Construction", "afsen-group", "/business-verticals/afsen-group"],
    ["ABD Foundation", "abdf", "/business-verticals/abdf"],
  ];

  for (const [label, enterpriseSlug, targetUrl] of mappings) {
    const updated = await prisma.$executeRawUnsafe(
      `UPDATE "${itemTable}"
       SET "enterpriseSlug" = $1,
           "targetUrl" = $2,
           "updatedAt" = CURRENT_TIMESTAMP
       WHERE "label" = $3`,
      enterpriseSlug,
      targetUrl,
      label
    );

    console.log(`${label}: ${updated} row updated`);
  }

  const leftoverRouteFix = await prisma.$executeRawUnsafe(
    `UPDATE "${itemTable}"
     SET "targetUrl" = regexp_replace("targetUrl", '^/enterprise/', '/business-verticals/'),
         "updatedAt" = CURRENT_TIMESTAMP
     WHERE "targetUrl" LIKE '/enterprise/%'`
  );

  console.log(`Remaining old /enterprise/ item links fixed: ${leftoverRouteFix}`);

  const slideTables = await prisma.$queryRawUnsafe(`
    SELECT table_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    GROUP BY table_name
    HAVING bool_or(column_name = 'buttonHref');
  `);

  for (const row of slideTables) {
    const slideUpdated = await prisma.$executeRawUnsafe(
      `UPDATE "${row.table_name}"
       SET "buttonHref" = regexp_replace("buttonHref", '^/enterprise/', '/business-verticals/')
       WHERE "buttonHref" LIKE '/enterprise/%'`
    );

    if (slideUpdated > 0) {
      console.log(`${row.table_name}: ${slideUpdated} old slide route fixed`);
    }
  }

  console.log("DONE: Business Vertical route/slug mismatch fixed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
