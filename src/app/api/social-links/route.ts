import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        label: true,
        href: true,
        iconUrl: true,
        sortOrder: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: links,
    });
  } catch (error) {
    console.error("PUBLIC_SOCIAL_LINKS_GET_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load social links",
        data: [],
      },
      { status: 500 }
    );
  }
}