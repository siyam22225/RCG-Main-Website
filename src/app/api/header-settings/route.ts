import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getEffectiveFormerChairmanMessage } from "@/lib/formerChairman";

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

const fallbackOfficeContact = {
  email: "",
  phone: "",
};

export async function GET() {
  try {
    const [
      enterprises,
      logoRows,
      clientRows,
      formerChairmanMessage,
      officeSetting,
      businessVerticalGroups,
    ] = await Promise.all([
      prisma.$queryRaw<
        { id: string; slug: string; name: string; isActive: boolean }[]
      >`
        SELECT "id", "slug", "name", "isActive"
        FROM "Enterprise"
        WHERE "isActive" = true
        ORDER BY "sortOrder" ASC, "createdAt" ASC
      `,
      prisma.$queryRaw<
        { logoUrl: string; altText: string; isEnabled: boolean }[]
      >`
        SELECT "logoUrl", "altText", "isEnabled"
        FROM "WebsiteLogoSetting"
        WHERE "id" = 'main'
        LIMIT 1
      `,
      prisma.$queryRaw<
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
      `,
      getEffectiveFormerChairmanMessage(),
      prisma.officeSetting.findFirst({
        where: { isActive: true },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        select: {
          email: true,
          phone: true,
        },
      }),
      prisma.businessVerticalCategory.findMany({
        where: { isActive: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        select: {
          id: true,
          label: true,
          slug: true,
          displayOrder: true,
          isActive: true,
          items: {
            where: { isActive: true },
            orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
            select: {
              id: true,
              label: true,
              enterpriseSlug: true,
              targetUrl: true,
              displayOrder: true,
              isActive: true,
            },
          },
        },
      }),
    ]);

    const logo = logoRows[0]?.isEnabled && logoRows[0]?.logoUrl
      ? { logoUrl: logoRows[0].logoUrl, altText: logoRows[0].altText || "Real Capita Group" }
      : fallbackLogo;

    const client = clientRows[0];
    const formerChairmanVisible = formerChairmanMessage?.isActive !== false;
    const officeContact = officeSetting
      ? {
          email: officeSetting.email || "",
          phone: officeSetting.phone || "",
        }
      : fallbackOfficeContact;

    const response = NextResponse.json({
      enterprises: enterprises.length ? enterprises : fallbackEnterprises,
      mainLogo: logo,
      officeContact,
      businessVerticalGroups,
      pageVisibility: {
        formerChairman: formerChairmanVisible,
      },
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
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("HEADER_SETTINGS_API_ERROR", error);

    const response = NextResponse.json({
      enterprises: fallbackEnterprises,
      mainLogo: fallbackLogo,
      officeContact: fallbackOfficeContact,
      businessVerticalGroups: [],
      pageVisibility: {
        formerChairman: true,
      },
      clientLogin: { show: false },
    });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  }
}
