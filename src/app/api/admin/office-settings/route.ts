import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

const officeSchema = z.object({
  key: z.string().min(2),
  title: z.string().min(2),
  address: z.string().min(5),
  phone: z.string().min(3),
  email: z.string().email(),
  mapUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

const updateSchema = z.object({
  offices: z.array(officeSchema).min(1),
});

export async function GET() {
  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const offices = await prisma.officeSetting.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: offices,
    });
  } catch (error) {
    console.error("ADMIN_OFFICE_SETTINGS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  try {
    const admin = await requireAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = updateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid office settings data" },
        { status: 400 }
      );
    }

    const updatedOffices = [];

    for (const office of parsed.data.offices) {
      const updated = await prisma.officeSetting.upsert({
        where: { key: office.key },
        update: {
          title: office.title,
          address: office.address,
          phone: office.phone,
          email: office.email,
          mapUrl: office.mapUrl || null,
          sortOrder: office.sortOrder ?? 0,
          isActive: office.isActive ?? true,
        },
        create: {
          key: office.key,
          title: office.title,
          address: office.address,
          phone: office.phone,
          email: office.email,
          mapUrl: office.mapUrl || null,
          sortOrder: office.sortOrder ?? 0,
          isActive: office.isActive ?? true,
        },
      });

      updatedOffices.push(updated);
    }

    return NextResponse.json({
      success: true,
      message: "Office settings updated successfully",
      data: updatedOffices,
    });
  } catch (error) {
    console.error("ADMIN_OFFICE_SETTINGS_PATCH_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
