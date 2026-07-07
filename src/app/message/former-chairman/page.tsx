import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const fallbackMessageParagraphs = [
  "Bangladesh has experienced high economic growth accompanied with rapid urbanization. We are always bettering ourselves in pursuit of long-term sustainable growth. Urban growth has resulted in a tremendous increase of energy consumption.",
  "Dhaka Metropolitan city has now turned into a densely populated, bustling city. Millions of people reside in Dhaka city, the capital of Bangladesh for service, business & other purposes. Unfortunately, the increase in housing does not correlate to the population growth.",
  "It is possible to reduce the mounting pressure of our rapidly growing population in Dhaka city largely by developing the surrounding area of Dhaka city in a controlled, pre-planned manner & by establishing permanent residential accommodation for this vast population.",
  "Real estate developers & agents are there to make your dream come true, to take you towards your dreamland. With us, we ensure that one gets the luxury of living away from noise pollution & in close proximity of all sorts of amenities such as transportation, shopping malls, banks, gardens, meditation centers as well as educational institutions. We have built a sustainable satellite township to give our stakeholders an eco-friendly living solution suited to your lifestyle. A part of delivering exceptional customer service is providing them with a knowledgeable, professional, qualified & experienced sales team to assist with all the aspects of the plot buying process.",
  "Our experienced consultants are specialized in marketing & managing Real Capita Group. Real Capita Group has been handpicked in order to give clients the best possible selection of property in “RC Maya Kanan” & “RC Rivery Village” to cater to all budget ranges & to ensure that we offer only the best.",
  "Real Capita Group: Create your own sunshine from generation to generation.",
];

const fallbackProfileItems: Array<[string, string]> = [
  ["Position", "Chairman"],
  ["Education", "B.Com (Hons), Management"],
  ["Profession", "Businessman & Contractor"],
  ["Achievements", "Recognized for leadership, dedication, and development vision."],
  [
    "Business Activities",
    "First Class Contractor in LGED & Roads & Highways department all over Dhaka City Corporation. (1981-2006)",
  ],
  ["Legacy", "A lasting contribution to structured growth and corporate trust."],
  ["Personal Qualities", "Known for integrity, vision, and commitment to excellence."],
  ["Foreign Visit", "India & KSA"],
];

function splitParagraphs(value: string | null | undefined) {
  return String(value || "")
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function parseProfileItems(value: string | null | undefined): Array<[string, string]> {
  return String(value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.includes("|") ? "|" : line.includes(":") ? ":" : "";
      if (!separator) return null;

      const [rawLabel, ...rawValueParts] = line.split(separator);
      const label = rawLabel?.trim();
      const content = rawValueParts.join(separator).trim();

      if (!label || !content) return null;
      return [label, content] as [string, string];
    })
    .filter((item): item is [string, string] => Boolean(item));
}

