import { NextResponse } from "next/server";
import { getSiteShellData } from "@/lib/site-shell-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = NextResponse.json(await getSiteShellData());
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("SITE_SHELL_API_ERROR", error);

    const response = NextResponse.json(
      {
        header: null,
        contact: { success: false, offices: [], socialLinks: [] },
        socialLinks: [],
        popup: null,
      },
      { status: 200 }
    );
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  }
}
