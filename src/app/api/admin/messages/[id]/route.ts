import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const invalidOrigin = requireSameOriginAdminRequest(_request);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Message ID is required." },
        { status: 400 }
      );
    }

    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingMessage) {
      return NextResponse.json(
        { success: false, message: "Message not found." },
        { status: 404 }
      );
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("ADMIN_MESSAGE_DELETE_ERROR", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete message." },
      { status: 500 }
    );
  }
}
