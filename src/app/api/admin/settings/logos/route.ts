import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
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

async function ensureLogoRows() {
  await prisma.$executeRaw`
    INSERT INTO "WebsiteLogoSetting" ("id", "logoUrl", "altText", "isEnabled")
    VALUES ('main', '/images/logos/Asset 14.png', 'Real Capita Group', true)
    ON CONFLICT ("id") DO NOTHING
  `;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureLogoRows();

  const logoRows = await prisma.$queryRaw<
    { id: string; logoUrl: string; altText: string; isEnabled: boolean }[]
  >`
    SELECT "id", "logoUrl", "altText", "isEnabled"
    FROM "WebsiteLogoSetting"
    WHERE "id" = 'main'
    LIMIT 1
  `;

  const brandLogos = await prisma.$queryRaw<
    {
      id: string;
      name: string;
      imageUrl: string;
      linkUrl: string | null;
      isActive: boolean;
      sortOrder: number;
    }[]
  >`
    SELECT "id", "name", "imageUrl", "linkUrl", "isActive", "sortOrder"
    FROM "BrandLogo"
    ORDER BY "sortOrder" ASC, "createdAt" ASC
  `;

  return NextResponse.json({
    mainLogo: logoRows[0],
    brandLogos,
  });
}

export async function PUT(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await ensureLogoRows();

  const body = await req.json();
  const type = cleanText(body.type);

  if (type === "main") {
    const logoUrl = cleanText(body.logoUrl) || "/images/logos/Asset 14.png";
    const altText = cleanText(body.altText) || "Real Capita Group";
    const isEnabled = body.isEnabled !== false;

    const rows = await prisma.$queryRaw<
      { id: string; logoUrl: string; altText: string; isEnabled: boolean }[]
    >`
      UPDATE "WebsiteLogoSetting"
      SET "logoUrl" = ${logoUrl},
          "altText" = ${altText},
          "isEnabled" = ${isEnabled},
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = 'main'
      RETURNING "id", "logoUrl", "altText", "isEnabled"
    `;

    return NextResponse.json({ mainLogo: rows[0] });
  }

  if (type === "brand") {
    const id = cleanText(body.id);
    const name = cleanText(body.name);
    const imageUrl = cleanText(body.imageUrl);

    if (!id || !name || !imageUrl) {
      return NextResponse.json(
        { error: "Logo id, name, and image are required." },
        { status: 400 }
      );
    }

    const linkUrl = cleanText(body.linkUrl) || null;
    const isActive = body.isActive !== false;
    const sortOrder = Number(body.sortOrder || 0);

    const rows = await prisma.$queryRaw<
      {
        id: string;
        name: string;
        imageUrl: string;
        linkUrl: string | null;
        isActive: boolean;
        sortOrder: number;
      }[]
    >`
      UPDATE "BrandLogo"
      SET "name" = ${name},
          "imageUrl" = ${imageUrl},
          "linkUrl" = ${linkUrl},
          "isActive" = ${isActive},
          "sortOrder" = ${sortOrder},
          "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = ${id}
      RETURNING "id", "name", "imageUrl", "linkUrl", "isActive", "sortOrder"
    `;

    return NextResponse.json({ brandLogo: rows[0] });
  }

  return NextResponse.json({ error: "Invalid update type." }, { status: 400 });
}

export async function POST(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const id = randomUUID();
  const name = cleanText(body.name);
  const imageUrl = cleanText(body.imageUrl);

  if (!name || !imageUrl) {
    return NextResponse.json(
      { error: "Logo name and image are required." },
      { status: 400 }
    );
  }

  const linkUrl = cleanText(body.linkUrl) || null;
  const isActive = body.isActive !== false;
  const sortOrder = Number(body.sortOrder || 0);

  const rows = await prisma.$queryRaw<
    {
      id: string;
      name: string;
      imageUrl: string;
      linkUrl: string | null;
      isActive: boolean;
      sortOrder: number;
    }[]
  >`
    INSERT INTO "BrandLogo"
      ("id", "name", "imageUrl", "linkUrl", "isActive", "sortOrder")
    VALUES
      (${id}, ${name}, ${imageUrl}, ${linkUrl}, ${isActive}, ${sortOrder})
    RETURNING "id", "name", "imageUrl", "linkUrl", "isActive", "sortOrder"
  `;

  return NextResponse.json({ brandLogo: rows[0] });
}

export async function DELETE(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Logo id is required." }, { status: 400 });
  }

  await prisma.$executeRaw`
    DELETE FROM "BrandLogo"
    WHERE "id" = ${id}
  `;

  return NextResponse.json({ ok: true });
}
