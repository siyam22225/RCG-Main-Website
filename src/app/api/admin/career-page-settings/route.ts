import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

const defaults = {
  id: "main",
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

function clean(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function cleanPositions(value: unknown) {
  if (!Array.isArray(value)) return "[]";

  const items = value
    .filter((item) => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 50);

  return JSON.stringify(items);
}

async function ensureTable() {
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
      'main', ${defaults.sectionTag}, ${defaults.headline}, ${defaults.introText},
      ${defaults.point1}, ${defaults.point2}, ${defaults.point3}, ${defaults.point4},
      ${defaults.currentOpenTitle}, ${defaults.noVacancyText},
      ${defaults.applyTag}, ${defaults.applyTitle}, ${defaults.applyIntro},
      ${defaults.openApplicationLabel}, ${defaults.preferredPositionLabel},
      ${defaults.preferredPositionPlaceholder}, ${defaults.customPositions}
    )
    ON CONFLICT ("id") DO NOTHING;
  `;
}

async function getSettings() {
  await ensureTable();

  const rows = await prisma.$queryRawUnsafe<(typeof defaults)[]>(`
    SELECT
      "id", "sectionTag", "headline", "introText",
      "point1", "point2", "point3", "point4",
      "currentOpenTitle", "noVacancyText",
      "applyTag", "applyTitle", "applyIntro",
      "openApplicationLabel", "preferredPositionLabel",
      "preferredPositionPlaceholder", "customPositions"
    FROM "CareerPageSetting"
    WHERE "id" = 'main'
    LIMIT 1;
  `);

  return rows[0] || defaults;
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const settings = await getSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("ADMIN_CAREER_PAGE_SETTINGS_GET_ERROR", error);
    return NextResponse.json({ message: "Failed to load career page settings." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(request);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    await ensureTable();

    const body = await request.json();

    const data = {
      sectionTag: clean(body.sectionTag, defaults.sectionTag),
      headline: clean(body.headline, defaults.headline),
      introText: clean(body.introText, defaults.introText),
      point1: clean(body.point1, defaults.point1),
      point2: clean(body.point2, defaults.point2),
      point3: clean(body.point3, defaults.point3),
      point4: clean(body.point4, defaults.point4),
      currentOpenTitle: clean(body.currentOpenTitle, defaults.currentOpenTitle),
      noVacancyText: clean(body.noVacancyText, defaults.noVacancyText),
      applyTag: clean(body.applyTag, defaults.applyTag),
      applyTitle: clean(body.applyTitle, defaults.applyTitle),
      applyIntro: clean(body.applyIntro, defaults.applyIntro),
      openApplicationLabel: clean(body.openApplicationLabel, defaults.openApplicationLabel),
      preferredPositionLabel: clean(body.preferredPositionLabel, defaults.preferredPositionLabel),
      preferredPositionPlaceholder: clean(
        body.preferredPositionPlaceholder,
        defaults.preferredPositionPlaceholder
      ),
      customPositions: cleanPositions(body.customPositions),
    };

    await prisma.$executeRaw`
      UPDATE "CareerPageSetting"
      SET
        "sectionTag" = ${data.sectionTag},
        "headline" = ${data.headline},
        "introText" = ${data.introText},
        "point1" = ${data.point1},
        "point2" = ${data.point2},
        "point3" = ${data.point3},
        "point4" = ${data.point4},
        "currentOpenTitle" = ${data.currentOpenTitle},
        "noVacancyText" = ${data.noVacancyText},
        "applyTag" = ${data.applyTag},
        "applyTitle" = ${data.applyTitle},
        "applyIntro" = ${data.applyIntro},
        "openApplicationLabel" = ${data.openApplicationLabel},
        "preferredPositionLabel" = ${data.preferredPositionLabel},
        "preferredPositionPlaceholder" = ${data.preferredPositionPlaceholder},
        "customPositions" = ${data.customPositions},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = 'main';
    `;

    const settings = await getSettings();
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("ADMIN_CAREER_PAGE_SETTINGS_PUT_ERROR", error);
    return NextResponse.json({ message: "Failed to update career page settings." }, { status: 500 });
  }
}
