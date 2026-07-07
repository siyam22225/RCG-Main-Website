import { prisma } from "@/lib/prisma";

export async function getLatestNews() {
  return prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
    take: 6,
  });
}

export async function getAllNews() {
  return prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
  });
}

export async function getNewsBySlug(slug: string) {
  return prisma.news.findUnique({
    where: { slug },
  });
}

export async function getOtherNews(currentSlug: string) {
  return prisma.news.findMany({
    where: {
      slug: {
        not: currentSlug,
      },
    },
    orderBy: { publishedAt: "desc" },
    take: 6,
  });
}