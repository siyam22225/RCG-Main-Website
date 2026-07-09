import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/require-admin";
import BusinessVerticalSettingsClient from "./BusinessVerticalSettingsClient";

export default async function BusinessVerticalSettingsPage() {
  await requireAdmin();

  return (
    <section style={{ padding: "48px 0 70px", background: "transparent" }}>
      <div className="container" style={{ maxWidth: "1240px" }}>
        <AdminNav />

        <div style={{ marginBottom: "24px" }}>
          <p
            style={{
              margin: "0 0 10px",
              color: "#16a34a",
              fontSize: "14px",
              fontWeight: 800,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
            }}
          >
            Admin Panel
          </p>
          <h1
            style={{
              margin: 0,
              color: "#0f172a",
              fontWeight: 800,
              fontSize: "clamp(28px, 5vw, 48px)",
            }}
          >
            Business Vertical Settings
          </h1>
        </div>

        <BusinessVerticalSettingsClient />
      </div>
    </section>
  );
}
