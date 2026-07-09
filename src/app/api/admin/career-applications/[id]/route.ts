import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const allowedStatuses = new Set(["new", "reviewed", "shortlisted", "rejected", "hired"]);

async function getId(context: RouteContext) {
  const params = await context.params;
  return params.id;
}

export async function PATCH(request: Request, context: RouteContext) {
  const invalidOrigin = requireSameOriginAdminRequest(request);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const id = await getId(context);
    const body = await request.json();
    const status = typeof body.status === "string" ? body.status.trim().toLowerCase() : "";

    if (!allowedStatuses.has(status)) {
      return NextResponse.json({ message: "Invalid application status." }, { status: 400 });
    }

    const application = await prisma.careerApplication.update({
      where: { id },
      data: { status },
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

    return NextResponse.json({ application });
  } catch (error) {
    console.error("ADMIN_CAREER_APPLICATION_PATCH_ERROR", error);
    return NextResponse.json({ message: "Failed to update application." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const invalidOrigin = requireSameOriginAdminRequest(_request);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const id = await getId(context);

    await prisma.careerApplication.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Application deleted successfully." });
  } catch (error) {
    console.error("ADMIN_CAREER_APPLICATION_DELETE_ERROR", error);
    return NextResponse.json({ message: "Failed to delete application." }, { status: 500 });
  }
}
