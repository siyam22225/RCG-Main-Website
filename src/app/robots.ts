import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

async function allowIndexing() {
  try {
    const rows = await prisma.$queryRaw<{ allowIndexing: boolean }[]>`
      SELECT "allowIndexing"
      FROM "SeoSetting"
      WHERE "id" = 'main'
      LIMIT 1
    `;

    return rows[0]?.allowIndexing !== false;
  } catch {
    return true;
  }
}

export default async function robots(): Promise<MetadataRoute.Robots> {
  const indexingAllowed = await allowIndexing();

  return {
    rules: indexingAllowed
      ? {
          userAgent: "*",
          allow: "/",
          disallow: [
            "/admin",
            "/admin/",
            "/admin/*",
            "/api/admin",
            "/api/admin/*",
          ],
        }
      : {
          userAgent: "*",
          disallow: "/",
        },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
