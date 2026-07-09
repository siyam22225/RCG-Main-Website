import AdminNav from "@/components/admin/AdminNav";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import AdminMessagesClient from "./AdminMessagesClient";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  await requireAdmin();

  let messages: {
    id: string;
    name: string;
    email: string;
    phone: string;
    queryType: string;
    subject: string;
    message: string;
    createdAt: string;
  }[] = [];

  try {
    const dbMessages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });

    messages = dbMessages.map((msg) => ({
      id: msg.id,
      name: msg.name,
      email: msg.email,
      phone: msg.phone,
      queryType: msg.queryType,
      subject: msg.subject,
      message: msg.message,
      createdAt: msg.createdAt.toISOString(),
    }));
  } catch (error) {
    console.error("ADMIN_MESSAGES_PAGE_ERROR", error);
  }

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
              fontWeight: 900,
              fontSize: "clamp(34px, 6vw, 58px)",
            }}
          >
            Contact Messages
          </h1>
        </div>

        <AdminMessagesClient initialMessages={messages} />
      </div>
    </section>
  );
}
