import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return null;

  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

async function ensureClientLoginTable() {
  await prisma.$executeRaw`
    CREATE TABLE IF NOT EXISTS "ClientLoginSetting" (
      "id" TEXT NOT NULL DEFAULT 'main',
      "buttonText" TEXT NOT NULL DEFAULT 'Client Login',
      "buttonUrl" TEXT NOT NULL DEFAULT '',
      "isEnabled" BOOLEAN NOT NULL DEFAULT false,
      "openInNewTab" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "ClientLoginSetting_pkey" PRIMARY KEY ("id")
    )
  `;

  await prisma.$executeRaw`
    INSERT INTO "ClientLoginSetting"
      ("id", "buttonText", "buttonUrl", "isEnabled", "openInNewTab")
    VALUES
      ('main', 'Client Login', '', false, true)
    ON CONFLICT ("id") DO NOTHING
  `;
}

export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureClientLoginTable();

  const rows = await prisma.$queryRaw<
    {
      id: string;
      buttonText: string;
      buttonUrl: string;
      isEnabled: boolean;
      openInNewTab: boolean;
    }[]
  >`
    SELECT "id", "buttonText", "buttonUrl", "isEnabled", "openInNewTab"
    FROM "ClientLoginSetting"
    WHERE "id" = 'main'
    LIMIT 1
  `;

  return NextResponse.json({ setting: rows[0] });
}

export async function PUT(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureClientLoginTable();

  const body = await req.json();

  const buttonText = cleanText(body.buttonText) || "Client Login";
  const buttonUrl = cleanText(body.buttonUrl);
  const isEnabled = Boolean(body.isEnabled);
  const openInNewTab = body.openInNewTab !== false;

  const rows = await prisma.$queryRaw<
    {
      id: string;
      buttonText: string;
      buttonUrl: string;
      isEnabled: boolean;
      openInNewTab: boolean;
    }[]
  >`
    INSERT INTO "ClientLoginSetting"
      ("id", "buttonText", "buttonUrl", "isEnabled", "openInNewTab", "updatedAt")
    VALUES
      ('main', ${buttonText}, ${buttonUrl}, ${isEnabled}, ${openInNewTab}, CURRENT_TIMESTAMP)
    ON CONFLICT ("id") DO UPDATE SET
      "buttonText" = EXCLUDED."buttonText",
      "buttonUrl" = EXCLUDED."buttonUrl",
      "isEnabled" = EXCLUDED."isEnabled",
      "openInNewTab" = EXCLUDED."openInNewTab",
      "updatedAt" = CURRENT_TIMESTAMP
    RETURNING "id", "buttonText", "buttonUrl", "isEnabled", "openInNewTab"
  `;

  return NextResponse.json({ setting: rows[0] });
}
