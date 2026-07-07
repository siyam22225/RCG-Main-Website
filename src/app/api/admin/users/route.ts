import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

async function requireSuperAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  try {
    const payload = await verifyAdminToken(token);

    const admin = await prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
      },
    });

    if (!admin || !admin.isActive || admin.role !== "super_admin") {
      return null;
    }

    return admin;
  } catch {
    return null;
  }
}

const createSchema = z.object({
  name: z.string().optional().nullable(),
  email: z.string().email(),
  password: z.string().min(8),
});

const updateSchema = z.object({
  id: z.string().min(1),
  name: z.string().optional().nullable(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  isActive: z.boolean().optional(),
});

const deleteSchema = z.object({
  id: z.string().min(1),
});

async function getTargetAdmin(id: string) {
  return prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      role: true,
      isProtected: true,
    },
  });
}

function isLockedAdmin(admin: {
  role: string;
  isProtected: boolean;
}) {
  return admin.role === "super_admin" || admin.isProtected;
}

export async function GET() {
  try {
    const admin = await requireSuperAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const users = await prisma.adminUser.findMany({
      where: {
        isHiddenFromAdminPanel: false,
      },
      orderBy: [{ role: "desc" }, { createdAt: "asc" }],
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isProtected: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("ADMIN_USERS_GET_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  try {
    const admin = await requireSuperAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = createSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid admin user data" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(parsed.data.password, 10);

    const created = await prisma.adminUser.create({
      data: {
        email,
        name: parsed.data.name?.trim() || null,
        password: hashedPassword,
        role: "admin",
        isProtected: false,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isProtected: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      data: created,
    });
  } catch (error) {
    console.error("ADMIN_USERS_POST_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error or duplicate email" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  try {
    const admin = await requireSuperAdmin();

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
        { success: false, message: "Invalid admin user data" },
        { status: 400 }
      );
    }

    const target = await getTargetAdmin(parsed.data.id);

    if (!target) {
      return NextResponse.json(
        { success: false, message: "Admin user not found" },
        { status: 404 }
      );
    }

    if (isLockedAdmin(target)) {
      return NextResponse.json(
        { success: false, message: "Super admin accounts cannot be edited here." },
        { status: 403 }
      );
    }

    const updateData: {
      name?: string | null;
      email?: string;
      password?: string;
      isActive?: boolean;
    } = {};

    if (parsed.data.name !== undefined) {
      updateData.name = parsed.data.name?.trim() || null;
    }

    if (parsed.data.email) {
      updateData.email = parsed.data.email.trim().toLowerCase();
    }

    if (parsed.data.password) {
      updateData.password = await bcrypt.hash(parsed.data.password, 10);
    }

    if (parsed.data.isActive !== undefined) {
      updateData.isActive = parsed.data.isActive;
    }

    const updated = await prisma.adminUser.update({
      where: { id: parsed.data.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isProtected: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("ADMIN_USERS_PATCH_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error or duplicate email" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  try {
    const admin = await requireSuperAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parsed = deleteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Admin user id is required" },
        { status: 400 }
      );
    }

    const target = await getTargetAdmin(parsed.data.id);

    if (!target) {
      return NextResponse.json(
        { success: false, message: "Admin user not found" },
        { status: 404 }
      );
    }

    if (isLockedAdmin(target)) {
      return NextResponse.json(
        { success: false, message: "Super admin accounts cannot be deleted." },
        { status: 403 }
      );
    }

    await prisma.adminUser.delete({
      where: { id: parsed.data.id },
    });

    return NextResponse.json({
      success: true,
      message: "Admin user deleted successfully",
    });
  } catch (error) {
    console.error("ADMIN_USERS_DELETE_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
