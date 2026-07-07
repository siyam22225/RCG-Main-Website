import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";

type EnterpriseRow = {
  slug: string;
  updatedAt: Date;
};

type ProjectRow = {
  enterpriseSlug: string;
  slug: string;
  updatedAt: Date;
};

type NewsRow = {
  slug: string;
  updatedAt: Date;
};

function url(path: string) {
  return `${siteUrl}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/about/corporate-profile"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/about/mission-vision-values"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: url("/message"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/message/board-of-directors"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: url("/message/former-chairman"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: url("/enterprise"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: url("/media"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/media/news"), lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: url("/media/photos"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: url("/media/videos"), lastModified: now, changeFrequency: "weekly", priority: 0.6 },
    { url: url("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  let enterpriseRoutes: MetadataRoute.Sitemap = [];
  let projectRoutes: MetadataRoute.Sitemap = [];
  let newsRoutes: MetadataRoute.Sitemap = [];

  try {
    const enterprises = await prisma.$queryRaw<EnterpriseRow[]>`
      SELECT "slug", "updatedAt"
      FROM "Enterprise"
      WHERE "isActive" = true
      ORDER BY "sortOrder" ASC, "createdAt" ASC
    `;

    enterpriseRoutes = enterprises.map((item) => ({
      url: url(`/enterprise/${item.slug}`),
      lastModified: item.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {}

  try {
    const projects = await prisma.$queryRaw<ProjectRow[]>`
      SELECT "enterpriseSlug", "slug", "updatedAt"
      FROM "EnterpriseProject"
      WHERE "isActive" = true
      ORDER BY "displayOrder" ASC, "createdAt" ASC
    `;

    projectRoutes = projects.map((item) => ({
      url: url(`/enterprise/${item.enterpriseSlug}/${item.slug}`),
      lastModified: item.updatedAt || now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
  } catch {}

  try {
    const news = await prisma.$queryRaw<NewsRow[]>`
      SELECT "slug", "updatedAt"
      FROM "News"
      ORDER BY "publishedAt" DESC, "createdAt" DESC
    `;

    newsRoutes = news.map((item) => ({
      url: url(`/media/${item.slug}`),
      lastModified: item.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.6,
    }));
  } catch {}

  return [...staticRoutes, ...enterpriseRoutes, ...projectRoutes, ...newsRoutes];
}
