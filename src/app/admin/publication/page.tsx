import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminPublicationPage() {
  await requireAdmin();

  return (
    <main style={{ minHeight: "100vh", background: "#eef8fd", padding: "28px 24px" }}>
      <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
        <AdminNav />

        <section
          style={{
            marginTop: "28px",
            background: "#ffffff",
            borderRadius: "24px",
            padding: "32px",
            boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
          }}
        >
          <p style={{ color: "#075c9d", fontWeight: 900, textTransform: "uppercase" }}>
            Media
          </p>
          <h1 style={{ marginTop: "8px", fontSize: "34px", color: "#0f172a" }}>
            Publication
          </h1>
          <p style={{ marginTop: "12px", color: "#475569", fontSize: "17px" }}>
            Publication management will be added here with title, category, PDF/document upload,
            thumbnail, publish date, and download/view controls.
          </p>
        </section>
      </div>
    </main>
  );
}
