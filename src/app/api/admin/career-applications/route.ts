import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";

export const runtime = "nodejs";

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const applications = await prisma.careerApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        vacancy: {
          select: {
            id: true,
            title: true,
            department: true,
            status: true,
          },
        },
      },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("ADMIN_CAREER_APPLICATIONS_GET_ERROR", error);
    return NextResponse.json({ message: "Failed to load career applications." }, { status: 500 });
  }
}
