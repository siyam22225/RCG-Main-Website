import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown) {
  const cleaned = cleanText(value);
  return cleaned || null;
}

function cleanAutoCloseSeconds(value: unknown) {
  const seconds = Number(value);

  if (!Number.isFinite(seconds)) return 0;

  const rounded = Math.round(seconds);
  if (rounded <= 0) return 0;
  if (rounded > 60) return 60;

  return rounded;
}

async function ensurePopupTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SitePopupSetting" (
      "id" TEXT PRIMARY KEY DEFAULT 'main',
      "isActive" BOOLEAN NOT NULL DEFAULT false,
      "isTitleActive" BOOLEAN NOT NULL DEFAULT true,
      "isMessageActive" BOOLEAN NOT NULL DEFAULT true,
      "isButtonActive" BOOLEAN NOT NULL DEFAULT true,
      "title" TEXT NOT NULL DEFAULT '',
      "message" TEXT NOT NULL DEFAULT '',
      "imageUrl" TEXT,
      "buttonText" TEXT,
      "buttonHref" TEXT,
      "showOncePerSession" BOOLEAN NOT NULL DEFAULT true,
      "autoCloseSeconds" INTEGER NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await prisma.$executeRawUnsafe(`ALTER TABLE "SitePopupSetting" ADD COLUMN IF NOT EXISTS "isTitleActive" BOOLEAN NOT NULL DEFAULT true`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "SitePopupSetting" ADD COLUMN IF NOT EXISTS "isMessageActive" BOOLEAN NOT NULL DEFAULT true`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "SitePopupSetting" ADD COLUMN IF NOT EXISTS "isButtonActive" BOOLEAN NOT NULL DEFAULT true`);
  await prisma.$executeRawUnsafe(`ALTER TABLE "SitePopupSetting" ADD COLUMN IF NOT EXISTS "autoCloseSeconds" INTEGER NOT NULL DEFAULT 0`);

  await prisma.$executeRawUnsafe(`
    INSERT INTO "SitePopupSetting" ("id")
    VALUES ('main')
    ON CONFLICT ("id") DO NOTHING
  `);
}

async function getPopup() {
  const rows = await prisma.$queryRaw<
    {
      id: string;
      isActive: boolean;
      isTitleActive: boolean;
      isMessageActive: boolean;
      isButtonActive: boolean;
      title: string;
      message: string;
      imageUrl: string | null;
      buttonText: string | null;
      buttonHref: string | null;
      showOncePerSession: boolean;
      autoCloseSeconds: number;
      updatedAt: Date;
    }[]
  >`
    SELECT "id", "isActive", "isTitleActive", "isMessageActive", "isButtonActive",
           "title", "message", "imageUrl", "buttonText", "buttonHref",
           "showOncePerSession", "autoCloseSeconds", "updatedAt"
    FROM "SitePopupSetting"
    WHERE "id" = 'main'
    LIMIT 1
  `;

  return rows[0]
    ? {
        ...rows[0],
        updatedAt: rows[0].updatedAt.toISOString(),
      }
    : null;
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    await ensurePopupTable();
    return NextResponse.json({ popup: await getPopup() });
  } catch (error) {
    console.error("ADMIN_SITE_POPUP_GET_ERROR", error);
    return NextResponse.json({ message: "Failed to load popup setting." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(request);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    await ensurePopupTable();

    const body = await request.json();

    await prisma.$executeRaw`
      UPDATE "SitePopupSetting"
      SET
        "isActive" = ${Boolean(body.isActive)},
        "isTitleActive" = ${body.isTitleActive !== false},
        "isMessageActive" = ${body.isMessageActive !== false},
        "isButtonActive" = ${body.isButtonActive !== false},
        "title" = ${cleanText(body.title)},
        "message" = ${cleanText(body.message)},
        "imageUrl" = ${nullableText(body.imageUrl)},
        "buttonText" = ${nullableText(body.buttonText)},
        "buttonHref" = ${nullableText(body.buttonHref)},
        "showOncePerSession" = ${body.showOncePerSession !== false},
        "autoCloseSeconds" = ${cleanAutoCloseSeconds(body.autoCloseSeconds)},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = 'main'
    `;

    return NextResponse.json({ popup: await getPopup() });
  } catch (error) {
    console.error("ADMIN_SITE_POPUP_PUT_ERROR", error);
    return NextResponse.json({ message: "Failed to save popup setting." }, { status: 500 });
  }
}

