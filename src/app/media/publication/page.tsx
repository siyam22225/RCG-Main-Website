const publications = [
  {
    title: "Company Profile",
    category: "Corporate Document",
    description:
      "An overview of Real Capita Group, including company background, business areas, service focus, and organizational values.",
  },
  {
    title: "Real Estate Project Brochure",
    category: "Project Brochure",
    description:
      "A summarized presentation of featured housing, apartment, and commercial real estate projects with key project information.",
  },
  {
    title: "Land and Housing Information Guide",
    category: "Property Guide",
    description:
      "A practical guide for clients who want to understand land selection, housing project planning, location value, and buyer considerations.",
  },
  {
    title: "Apartment Booking and Handover Guide",
    category: "Client Support",
    description:
      "A client-focused document explaining apartment booking steps, payment milestones, documentation, construction updates, and handover expectations.",
  },
  {
    title: "Corporate Compliance and Certification",
    category: "Compliance",
    description:
      "Official information related to quality standards, certification, compliance practices, and corporate credibility.",
  },
  {
    title: "Investment and Property Advisory Note",
    category: "Advisory",
    description:
      "A basic publication for clients interested in real estate investment, future growth areas, and long-term property planning.",
  },
];

export default function PublicationPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fbff" }}>
      <section
        style={{
          padding: "96px 24px 72px",
          background: "linear-gradient(135deg, #075c9d 0%, #0f9f6e 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <p style={{ letterSpacing: "0.18em", fontWeight: 900, textTransform: "uppercase" }}>
            Media Library
          </p>
          <h1 style={{ marginTop: "18px", fontSize: "56px", lineHeight: 1.05, maxWidth: "760px" }}>
            Publications and Corporate Documents
          </h1>
          <p style={{ marginTop: "22px", maxWidth: "760px", fontSize: "19px", lineHeight: 1.8 }}>
            Explore Real Capita Group publications, project brochures, company profile,
            real estate guides, and official corporate documents prepared for clients,
            partners, and stakeholders.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: "1180px", margin: "0 auto", padding: "64px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {publications.map((item) => (
            <article
              key={item.title}
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "28px",
                boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
                border: "1px solid rgba(148, 163, 184, 0.18)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background: "#eaf4ff",
                  color: "#075c9d",
                  fontWeight: 900,
                  fontSize: "13px",
                }}
              >
                {item.category}
              </span>

              <h2 style={{ marginTop: "18px", color: "#0f172a", fontSize: "24px" }}>
                {item.title}
              </h2>

              <p style={{ marginTop: "12px", color: "#475569", lineHeight: 1.75 }}>
                {item.description}
              </p>

              <p style={{ marginTop: "22px", color: "#0f9f6e", fontWeight: 900 }}>
                Document will be available soon
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
