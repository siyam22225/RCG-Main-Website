import Image from "next/image";
import { getAboutPageContent } from "@/lib/about-pages";

export const revalidate = 300;

export default async function MissionVisionValuesPage() {
  const content = await getAboutPageContent("mission-vision-values");

  const missionText =
    content.paragraphs[0] ||
    "Our mission is to develop trusted projects and business initiatives that create practical value for customers, partners, and communities.";

  const rawVisionText =
    content.paragraphs[1] ||
    "Our vision is to become a respected and dependable corporate group known for professional excellence, customer confidence, and sustainable progress.";

  const directValuesText = content.paragraphs[2] || "";
  const valuesMarker = "Our values are built";
  const markerIndex = rawVisionText.indexOf(valuesMarker);

  const visionText =
    !directValuesText && markerIndex >= 0
      ? rawVisionText.slice(0, markerIndex).trim()
      : rawVisionText;

  const valuesText =
    directValuesText ||
    (markerIndex >= 0
      ? rawVisionText.slice(markerIndex).trim()
      : "Our values are built on integrity, commitment, accountability, innovation, and continuous improvement.");

  return (
    <section
      style={{
        background: "linear-gradient(180deg, #f4f8fb 0%, #eef6fa 100%)",
        padding: "70px 0",
      }}
    >
      <div style={{ maxWidth: "1120px", margin: "0 auto", padding: "0 24px" }}>
        <div
          style={{
            background: "#ffffff",
            padding: "34px",
            borderRadius: "22px",
            boxShadow: "0 18px 45px rgba(15, 23, 42, 0.12)",
            border: "1px solid rgba(226, 232, 240, 0.9)",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "430px",
              marginBottom: "34px",
              borderRadius: "18px",
              overflow: "hidden",
              background: "#e5e7eb",
              boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
            }}
          >
            <Image
              src={content.imageUrl}
              alt={content.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1100px"
              style={{ objectFit: "cover" }}
            />
          </div>

          <div style={{ maxWidth: "920px" }}>
            <div
              style={{
                width: "72px",
                height: "4px",
                borderRadius: "999px",
                background: "linear-gradient(90deg, #16a34a, #2563eb)",
                marginBottom: "18px",
              }}
            />

            <h1
              style={{
                margin: "0 0 28px 0",
                fontSize: "42px",
                lineHeight: "1.15",
                letterSpacing: "-0.04em",
                color: "#0f172a",
                fontWeight: 800,
              }}
            >
              {content.title}
            </h1>

            <div
              style={{
                borderTop: "1px solid rgba(37, 99, 235, 0.12)",
                paddingTop: "24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 12px 0",
                  color: "#075c9d",
                  fontSize: "28px",
                  lineHeight: "1.25",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Mission
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "18px",
                  lineHeight: "1.9",
                  color: "#475569",
                }}
              >
                {missionText}
              </p>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(37, 99, 235, 0.12)",
                marginTop: "28px",
                paddingTop: "24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 12px 0",
                  color: "#075c9d",
                  fontSize: "28px",
                  lineHeight: "1.25",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Vision
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "18px",
                  lineHeight: "1.9",
                  color: "#475569",
                }}
              >
                {visionText}
              </p>
            </div>

            <div
              style={{
                borderTop: "1px solid rgba(37, 99, 235, 0.12)",
                marginTop: "28px",
                paddingTop: "24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 12px 0",
                  color: "#075c9d",
                  fontSize: "28px",
                  lineHeight: "1.25",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                }}
              >
                Values
              </h2>

              <p
                style={{
                  margin: 0,
                  fontSize: "18px",
                  lineHeight: "1.9",
                  color: "#475569",
                }}
              >
                {valuesText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
