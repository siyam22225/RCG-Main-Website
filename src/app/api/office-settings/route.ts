import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const offices = await prisma.officeSetting.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        key: true,
        title: true,
        address: true,
        phone: true,
        email: true,
        mapUrl: true,
        sortOrder: true,
      },
    });

    const response = NextResponse.json({
      success: true,
      data: offices,
    });
    response.headers.set("Cache-Control", "public, max-age=300, stale-while-revalidate=600");
    return response;
  } catch (error) {
    console.error("PUBLIC_OFFICE_SETTINGS_GET_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load office settings",
        data: [],
      },
      { status: 500 }
    );
  }
}
