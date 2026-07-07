import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_MAIN_LOGO = {
  logoUrl: "/images/logos/Asset 14.png",
  altText: "Real Capita Group",
  isEnabled: true,
};

export async function GET() {
  try {
    const mainRows = await prisma.$queryRaw<
      { logoUrl: string; altText: string; isEnabled: boolean }[]
    >`
      SELECT "logoUrl", "altText", "isEnabled"
      FROM "WebsiteLogoSetting"
      WHERE "id" = 'main'
      LIMIT 1
    `;

    const brandLogos = await prisma.$queryRaw<
      { id: string; name: string; imageUrl: string; linkUrl: string | null; sortOrder: number }[]
    >`
      SELECT "id", "name", "imageUrl", "linkUrl", "sortOrder"
      FROM "BrandLogo"
      WHERE "isActive" = true
      ORDER BY "sortOrder" ASC, "createdAt" ASC
    `;

    const mainLogo =
      mainRows[0]?.isEnabled && mainRows[0]?.logoUrl
        ? mainRows[0]
        : DEFAULT_MAIN_LOGO;

    const response = NextResponse.json({ mainLogo, brandLogos });
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("PUBLIC_LOGO_SETTINGS_ERROR", error);
    const response = NextResponse.json({ mainLogo: DEFAULT_MAIN_LOGO, brandLogos: [] });
    response.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return response;
  }
}
