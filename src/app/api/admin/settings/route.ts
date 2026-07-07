import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminToken, verifyAdminToken } from "@/lib/admin-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

async function getCurrentAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  try {
    const payload = await verifyAdminToken(token);

    const id = typeof payload.id === "string" ? payload.id : "";
    const email = typeof payload.email === "string" ? payload.email : "";

    const admin = id
      ? await prisma.adminUser.findUnique({ where: { id } })
      : email
        ? await prisma.adminUser.findUnique({
            where: { email: email.toLowerCase() },
          })
        : null;

    if (!admin || !admin.isActive) return null;

    return admin;
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        isProtected: admin.isProtected,
        isActive: admin.isActive,
        updatedAt: admin.updatedAt,
      },
    });
  } catch (error) {
    console.error("ADMIN_SETTINGS_GET_ERROR", error);
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
    const admin = await getCurrentAdmin();

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const currentPassword = String(body.currentPassword || "");
    const newEmail = String(body.email || "").trim().toLowerCase();
    const newPassword = String(body.newPassword || "");
    const confirmPassword = String(body.confirmPassword || "");

    if (!currentPassword) {
      return NextResponse.json(
        { success: false, message: "Current password is required" },
        { status: 400 }
      );
    }

    if (!newEmail) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    const passwordOk = await bcrypt.compare(currentPassword, admin.password);

    if (!passwordOk) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 401 }
      );
    }

    const updateData: {
      email?: string;
      password?: string;
    } = {};

    if (newEmail !== admin.email) {
      const existingAdmin = await prisma.adminUser.findUnique({
        where: { email: newEmail },
        select: { id: true, email: true },
      });

      if (existingAdmin && existingAdmin.id !== admin.id) {
        return NextResponse.json(
          {
            success: false,
            message: "This email is already used by another admin account.",
          },
          { status: 409 }
        );
      }

      updateData.email = newEmail;
    }

    if (newPassword || confirmPassword) {
      if (newPassword.length < 8) {
        return NextResponse.json(
          {
            success: false,
            message: "New password must be at least 8 characters",
          },
          { status: 400 }
        );
      }

      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          {
            success: false,
            message: "New password and confirmation do not match",
          },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    if (!updateData.email && !updateData.password) {
      return NextResponse.json(
        { success: false, message: "No changes provided" },
        { status: 400 }
      );
    }

    const updatedAdmin = await prisma.adminUser.update({
      where: { id: admin.id },
      data: updateData,
    });

    const token = await createAdminToken({
      id: updatedAdmin.id,
      email: updatedAdmin.email,
      role: updatedAdmin.role === "super_admin" ? "super_admin" : "admin",
    });

    const res = NextResponse.json({
      success: true,
      message: "Admin settings updated successfully",
      admin: {
        id: updatedAdmin.id,
        email: updatedAdmin.email,
        name: updatedAdmin.name,
        role: updatedAdmin.role,
        isProtected: updatedAdmin.isProtected,
        isActive: updatedAdmin.isActive,
        updatedAt: updatedAdmin.updatedAt,
      },
    });

    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (error) {
    console.error("ADMIN_SETTINGS_PATCH_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
