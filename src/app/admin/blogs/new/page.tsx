import type { CSSProperties } from "react";
import AdminNav from "@/components/admin/AdminNav";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { requireAdmin } from "@/lib/require-admin";

export const dynamic = "force-dynamic";

export default async function NewBlogPage() {
  await requireAdmin();

  return (
    <section style={{ padding: "48px 0 70px", background: "transparent" }}>
      <div className="container" style={{ maxWidth: "900px" }}>
        <AdminNav />

        <div style={{ margin: "24px 0" }}>
          <p style={eyebrowStyle}>Admin Panel</p>
          <h1 style={headingStyle}>Add Blog</h1>
        </div>

        <BlogPostForm mode="create" />
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
