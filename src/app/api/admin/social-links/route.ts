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

const socialLinkSchema = z.object({
  label: z.string().min(2),
  href: z.string().min(1),
  iconUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

const updateSchema = z.object({
  links: z.array(socialLinkSchema).min(1),
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

    const links = await prisma.socialLink.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      data: links,
    });
  } catch (error) {
    console.error("ADMIN_SOCIAL_LINKS_GET_ERROR", error);
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
        { success: false, message: "Invalid social link data" },
        { status: 400 }
      );
    }

    const updatedLinks = [];

    for (const item of parsed.data.links) {
      const updated = await prisma.socialLink.upsert({
        where: { label: item.label },
        update: {
          href: item.href,
          iconUrl: item.iconUrl || null,
          sortOrder: item.sortOrder ?? 0,
          isActive: item.isActive ?? true,
        },
        create: {
          label: item.label,
          href: item.href,
          iconUrl: item.iconUrl || null,
          sortOrder: item.sortOrder ?? 0,
          isActive: item.isActive ?? true,
        },
      });

      updatedLinks.push(updated);
    }

    return NextResponse.json({
      success: true,
      message: "Social links updated successfully",
      data: updatedLinks,
    });
  } catch (error) {
    console.error("ADMIN_SOCIAL_LINKS_PATCH_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
