import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        videoUrl: true,
        thumbnail: true,
        category: true,
        sourceType: true,
        createdAt: true,
      },
    });

    const response = NextResponse.json(videos);
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("GET /api/videos error:", error);

    return NextResponse.json(
      { error: "Failed to fetch videos." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();

    const title = String(body.title || "").trim();
    const category = body.category ? String(body.category).trim() : null;
    const sourceType = String(body.sourceType || "").trim();
    const videoUrl = String(body.videoUrl || "").trim();

    if (!title || !videoUrl || !sourceType) {
      return NextResponse.json(
        { error: "Title, sourceType, and videoUrl are required." },
        { status: 400 }
      );
    }

    if (sourceType !== "youtube" && sourceType !== "raw") {
      return NextResponse.json(
        { error: "sourceType must be either youtube or raw." },
        { status: 400 }
      );
    }

    const newVideo = await prisma.video.create({
      data: {
        title,
        category,
        sourceType,
        videoUrl,
      },
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("POST /api/videos error:", error);

    return NextResponse.json(
      { error: "Failed to create video." },
      { status: 500 }
    );
  }
}
