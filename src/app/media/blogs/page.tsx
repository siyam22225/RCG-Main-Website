const blogPosts = [
  {
    title: "How to Choose the Right Location for a Property Investment",
    category: "Real Estate Guide",
    description:
      "Location is one of the most important factors in real estate. Road access, surrounding development, utility availability, and future growth plans should be checked before making a decision.",
  },
  {
    title: "What Buyers Should Check Before Booking an Apartment",
    category: "Buyer Awareness",
    description:
      "Before booking an apartment, clients should review the project location, land documents, floor plan, payment schedule, construction timeline, and handover commitment.",
  },
  {
    title: "Why Organized Housing Projects Are Becoming Popular",
    category: "Housing Insight",
    description:
      "Planned housing projects provide better layout, community planning, utility management, road structure, and long-term value for families and investors.",
  },
  {
    title: "Commercial Space Planning for Growing Businesses",
    category: "Commercial Property",
    description:
      "A suitable commercial space should support customer access, visibility, parking, business growth, and professional environment.",
  },
  {
    title: "Understanding Project Brochures and Layout Plans",
    category: "Client Education",
    description:
      "Project brochures and layout plans help clients understand unit size, orientation, facilities, common areas, and the overall planning quality of a development.",
  },
  {
    title: "Real Estate Development and Long-Term Value Creation",
    category: "Market Perspective",
    description:
      "Strong real estate development focuses not only on construction, but also on location value, planning quality, legal clarity, and sustainable client trust.",
  },
];

export default function BlogsPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#f8fbff" }}>
      <section
        style={{
          padding: "96px 24px 72px",
          background: "linear-gradient(135deg, #0f172a 0%, #075c9d 55%, #0f9f6e 100%)",
          color: "#ffffff",
        }}
      >
        <div style={{ maxWidth: "1180px", margin: "0 auto" }}>
          <p style={{ letterSpacing: "0.18em", fontWeight: 900, textTransform: "uppercase" }}>
            Real Estate Insights
          </p>
          <h1 style={{ marginTop: "18px", fontSize: "56px", lineHeight: 1.05, maxWidth: "760px" }}>
            Blogs and Property Updates
          </h1>
          <p style={{ marginTop: "22px", maxWidth: "760px", fontSize: "19px", lineHeight: 1.8 }}>
            Read practical articles about property selection, housing projects,
            apartment buying, commercial spaces, real estate planning, and client-focused
            development insights from Real Capita Group.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: "1180px", margin: "0 auto", padding: "64px 24px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {blogPosts.map((post) => (
            <article
              key={post.title}
              style={{
                background: "#ffffff",
                borderRadius: "24px",
                padding: "30px",
                boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
                border: "1px solid rgba(148, 163, 184, 0.18)",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  padding: "8px 14px",
                  borderRadius: "999px",
                  background: "#eefdf5",
                  color: "#08784f",
                  fontWeight: 900,
                  fontSize: "13px",
                }}
              >
                {post.category}
              </span>

              <h2 style={{ marginTop: "18px", color: "#0f172a", fontSize: "24px", lineHeight: 1.25 }}>
                {post.title}
              </h2>

              <p style={{ marginTop: "14px", color: "#475569", lineHeight: 1.8 }}>
                {post.description}
              </p>

              <p style={{ marginTop: "22px", color: "#075c9d", fontWeight: 900 }}>
                Full article will be published soon
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
