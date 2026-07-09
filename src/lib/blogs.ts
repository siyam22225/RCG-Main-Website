import { prisma } from "@/lib/prisma";

export async function getPublishedBlogs() {
  return prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      imageUrl: true,
      category: true,
      isFeatured: true,
      publishedAt: true,
      createdAt: true,
    },
  });
}

export async function getPublishedBlogBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: {
      slug,
      status: "published",
    },
  });
}
