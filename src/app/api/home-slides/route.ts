import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { safePublicMediaUrl } from "@/lib/public-media";

const FALLBACK_HERO_IMAGE = "/images/hero/slide-1.jpg";

export async function GET() {
  try {
    const slides = await prisma.homeSlide.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        id: true,
        title: true,
        subtitle: true,
        imageUrl: true,
        buttonText: true,
        buttonHref: true,
        sortOrder: true,
      },
    });

    const response = NextResponse.json({
      success: true,
      data: slides.map((slide) => ({
        ...slide,
        imageUrl: safePublicMediaUrl(slide.imageUrl, FALLBACK_HERO_IMAGE),
      })),
    });
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("PUBLIC_HOME_SLIDES_GET_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load home slides",
        data: [],
      },
      { status: 500 }
    );
  }
}
