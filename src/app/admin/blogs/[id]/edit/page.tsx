import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import BlogPostForm, { type BlogFormValues } from "@/components/admin/BlogPostForm";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
};

function toInitialValues(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  imageUrl: string | null;
  category: string | null;
  status: string;
  isFeatured: boolean;
  publishedAt: Date | null;
  metaTitle: string | null;
  metaDescription: string | null;
}): BlogFormValues {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    imageUrl: post.imageUrl || "",
    category: post.category || "",
    status: post.status === "published" ? "published" : "draft",
    isFeatured: post.isFeatured,
    publishedAt: post.publishedAt?.toISOString() || null,
    metaTitle: post.metaTitle || "",
    metaDescription: post.metaDescription || "",
  };
}

export default async function EditBlogPage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;

  let post: Awaited<ReturnType<typeof prisma.blogPost.findUnique>> = null;

  try {
    post = await prisma.blogPost.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("ADMIN_BLOG_EDIT_PAGE_ERROR", error);
  }

  if (!post) {
    notFound();
  }

  return (
    <section style={{ padding: "48px 0 70px", background: "transparent" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        <AdminNav />

        <div style={{ margin: "24px 0" }}>
          <p style={eyebrowStyle}>Admin Panel</p>
          <h1 style={headingStyle}>Edit Blog</h1>
        </div>

        <BlogPostForm
          mode="edit"
          postId={post.id}
          initialValues={toInitialValues(post)}
        />
      </div>
    </section>
  );
}

const eyebrowStyle: CSSProperties = {
  margin: "0 0 10px 0",
  color: "#16a34a",
  fontSize: "14px",
  fontWeight: 800,
  letterSpacing: "0.16em",
  textTransform: "uppercase",
};

const headingStyle: CSSProperties = {
  margin: 0,
  color: "#0f172a",
  fontWeight: 800,
  fontSize: "clamp(28px, 5vw, 48px)",
};
