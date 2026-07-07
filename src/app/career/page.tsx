import { prisma } from "@/lib/prisma";
import CareerApplyForm from "./CareerApplyForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Career | Real Capita Group",
  description: "Career opportunities and CV submission at Real Capita Group.",
};

type CareerPageSettings = {
  sectionTag: string;
  headline: string;
  introText: string;
  point1: string;
  point2: string;
  point3: string;
  point4: string;
  currentOpenTitle: string;
  noVacancyText: string;
  applyTag: string;
  applyTitle: string;
  applyIntro: string;
  openApplicationLabel: string;
  preferredPositionLabel: string;
  preferredPositionPlaceholder: string;
  customPositions: string;
};

const defaultSettings: CareerPageSettings = {
  sectionTag: "Career",
  headline: "Join Real Capita Group",
  introText:
    "Real Capita Group welcomes responsible, skilled, and motivated professionals who want to build their career with a diversified business group. Candidates may submit their CV for suitable current or future opportunities.",
  point1: "Professional and respectful work environment",
  point2: "Opportunities across multiple business verticals",
  point3: "Practical learning through real business operations",
  point4: "Career growth through discipline, teamwork, and responsibility",
  currentOpenTitle: "Current Open Positions",
  noVacancyText:
    "No active vacancy is available at this moment. Candidates may still submit an open application for future opportunities.",
  applyTag: "Apply Now",
  applyTitle: "Submit Your CV",
  applyIntro:
    "Select an available position or submit an open application with your preferred role.",
  openApplicationLabel: "Open Application / Future Opportunity",
  preferredPositionLabel: "Preferred Position",
  preferredPositionPlaceholder: "Example: Sales Executive, IT Officer, Accounts Officer",
  customPositions: "[]",
};

async function ensureCareerSettingsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CareerPageSetting" (
      "id" TEXT PRIMARY KEY DEFAULT 'main',
      "sectionTag" TEXT NOT NULL DEFAULT 'Career',
      "headline" TEXT NOT NULL DEFAULT 'Join Real Capita Group',
      "introText" TEXT NOT NULL DEFAULT '',
      "point1" TEXT NOT NULL DEFAULT '',
      "point2" TEXT NOT NULL DEFAULT '',
      "point3" TEXT NOT NULL DEFAULT '',
      "point4" TEXT NOT NULL DEFAULT '',
      "currentOpenTitle" TEXT NOT NULL DEFAULT 'Current Open Positions',
      "noVacancyText" TEXT NOT NULL DEFAULT '',
      "applyTag" TEXT NOT NULL DEFAULT 'Apply Now',
      "applyTitle" TEXT NOT NULL DEFAULT 'Submit Your CV',
      "applyIntro" TEXT NOT NULL DEFAULT '',
      "openApplicationLabel" TEXT NOT NULL DEFAULT 'Open Application / Future Opportunity',
      "preferredPositionLabel" TEXT NOT NULL DEFAULT 'Preferred Position',
      "preferredPositionPlaceholder" TEXT NOT NULL DEFAULT '',
      "customPositions" TEXT NOT NULL DEFAULT '[]',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await prisma.$executeRaw`
    INSERT INTO "CareerPageSetting" (
      "id", "sectionTag", "headline", "introText",
      "point1", "point2", "point3", "point4",
      "currentOpenTitle", "noVacancyText",
      "applyTag", "applyTitle", "applyIntro",
      "openApplicationLabel", "preferredPositionLabel",
      "preferredPositionPlaceholder", "customPositions"
    )
    VALUES (
      'main', ${defaultSettings.sectionTag}, ${defaultSettings.headline}, ${defaultSettings.introText},
      ${defaultSettings.point1}, ${defaultSettings.point2}, ${defaultSettings.point3}, ${defaultSettings.point4},
      ${defaultSettings.currentOpenTitle}, ${defaultSettings.noVacancyText},
      ${defaultSettings.applyTag}, ${defaultSettings.applyTitle}, ${defaultSettings.applyIntro},
      ${defaultSettings.openApplicationLabel}, ${defaultSettings.preferredPositionLabel},
      ${defaultSettings.preferredPositionPlaceholder}, ${defaultSettings.customPositions}
    )
    ON CONFLICT ("id") DO NOTHING;
  `;
}

