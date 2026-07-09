import { getAboutPageContent } from "@/lib/about-pages";

export const revalidate = 300;

export default async function CorporateProfilePage() {
  const content = await getAboutPageContent("corporate-profile");

  const introText =
    content.paragraphs[0] ||
    "Real Capita Group is a diversified corporate organization built on a vision of responsible growth, dependable service, and long-term business value.";

  const hasStructuredContent = content.paragraphs.length >= 4;

  const whoWeAreText =
    hasStructuredContent
      ? content.paragraphs[1]
      : "Real Capita Group brings together disciplined planning, dependable execution, and a forward-looking corporate vision under one growing business platform.";

  const businessScopeText =
    hasStructuredContent
      ? content.paragraphs[2]
      : content.paragraphs[1] ||
        "With a strong focus on planning, quality, and customer confidence, Real Capita Group works to deliver projects and services that respond to practical market needs.";

  const commitmentText =
    hasStructuredContent
      ? content.paragraphs[3]
      : content.paragraphs[2] ||
        "The organization emphasizes transparency, commitment, and continuous improvement in every area of its operation.";

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #f4f8fb 0%, #eef6fa 100%)",
        padding: "0 0 70px",
      }}
    >
      <div
        style={{
          maxWidth: "1120px",
          margin: "42px auto 0",
          padding: "0 24px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            background: "#ffffff",
            padding: "42px 40px",
            borderRadius: "28px",
            boxShadow: "0 24px 60px rgba(15, 23, 42, 0.14)",
            border: "1px solid rgba(226, 232, 240, 0.9)",
          }}
        >
          <div style={{ maxWidth: "980px" }}>
            <div
              style={{
                width: "72px",
                height: "4px",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #159447, #075c9d)",
                marginBottom: "18px",
              }}
            />

            <h1
              style={{
                margin: "0 0 20px 0",
                fontSize: "40px",
                lineHeight: "1.15",
                letterSpacing: "-0.04em",
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              {content.title}
            </h1>

            <p
              style={{
                margin: "0 0 30px 0",
                fontSize: "17px",
                lineHeight: "1.72",
                color: "#475569",
              }}
            >
              {introText}
            </p>

            <div
              style={{
                borderTop: "1px solid rgba(7, 92, 157, 0.16)",
                paddingTop: "24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 11px 0",
                  color: "#075c9d",
                  fontSize: "26px",
                  lineHeight: "1.3",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Who We Are
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  fontSize: "17px",
                  lineHeight: "1.72",
                }}
              >
                {whoWeAreText}
              </p>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(7, 92, 157, 0.16)",
                marginTop: "26px",
                paddingTop: "26px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 11px 0",
                  color: "#075c9d",
                  fontSize: "26px",
                  lineHeight: "1.3",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Our Business Scope
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  fontSize: "17px",
                  lineHeight: "1.72",
                }}
              >
                {businessScopeText}
              </p>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(7, 92, 157, 0.16)",
                marginTop: "26px",
                paddingTop: "26px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 11px 0",
                  color: "#075c9d",
                  fontSize: "26px",
                  lineHeight: "1.3",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Our Commitment
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#475569",
                  fontSize: "17px",
                  lineHeight: "1.72",
                }}
              >
                {commitmentText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
