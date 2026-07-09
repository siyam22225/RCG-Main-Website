import AdminNav from "@/components/admin/AdminNav";
import { requireAdmin } from "@/lib/require-admin";
import FeaturedProjectsAdminClient from "./FeaturedProjectsAdminClient";

export default async function EnterpriseProjectsAdminPage() {
  await requireAdmin();

  return (
    <>
      <section style={{ padding: "28px 24px 0", background: "#eef8fd" }}>
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <AdminNav />
        </div>
      </section>
      <FeaturedProjectsAdminClient />
    </>
  );
}
