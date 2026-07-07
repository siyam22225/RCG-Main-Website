import { requireAdmin } from "@/lib/require-admin";
import FormerChairmanSettingsClient from "./FormerChairmanSettingsClient";

export default async function FormerChairmanSettingsPage() {
  await requireAdmin();

  return (
    <section style={{ padding: "48px 0 70px", background: "transparent" }}>
      <div className="container" style={{ maxWidth: "1120px" }}>
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
            Admin Settings
          </p>
          <h1
            style={{
              margin: 0,
              color: "#0f172a",
              fontWeight: 900,
              fontSize: "clamp(34px, 6vw, 58px)",
            }}
          >
            Former Chairman Message
          </h1>
        </div>

        <FormerChairmanSettingsClient />
      </div>
    </section>
  );
}