export default async function FormerChairmanPage() {
  const settings = await prisma.formerChairmanMessage.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (settings && settings.isActive === false) {
    notFound();
  }

  const name = settings?.name?.trim() || "Late Alhaj Md. Anower Hossain";
  const designation = settings?.designation?.trim() || "1960 – 2020";
  const image = settings?.image?.trim() || "/images/message/former-chairman.jpg";
  const pageTitle = settings?.title?.trim() || "Former Chairman Message";
  const eyebrow = settings?.eyebrow?.trim() || "Who We Are";
  const introLead =
    settings?.introLead?.trim() ||
    "A vision for planned development, responsible growth, and reliable living opportunities for future generations.";
  const articleLabel = settings?.articleLabel?.trim() || "Message";
  const articleHeading =
    settings?.articleHeading?.trim() ||
    "Building with vision, trust, and long-term responsibility.";

  const messageParagraphs = splitParagraphs(settings?.messageBody);
  const finalParagraphs =
    messageParagraphs.length > 0 ? messageParagraphs : fallbackMessageParagraphs;

  const dynamicProfileItems = parseProfileItems(settings?.profileItems);
  const finalProfileItems =
    dynamicProfileItems.length > 0 ? dynamicProfileItems : fallbackProfileItems;

  return (
    <section className="formerChairmanPage"><style>{`
        .formerChairmanPage {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          padding: 70px 0 92px;
          color: #ffffff;
          background:
            radial-gradient(circle at 10% 8%, rgba(34, 197, 94, 0.22), transparent 30%),
            radial-gradient(circle at 90% 18%, rgba(37, 99, 235, 0.24), transparent 34%),
            linear-gradient(135deg, #071827 0%, #0b2f50 48%, #061222 100%);
        }

        .formerChairmanPage::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.045), transparent 36%, rgba(255,255,255,0.035)),
            radial-gradient(circle at 50% 100%, rgba(255,255,255,0.075), transparent 42%);
        }

        .chairmanGlow {
          position: absolute;
          width: 300px;
          height: 300px;
          border-radius: 999px;
          filter: blur(44px);
          opacity: 0.36;
          pointer-events: none;
        }

        .chairmanGlowOne {
          left: -120px;
          top: 110px;
          background: #16a34a;
        }

        .chairmanGlowTwo {
          right: -120px;
          bottom: 110px;
          background: #2563eb;
        }

        .chairmanContainer {
          position: relative;
          z-index: 1;
          width: min(100% - 48px, 1180px);
          margin: 0 auto;
        }

        .chairmanLayout {
          display: grid;
          grid-template-columns: minmax(0, 1.12fr) minmax(350px, 430px);
          gap: 34px;
          align-items: start;
        }

        .chairmanMainColumn {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 26px;
        }

        .chairmanIntro {
          padding: 0;
          margin: 0;
          min-height: 0;
          height: auto;
          background: transparent;
          border: none;
          box-shadow: none;
        }

        .eyebrow {
          width: fit-content;
          margin: 0 0 16px;
          padding: 9px 15px;
          border-radius: 999px;
          color: #bbf7d0;
          background: rgba(34, 197, 94, 0.13);
          border: 1px solid rgba(34, 197, 94, 0.20);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }

        .chairmanIntro h1 {
          max-width: 680px;
          margin: 0;
          color: #ffffff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(42px, 5vw, 66px);
          line-height: 0.98;
          letter-spacing: -0.055em;
          font-weight: 700;
        }

        .introLead {
          max-width: 720px;
          margin: 20px 0 0;
          color: rgba(226, 232, 240, 0.84);
          font-size: 18px;
          line-height: 1.75;
          font-weight: 600;
        }

        .profileCard,
        .messageArticle {
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.075);
          box-shadow:
            0 24px 70px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.10);
          backdrop-filter: blur(12px);
        }

        .profileCard {
          border-radius: 32px;
          padding: 34px;
          position: sticky;
          top: 96px;
        }

        .profileImageFrame {
          position: relative;
          width: 250px;
          height: 250px;
          margin: 0 auto 28px;
          border-radius: 999px;
          overflow: hidden;
          border: 7px solid rgba(255, 255, 255, 0.92);
          box-shadow:
            0 20px 44px rgba(0, 0, 0, 0.34),
            0 0 0 9px rgba(255, 255, 255, 0.08);
          background: #ffffff;
        }

        .profileImage {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .profileHeading h2 {
          margin: 0;
          color: #ffffff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(28px, 3vw, 38px);
          line-height: 1.08;
          letter-spacing: -0.04em;
          font-weight: 700;
        }

        .profileHeading p {
          margin: 10px 0 24px;
          color: #dbeafe;
          font-size: 18px;
          font-weight: 900;
        }

        .profileInfoList {
          display: grid;
          gap: 12px;
        }

        .profileInfoItem {
          padding: 14px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }

        .profileInfoItem span {
          display: block;
          margin-bottom: 5px;
          color: #bbf7d0;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.13em;
          text-transform: uppercase;
        }

        .profileInfoItem strong {
          display: block;
          color: rgba(255, 255, 255, 0.92);
          font-size: 16px;
          line-height: 1.65;
          font-weight: 700;
          overflow-wrap: anywhere;
        }

        .messageArticle {
          border-radius: 30px;
          padding: 34px 38px;
        }

        .articleHeader {
          max-width: 760px;
          margin-bottom: 24px;
        }

        .articleHeader span {
          display: inline-flex;
          margin-bottom: 10px;
          color: #bbf7d0;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.16em;
          text-transform: uppercase;
        }

        .articleHeader h2 {
          margin: 0;
          color: #ffffff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: clamp(28px, 3vw, 38px);
          line-height: 1.15;
          letter-spacing: -0.045em;
          font-weight: 700;
        }

        .messageText {
          color: rgba(241, 245, 249, 0.90);
          font-size: 17px;
          line-height: 1.92;
          font-weight: 500;
        }

        .messageText p {
          margin: 0 0 20px;
        }

        .messageText p:first-child::first-letter {
          float: left;
          padding: 8px 10px 0 0;
          color: #ffffff;
          font-family: Georgia, "Times New Roman", serif;
          font-size: 58px;
          line-height: 0.82;
          font-weight: 700;
        }

        .closingLine {
          color: #ffffff !important;
          font-weight: 800 !important;
          margin-bottom: 0 !important;
        }

        @media (max-width: 900px) {
          .formerChairmanPage {
            padding: 48px 0 72px;
          }

          .chairmanContainer {
            width: min(100% - 32px, 1180px);
          }

          .chairmanLayout {
            grid-template-columns: 1fr;
          }

          .profileCard {
            position: static;
            order: 2;
          }

          .chairmanMainColumn {
            order: 1;
          }

          .messageArticle {
            order: 2;
          }
        }
      `}</style>
      <div className="chairmanGlow chairmanGlowOne" />
      <div className="chairmanGlow chairmanGlowTwo" />

      <div className="chairmanContainer">
        <div className="chairmanLayout">
          <main className="chairmanMainColumn">
            <div className="chairmanIntro">
              <p className="eyebrow">{eyebrow}</p>
              <h1>{pageTitle}</h1>
              <p className="introLead">{introLead}</p>
            </div>

            <article className="messageArticle">
              <div className="articleHeader">
                <span>{articleLabel}</span>
                <h2>{articleHeading}</h2>
              </div>

              <div className="messageText">
                {finalParagraphs.map((paragraph, index) => (
                  <p
                    key={`${paragraph}-${index}`}
                    className={
                      index === finalParagraphs.length - 1 ? "closingLine" : ""
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          </main>

          <aside className="profileCard">
            <div className="profileImageFrame">
              <img src={image} alt={name} className="profileImage" />
            </div>

            <div className="profileHeading">
              <h2>{name}</h2>
              <p>{designation}</p>
            </div>

            <div className="profileInfoList">
              {finalProfileItems.map(([label, value]) => (
                <div key={label} className="profileInfoItem">
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
      
    </section>
  );
}

