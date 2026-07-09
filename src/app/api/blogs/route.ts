import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
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

    const response = NextResponse.json({ success: true, data: posts });
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("PUBLIC_BLOGS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error", data: [] },
      { status: 500 }
    );
  }
}
