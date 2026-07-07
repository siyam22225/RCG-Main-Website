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

async function ensureSeoRow() {
  await prisma.$executeRaw`
    INSERT INTO "SeoSetting"
      ("id", "siteTitle", "metaDescription", "metaKeywords", "ogTitle", "ogDescription", "ogImage", "googleVerificationCode", "allowIndexing")
    VALUES
      ('main', 'Real Capita Group', 'Real Capita Group official corporate website.', 'real estate, property, land, apartment, Bangladesh', 'Real Capita Group', 'Real Capita Group official corporate website.', '', '', true)
    ON CONFLICT ("id") DO NOTHING
  `;
}

export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureSeoRow();

  const rows = await prisma.$queryRaw<
    {
      id: string;
      siteTitle: string;
      metaDescription: string;
      metaKeywords: string;
      ogTitle: string;
      ogDescription: string;
      ogImage: string;
      googleVerificationCode: string;
      allowIndexing: boolean;
    }[]
  >`
    SELECT
      "id",
      "siteTitle",
      "metaDescription",
      "metaKeywords",
      "ogTitle",
      "ogDescription",
      "ogImage",
      "googleVerificationCode",
      "allowIndexing"
    FROM "SeoSetting"
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

  await ensureSeoRow();

  const body = await req.json();

  const siteTitle = cleanText(body.siteTitle) || "Real Capita Group";
  const metaDescription = cleanText(body.metaDescription);
  const metaKeywords = cleanText(body.metaKeywords);
  const ogTitle = cleanText(body.ogTitle) || siteTitle;
  const ogDescription = cleanText(body.ogDescription) || metaDescription;
  const ogImage = cleanText(body.ogImage);
  const googleVerificationCode = cleanText(body.googleVerificationCode);
  const allowIndexing = body.allowIndexing !== false;

  const rows = await prisma.$queryRaw<
    {
      id: string;
      siteTitle: string;
      metaDescription: string;
      metaKeywords: string;
      ogTitle: string;
      ogDescription: string;
      ogImage: string;
      googleVerificationCode: string;
      allowIndexing: boolean;
    }[]
  >`
    UPDATE "SeoSetting"
    SET
      "siteTitle" = ${siteTitle},
      "metaDescription" = ${metaDescription},
      "metaKeywords" = ${metaKeywords},
      "ogTitle" = ${ogTitle},
      "ogDescription" = ${ogDescription},
      "ogImage" = ${ogImage},
      "googleVerificationCode" = ${googleVerificationCode},
      "allowIndexing" = ${allowIndexing},
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE "id" = 'main'
    RETURNING
      "id",
      "siteTitle",
      "metaDescription",
      "metaKeywords",
      "ogTitle",
      "ogDescription",
      "ogImage",
      "googleVerificationCode",
      "allowIndexing"
  `;

  return NextResponse.json({ setting: rows[0] });
}
