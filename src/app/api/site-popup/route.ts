import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

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

export async function GET() {
  try {
    await ensurePopupTable();

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

    return NextResponse.json({
      popup: rows[0]
        ? {
            ...rows[0],
            updatedAt: rows[0].updatedAt.toISOString(),
          }
        : null,
    });
  } catch (error) {
    console.error("SITE_POPUP_GET_ERROR", error);
    return NextResponse.json({ popup: null });
  }
}
