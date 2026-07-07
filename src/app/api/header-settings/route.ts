import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fallbackEnterprises = [
  { id: "land-rpcdl", slug: "land-rpcdl", name: "RC Property", isActive: true },
  { id: "apartment-rchl", slug: "apartment-rchl", name: "RC Holdings", isActive: true },
  { id: "hotel-rc-bay", slug: "hotel-rc-bay", name: "RC-BAY", isActive: true },
  { id: "resda", slug: "resda", name: "RESDA", isActive: true },
  { id: "afsen-group", slug: "afsen-group", name: "AFSEN Construction", isActive: true },
  { id: "abdf", slug: "abdf", name: "ABD Foundation", isActive: true },
];

const fallbackLogo = {
  logoUrl: "/images/logos/Asset 14.png",
  altText: "Real Capita Group",
};

export async function GET() {
  try {
    const enterprises = await prisma.$queryRaw<
      { id: string; slug: string; name: string; isActive: boolean }[]
    >`
      SELECT "id", "slug", "name", "isActive"
      FROM "Enterprise"
      WHERE "isActive" = true
      ORDER BY "sortOrder" ASC, "createdAt" ASC
    `;

    const logoRows = await prisma.$queryRaw<
      { logoUrl: string; altText: string; isEnabled: boolean }[]
    >`
      SELECT "logoUrl", "altText", "isEnabled"
      FROM "WebsiteLogoSetting"
      WHERE "id" = 'main'
      LIMIT 1
    `;

    const clientRows = await prisma.$queryRaw<
      {
        buttonText: string;
        buttonUrl: string;
        isEnabled: boolean;
        openInNewTab: boolean;
      }[]
    >`
      SELECT "buttonText", "buttonUrl", "isEnabled", "openInNewTab"
      FROM "ClientLoginSetting"
      WHERE "id" = 'main'
      LIMIT 1
    `;

    const logo = logoRows[0]?.isEnabled && logoRows[0]?.logoUrl
      ? { logoUrl: logoRows[0].logoUrl, altText: logoRows[0].altText || "Real Capita Group" }
      : fallbackLogo;

    const client = clientRows[0];

    const response = NextResponse.json({
      enterprises: enterprises.length ? enterprises : fallbackEnterprises,
      mainLogo: logo,
      clientLogin:
        client?.isEnabled && client?.buttonUrl
          ? {
              show: true,
              buttonText: client.buttonText || "Client Login",
              buttonUrl: client.buttonUrl,
              openInNewTab: client.openInNewTab,
            }
          : { show: false },
    });
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("HEADER_SETTINGS_API_ERROR", error);

    const response = NextResponse.json({
      enterprises: fallbackEnterprises,
      mainLogo: fallbackLogo,
      clientLogin: { show: false },
    });
    response.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
    return response;
  }
}
