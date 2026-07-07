import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteNewsButton from "@/components/admin/DeleteNewsButton";
import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminNewsPage() {
    await requireAdmin();
 let newsItems: Awaited<ReturnType<typeof prisma.news.findMany>> = [];
try {
  newsItems = await prisma.news.findMany({
    orderBy: { publishedAt: "desc" },
  });
} catch (error) {
  console.error("ADMIN_NEWS_PAGE_ERROR", error);
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
            <p style={{ margin: "0 0 10px 0", color: "#16a34a", fontSize: "14px", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>
              Admin Panel
            </p>
            <h1 style={{ margin: 0, color: "#0f172a", fontWeight: 800, fontSize: "clamp(28px, 5vw, 48px)" }}>
              News Management
            </h1>
          </div>

          <Link
            href="/admin/news/new"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 18px",
              background: "linear-gradient(90deg, #0f9d7a 0%, #1d9bf0 100%)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Add News
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
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
              <thead>
                <tr style={{ background: "#f8fbff" }}>
                { ["Title", "Slug", "Published", "Image", "Open", "Edit", "Delete"].map((head) => (
                    <th
                      key={head}
                      style={{
                        textAlign: "left",
                        padding: "16px 18px",
                        fontSize: "14px",
                        color: "#0f172a",
                        borderBottom: "1px solid #e5e7eb",
                      }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {newsItems.length === 0 ? (
                  <tr>
                   <td colSpan={7} style={{ padding: "24px 18px", color: "#64748b" }}>
                      No news found.
                    </td>
                  </tr>
                ) : (
                  newsItems.map((item) => (
                    <tr key={item.id}>
                      <td style={cellStyle}>{item.title}</td>
                      <td style={cellStyle}>{item.slug}</td>
                      <td style={cellStyle}>
                     {new Date(item.publishedAt).toLocaleString()}
                      </td>
                      <td style={cellStyle}>{item.imageUrl}</td>
                      <td style={cellStyle}>
                        <Link
                          href={`/media/${item.slug}`}
                          style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: 700 }}
                        >
                          View
                        </Link>
                      </td>
                      <td style={cellStyle}>
  <Link
    href={`/admin/news/${item.id}/edit`}
    style={{ color: "#059669", textDecoration: "none", fontWeight: 700 }}
  >
    Edit
  </Link>
</td>
<td style={cellStyle}>
  <DeleteNewsButton id={item.id} />
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

const cellStyle: React.CSSProperties = {
  padding: "16px 18px",
  fontSize: "14px",
  color: "#475569",
  borderBottom: "1px solid #e5e7eb",
  verticalAlign: "top",
};