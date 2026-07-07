import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
      data: slides,
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