function parseCustomPositions(value: string) {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item) => typeof item === "string" && item.trim()).map((item) => item.trim())
      : [];
  } catch {
    return [];
  }
}

async function getCareerPageSettings() {
  try {
    await ensureCareerSettingsTable();

    const rows = await prisma.$queryRawUnsafe<CareerPageSettings[]>(`
      SELECT
        "sectionTag", "headline", "introText",
        "point1", "point2", "point3", "point4",
        "currentOpenTitle", "noVacancyText",
        "applyTag", "applyTitle", "applyIntro",
        "openApplicationLabel", "preferredPositionLabel",
        "preferredPositionPlaceholder", "customPositions"
      FROM "CareerPageSetting"
      WHERE "id" = 'main'
      LIMIT 1;
    `);

    return rows[0] || defaultSettings;
  } catch (error) {
    console.error("PUBLIC_CAREER_SETTINGS_ERROR", error);
    return defaultSettings;
  }
}

export default async function CareerPage() {
  const settings = await getCareerPageSettings();
  const points = [settings.point1, settings.point2, settings.point3, settings.point4].filter(Boolean);
  const customPositions = parseCustomPositions(settings.customPositions);

  let vacancies: {
    id: string;
    title: string;
    department: string;
    location: string;
    jobType: string;
    shortDescription: string;
    deadline: string | null;
    maxCvSizeMb: number;
  }[] = [];

  try {
    const dbVacancies = await prisma.careerVacancy.findMany({
      where: { status: "open" },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });

    vacancies = dbVacancies.map((vacancy) => ({
      id: vacancy.id,
      title: vacancy.title,
      department: vacancy.department,
      location: vacancy.location,
      jobType: vacancy.jobType,
      shortDescription: vacancy.shortDescription,
      deadline: vacancy.deadline ? vacancy.deadline.toISOString() : null,
      maxCvSizeMb: vacancy.maxCvSizeMb || 5,
    }));
  } catch (error) {
    console.error("PUBLIC_CAREER_PAGE_DB_ERROR", error);
  }

  return (
    <main className="career-page"><style>{`
        .career-page {
          min-height: 70vh;
          background: #f5f8fb;
          color: #111827;
        }

        .career-container {
          width: min(1180px, calc(100% - 32px));
          margin: 0 auto;
        }

        .career-top-image {
          width: 100%;
          height: clamp(280px, 42vw, 500px);
          overflow: hidden;
          background: #e2e8f0;
          border-bottom: 1px solid rgba(15, 23, 42, 0.08);
        }

        .career-top-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
          filter: saturate(0.98) contrast(1.02);
        }

        .career-main-section {
          display: grid;
          grid-template-columns: 0.95fr 1.05fr;
          gap: 30px;
          align-items: start;
          padding: 56px 0 82px;
        }

        .career-info,
        .career-form-card {
          background: #ffffff;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 22px 60px rgba(15, 23, 42, 0.08);
          border-radius: 28px;
          padding: 38px;
        }

        .section-tag {
          margin: 0 0 12px;
          color: #075c9d;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
        }

        .career-info h1,
        .career-form-card h2 {
          margin: 0;
          color: #0f172a;
          font-weight: 950;
          line-height: 1.08;
          letter-spacing: -0.045em;
        }

        .career-info h1 {
          font-size: clamp(38px, 5vw, 58px);
        }

        .career-form-card h2 {
          font-size: 34px;
        }

        .career-info > p,
        .form-intro,
        .career-note p {
          margin: 18px 0 0;
          color: #475569;
          font-size: 15.5px;
          line-height: 1.78;
        }

        .career-points {
          display: grid;
          gap: 12px;
          margin-top: 26px;
        }

        .career-points div {
          display: flex;
          gap: 12px;
          align-items: center;
          padding: 13px 14px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .career-points span {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          background: linear-gradient(135deg, #075c9d, #12a06f);
          color: #ffffff;
          font-weight: 900;
        }

        .career-points p {
          margin: 0;
          color: #111827;
          font-weight: 750;
        }

        .career-note {
          margin-top: 28px;
          padding-top: 24px;
          border-top: 1px solid rgba(15, 23, 42, 0.1);
        }

        .career-note h3 {
          margin: 0;
          color: #0f172a;
          font-size: 21px;
          font-weight: 900;
        }

        .vacancy-list {
          display: grid;
          gap: 14px;
          margin-top: 18px;
        }

        .vacancy-list article {
          padding: 16px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid rgba(15, 23, 42, 0.08);
        }

        .vacancy-list h4 {
          margin: 0;
          color: #0f172a;
          font-size: 17px;
          font-weight: 900;
        }

        .vacancy-list p {
          margin: 8px 0 0;
          font-size: 14px;
        }

        .vacancy-list article div {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 12px;
        }

        .vacancy-list article div span {
          padding: 6px 10px;
          border-radius: 999px;
          background: #ffffff;
          color: #075c9d;
          font-size: 12px;
          font-weight: 850;
          border: 1px solid rgba(7, 92, 157, 0.12);
        }

        .career-form {
          display: grid;
          gap: 16px;
          margin-top: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .form-row {
          display: grid;
          gap: 7px;
        }

        .form-row.full {
          grid-column: 1 / -1;
        }

        .form-row label {
          color: #111827;
          font-size: 13px;
          font-weight: 850;
        }

        .career-form input,
        .career-form select,
        .career-form textarea {
          width: 100%;
          border: 1px solid rgba(15, 23, 42, 0.14);
          border-radius: 14px;
          padding: 13px 14px;
          background: #f8fafc;
          color: #111827;
          font: inherit;
          outline: none;
          transition: 0.18s ease;
        }

        .career-form input:focus,
        .career-form select:focus,
        .career-form textarea:focus {
          border-color: #075c9d;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(7, 92, 157, 0.1);
        }

        .cv-box {
          padding: 15px;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px dashed rgba(7, 92, 157, 0.35);
        }

        .cv-box small {
          color: #64748b;
          font-size: 12.5px;
        }

        .career-form button {
          border: 0;
          border-radius: 999px;
          padding: 15px 22px;
          background: linear-gradient(90deg, #075c9d, #12a06f);
          color: #ffffff;
          font-size: 15px;
          font-weight: 950;
          cursor: pointer;
          box-shadow: 0 14px 30px rgba(7, 92, 157, 0.18);
        }

        .career-form button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .success-message {
          margin: 0;
          color: #047857;
          font-weight: 850;
        }

        .error-message {
          margin: 0;
          color: #b91c1c;
          font-weight: 850;
        }

        @media (max-width: 980px) {
          .career-main-section {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .career-main-section {
            padding: 34px 0 58px;
          }

          .career-info,
          .career-form-card {
            padding: 24px;
            border-radius: 22px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      <section className="career-top-image">
        <img src="/images/corporate-profile.jpg" alt="Career at Real Capita Group" />
      </section>

      <section className="career-container career-main-section">
        <div className="career-info">
          <p className="section-tag">{settings.sectionTag}</p>
          <h1>{settings.headline}</h1>
          <p>{settings.introText}</p>

          <div className="career-points">
            {points.map((point) => (
              <div key={point}>
                <span>✓</span>
                <p>{point}</p>
              </div>
            ))}
          </div>

          <div className="career-note">
            <h3>{settings.currentOpenTitle}</h3>

            {vacancies.length === 0 ? (
              <p>{settings.noVacancyText}</p>
            ) : (
              <div className="vacancy-list">
                {vacancies.map((vacancy) => (
                  <article key={vacancy.id}>
                    <h4>{vacancy.title}</h4>
                    <p>{vacancy.shortDescription}</p>
                    <div>
                      <span>{vacancy.department}</span>
                      <span>{vacancy.jobType}</span>
                      <span>{vacancy.location}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="career-form-card">
          <p className="section-tag">{settings.applyTag}</p>
          <h2>{settings.applyTitle}</h2>
          <p className="form-intro">{settings.applyIntro}</p>

          <CareerApplyForm
            vacancies={vacancies}
            customPositions={customPositions}
            labels={{
              openApplicationLabel: settings.openApplicationLabel,
              preferredPositionLabel: settings.preferredPositionLabel,
              preferredPositionPlaceholder: settings.preferredPositionPlaceholder,
            }}
          />
        </aside>
      </section>

      
    </main>
  );
}
