import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function GET(_req: Request, { params }: Props) {
  try {
    const { slug } = await params;

    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: "published",
      },
    });

    if (!post) {
      return NextResponse.json(
        { success: false, message: "Blog post not found" },
        { status: 404 }
      );
    }

    const response = NextResponse.json({ success: true, data: post });
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("PUBLIC_BLOG_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
