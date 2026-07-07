import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const origin = new URL(req.url).origin;

    const [officeRes, socialRes] = await Promise.all([
      fetch(`${origin}/api/office-settings`, { cache: "no-store" }),
      fetch(`${origin}/api/social-links`, { cache: "no-store" }),
    ]);

    const [officeJson, socialJson] = await Promise.all([
      officeRes.json().catch(() => ({ success: false, data: [] })),
      socialRes.json().catch(() => ({ success: false, data: [] })),
    ]);

    const response = NextResponse.json({
      success: true,
      offices: Array.isArray(officeJson?.data) ? officeJson.data : [],
      socialLinks: Array.isArray(socialJson?.data)
        ? socialJson.data
        : Array.isArray(socialJson?.socialLinks)
          ? socialJson.socialLinks
          : [],
    });

    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");

    return response;
  } catch (error) {
    console.error("SITE_CONTACT_SETTINGS_ERROR", error);
    return NextResponse.json(
      { success: false, offices: [], socialLinks: [] },
      { status: 200 }
    );
  }
}
