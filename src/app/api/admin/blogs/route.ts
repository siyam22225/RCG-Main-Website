import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const blogStatusSchema = z.enum(["draft", "published"]);

const blogPostSchema = z.object({
  title: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  excerpt: z.string().trim().min(1),
  content: z.string().trim().min(1),
  imageUrl: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  status: blogStatusSchema,
  isFeatured: z.boolean().optional(),
  publishedAt: z.string().trim().optional().nullable(),
  metaTitle: z.string().trim().optional().nullable(),
  metaDescription: z.string().trim().optional().nullable(),
});

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function nullableText(value: string | null | undefined) {
  const text = String(value || "").trim();
  return text || null;
}

function parsePublishedAt(value: string | null | undefined) {
  const text = String(value || "").trim();
  if (!text) return null;

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: [{ createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, data: posts }, { status: 200 });
  } catch (error) {
    console.error("ADMIN_BLOGS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const parsed = blogPostSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid blog post data" },
        { status: 400 }
      );
    }

    const slug = normalizeSlug(parsed.data.slug);

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Invalid blog post slug" },
        { status: 400 }
      );
    }

    const existing = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Slug already exists" },
        { status: 409 }
      );
    }

    const explicitPublishedAt = parsePublishedAt(parsed.data.publishedAt);
    const publishedAt =
      parsed.data.status === "published"
        ? explicitPublishedAt || new Date()
        : explicitPublishedAt;

    const saved = await prisma.blogPost.create({
      data: {
        title: parsed.data.title,
        slug,
        excerpt: parsed.data.excerpt,
        content: parsed.data.content,
        imageUrl: nullableText(parsed.data.imageUrl),
        category: nullableText(parsed.data.category),
        status: parsed.data.status,
        isFeatured: parsed.data.isFeatured === true,
        publishedAt,
        metaTitle: nullableText(parsed.data.metaTitle),
        metaDescription: nullableText(parsed.data.metaDescription),
      },
    });

    return NextResponse.json(
      { success: true, message: "Blog post added successfully", data: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADMIN_BLOGS_POST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
