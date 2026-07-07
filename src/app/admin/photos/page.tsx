import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeletePhotoButton from "@/components/admin/DeletePhotoButton";
import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminPhotosPage() {
    await requireAdmin();
let photos: Awaited<ReturnType<typeof prisma.photo.findMany>> = [];

try {
  photos = await prisma.photo.findMany({
    orderBy: { createdAt: "desc" },
  });
} catch (error) {
  console.error("ADMIN_PHOTOS_PAGE_ERROR", error);
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
              Photos Management
            </h1>
          </div>

          <Link
            href="/admin/photos/new"
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
            Add Photo
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
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "850px" }}>
              <thead>
                <tr style={{ background: "#f8fbff" }}>
                  {["Title", "Category", "Image URL", "Delete"].map((head) => (
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
                {photos.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ padding: "24px 18px", color: "#64748b" }}>
                      No photos found.
                    </td>
                  </tr>
                ) : (
                  photos.map((item) => (
                    <tr key={item.id}>
                      <td style={cellStyle}>{item.title}</td>
                      <td style={cellStyle}>{item.category || "-"}</td>
                      <td style={cellStyle}>{item.imageUrl}</td>
                     <td style={cellStyle}>
  <DeletePhotoButton id={item.id} />
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