import type { CSSProperties } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import AdminNav from "@/components/admin/AdminNav";
import DeleteBlogButton from "@/components/admin/DeleteBlogButton";

export const dynamic = "force-dynamic";

function formatDate(value: Date | string | null) {
  if (!value) return "Not published";

  return new Date(value).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function AdminBlogsPage() {
  await requireAdmin();

  let blogPosts: Awaited<ReturnType<typeof prisma.blogPost.findMany>> = [];

  try {
    blogPosts = await prisma.blogPost.findMany({
      orderBy: [{ createdAt: "desc" }],
    });
  } catch (error) {
    console.error("ADMIN_BLOGS_PAGE_ERROR", error);
  }

  return (
    <section style={{ padding: "48px 0 70px", background: "transparent" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        <AdminNav />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p style={eyebrowStyle}>Admin Panel</p>
            <h1 style={headingStyle}>Blog Management</h1>
          </div>

          <Link href="/admin/blogs/new" style={primaryLinkStyle}>
            New Blog
          </Link>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.94)",
            borderRadius: "24px",
            overflow: "hidden",
            border: "1px solid rgba(21,150,212,0.08)",
            boxShadow: "0 14px 34px rgba(15,23,42,0.08)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "980px" }}>
              <thead>
                <tr style={{ background: "#f8fbff" }}>
                  {[
                    "Title",
                    "Slug",
                    "Category",
                    "Status",
                    "Published",
                    "Created",
                    "Edit",
                    "Delete",
                  ].map((head) => (
                    <th key={head} style={headCellStyle}>
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {blogPosts.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ ...cellStyle, color: "#64748b" }}>
                      No blog posts found.
                    </td>
                  </tr>
                ) : (
                  blogPosts.map((post) => (
                    <tr key={post.id}>
                      <td style={{ ...cellStyle, color: "#0f172a", fontWeight: 800 }}>
                        {post.title}
                      </td>
                      <td style={cellStyle}>{post.slug}</td>
                      <td style={cellStyle}>{post.category || "Uncategorized"}</td>
                      <td style={cellStyle}>
                        <span
                          style={{
                            display: "inline-flex",
                            borderRadius: "999px",
                            padding: "6px 10px",
                            background:
                              post.status === "published" ? "#dcfce7" : "#f1f5f9",
                            color:
                              post.status === "published" ? "#166534" : "#475569",
                            fontWeight: 900,
                            textTransform: "capitalize",
                          }}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td style={cellStyle}>{formatDate(post.publishedAt)}</td>
                      <td style={cellStyle}>{formatDate(post.createdAt)}</td>
                      <td style={cellStyle}>
                        <Link
                          href={`/admin/blogs/${post.id}/edit`}
                          style={{ color: "#059669", textDecoration: "none", fontWeight: 700 }}
                        >
                          Edit
                        </Link>
                      </td>
                      <td style={cellStyle}>
                        <DeleteBlogButton id={post.id} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
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

const primaryLinkStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "12px 18px",
  background: "linear-gradient(90deg, #0f9d7a 0%, #1d9bf0 100%)",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 800,
};

const headCellStyle: CSSProperties = {
  textAlign: "left",
  padding: "16px 18px",
  fontSize: "14px",
  color: "#0f172a",
  borderBottom: "1px solid #e5e7eb",
};

const cellStyle: CSSProperties = {
  padding: "16px 18px",
  fontSize: "14px",
  color: "#475569",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "top",
};
