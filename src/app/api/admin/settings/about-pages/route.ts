import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

type AboutPageRow = {
  id: string;
  pageKey: string;
  title: string;
  imageUrl: string;
  paragraphs: unknown;
  isActive: boolean;
  updatedAt: Date;
};

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

function paragraphsFromText(value: unknown) {
  return cleanText(value)
    .split(/\n\s*\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const pages = await prisma.$queryRaw<AboutPageRow[]>`
    SELECT "id", "pageKey", "title", "imageUrl", "paragraphs", "isActive", "updatedAt"
    FROM "AboutPageContent"
    ORDER BY
      CASE
        WHEN "pageKey" = 'corporate-profile' THEN 1
        WHEN "pageKey" = 'mission-vision-values' THEN 2
        ELSE 3
      END ASC
  `;

  return NextResponse.json({ pages });
}

export async function PUT(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const pageKey = cleanText(body.pageKey);
  const title = cleanText(body.title);
  const imageUrl = cleanText(body.imageUrl);
  const paragraphs = Array.isArray(body.paragraphs)
    ? body.paragraphs.map(cleanText).filter(Boolean)
    : paragraphsFromText(body.paragraphsText);
  const isActive = body.isActive !== false;

  if (!pageKey || !title || !imageUrl || paragraphs.length === 0) {
    return NextResponse.json(
      { error: "Page key, title, image, and at least one paragraph are required." },
      { status: 400 }
    );
  }

  const rows = await prisma.$queryRaw<AboutPageRow[]>`
    UPDATE "AboutPageContent"
    SET
      "title" = ${title},
      "imageUrl" = ${imageUrl},
      "paragraphs" = CAST(${JSON.stringify(paragraphs)} AS JSONB),
      "isActive" = ${isActive},
      "updatedAt" = CURRENT_TIMESTAMP
    WHERE "pageKey" = ${pageKey}
    RETURNING "id", "pageKey", "title", "imageUrl", "paragraphs", "isActive", "updatedAt"
  `;

  if (!rows[0]) {
    return NextResponse.json({ error: "About page not found." }, { status: 404 });
  }

  return NextResponse.json({ page: rows[0] });
}
