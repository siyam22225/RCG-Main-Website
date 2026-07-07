import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await prisma.$queryRaw<
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

    const setting = rows[0];

    if (!setting || !setting.isEnabled || !setting.buttonUrl) {
      return NextResponse.json({ show: false });
    }

    return NextResponse.json({
      show: true,
      buttonText: setting.buttonText || "Client Login",
      buttonUrl: setting.buttonUrl,
      openInNewTab: setting.openInNewTab,
    });
  } catch (error) {
    console.error("CLIENT_LOGIN_PUBLIC_API_ERROR", error);
    return NextResponse.json({ show: false });
  }
}
