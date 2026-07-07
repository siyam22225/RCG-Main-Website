import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const enterprises = await prisma.enterprise.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        location: true,
        buttonText: true,
        buttonHref: true,
        profileUrl: true,
        sortOrder: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: enterprises,
    });
  } catch (error) {
    console.error("PUBLIC_ENTERPRISES_GET_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load enterprises",
        data: [],
      },
      { status: 500 }
    );
  }
}