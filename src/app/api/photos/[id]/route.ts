import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

type Props = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_req: Request, { params }: Props) {
  const invalidOrigin = requireSameOriginAdminRequest(_req);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { id } = await params;

    await prisma.photo.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: "Photo deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PHOTO_DELETE_ERROR", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete photo" },
      { status: 500 }
    );
  }
}
