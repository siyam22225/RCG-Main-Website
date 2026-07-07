import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

const newsSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  excerpt: z.string().min(10),
  content: z.string().min(20),
  imageUrl: z.string().min(3),
  publishedAt: z.string().min(1),
});

type Props = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, { params }: Props) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = newsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid news data" },
        { status: 400 }
      );
    }

    const existingWithSlug = await prisma.news.findFirst({
      where: {
        slug: parsed.data.slug,
        NOT: { id },
      },
    });

    if (existingWithSlug) {
      return NextResponse.json(
        { success: false, message: "Slug already exists" },
        { status: 409 }
      );
    }

    const updated = await prisma.news.update({
      where: { id },
      data: {
        title: parsed.data.title,
        slug: parsed.data.slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        imageUrl: parsed.data.imageUrl,
        publishedAt: new Date(parsed.data.publishedAt),
      },
    });

    return NextResponse.json(
      { success: true, message: "News updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("NEWS_PUT_ERROR", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const invalidOrigin = requireSameOriginAdminRequest(_req);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;

    await prisma.news.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "News deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("NEWS_DELETE_ERROR", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete news" },
      { status: 500 }
    );
  }
}
