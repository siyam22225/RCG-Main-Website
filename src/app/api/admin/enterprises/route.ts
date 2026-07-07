import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

const CORE_ENTERPRISE_SLUGS = new Set([
  "land-rpcdl",
  "apartment-rchl",
  "hotel-rc-bay",
  "resda",
  "afsen-group",
  "abdf",
]);

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

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function makeSlug(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enterprises = await prisma.enterprise.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({
    success: true,
    data: enterprises,
    enterprises,
  });
}

export async function POST(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const name = cleanText(body.name);
  const slug = makeSlug(body.slug || body.name);

  if (!name || !slug) {
    return NextResponse.json(
      { error: "Concern name and valid slug are required." },
      { status: 400 }
    );
  }

  const enterprise = await prisma.enterprise.create({
    data: {
      name,
      slug,
      description: cleanText(body.description),
      imageUrl: cleanText(body.imageUrl || body.image),
      location: cleanText(body.location),
      buttonText: cleanText(body.buttonText) || "Visit Website",
      buttonHref: cleanText(body.buttonHref || body.website) || "#",
      profileUrl: cleanText(body.profileUrl) || null,
      sortOrder: Number(body.sortOrder || 0),
      isActive: body.isActive !== false,
    },
  });

  return NextResponse.json({
    success: true,
    data: enterprise,
    enterprise,
  });
}

export async function PUT(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const id = cleanText(body.id);
  const name = cleanText(body.name);
  const slug = makeSlug(body.slug || body.name);

  if (!id || !name || !slug) {
    return NextResponse.json(
      { error: "Concern id, name, and valid slug are required." },
      { status: 400 }
    );
  }

  const existing = await prisma.enterprise.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Concern not found." },
      { status: 404 }
    );
  }

  const enterprise = await prisma.enterprise.update({
    where: { id },
    data: {
      name,
      slug,
      description: cleanText(body.description),
      imageUrl: cleanText(body.imageUrl || body.image),
      location: cleanText(body.location),
      buttonText: cleanText(body.buttonText) || "Visit Website",
      buttonHref: cleanText(body.buttonHref || body.website) || "#",
      profileUrl: cleanText(body.profileUrl) || null,
      sortOrder: Number(body.sortOrder || 0),
      isActive: body.isActive !== false,
    },
  });

  if (existing.slug !== enterprise.slug) {
    await prisma.enterpriseProject.updateMany({
      where: { enterpriseSlug: existing.slug },
      data: { enterpriseSlug: enterprise.slug },
    });
  }

  return NextResponse.json({
    success: true,
    data: enterprise,
    enterprise,
  });
}


export async function PATCH(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const enterprises = Array.isArray(body.enterprises) ? body.enterprises : [];

  if (enterprises.length === 0) {
    return NextResponse.json(
      { success: false, error: "No enterprise concerns provided." },
      { status: 400 }
    );
  }

  try {
    const savedEnterprises = [];

    for (const item of enterprises) {
      const id = cleanText(item.id);
      const name = cleanText(item.name);
      const slug = makeSlug(item.slug || item.name);

      if (!name || !slug) {
        return NextResponse.json(
          { success: false, error: "Concern name and valid slug are required." },
          { status: 400 }
        );
      }

      const data = {
        name,
        slug,
        description: cleanText(item.description),
        imageUrl: cleanText(item.imageUrl || item.image) || "/images/enterprises/enterprise-1.jpg",
        location: cleanText(item.location),
        buttonText: cleanText(item.buttonText) || "Visit Website",
        buttonHref: cleanText(item.buttonHref || item.website) || "#",
        profileUrl: cleanText(item.profileUrl) || null,
        sortOrder: Number(item.sortOrder || 0),
        isActive: item.isActive !== false,
      };

      if (id) {
        const existing = await prisma.enterprise.findUnique({
          where: { id },
        });

        if (!existing) {
          return NextResponse.json(
            { success: false, error: `Concern not found: ${name}` },
            { status: 404 }
          );
        }

        const updated = await prisma.enterprise.update({
          where: { id },
          data,
        });

        if (existing.slug !== updated.slug) {
          await prisma.enterpriseProject.updateMany({
            where: { enterpriseSlug: existing.slug },
            data: { enterpriseSlug: updated.slug },
          });
        }

        savedEnterprises.push(updated);
      } else {
        const created = await prisma.enterprise.create({
          data,
        });

        savedEnterprises.push(created);
      }
    }

    const allEnterprises = await prisma.enterprise.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    });

    return NextResponse.json({
      success: true,
      data: allEnterprises,
      enterprises: allEnterprises,
    });
  } catch (error) {
    console.error("ENTERPRISES_PATCH_ERROR", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to update enterprise concerns.",
      },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  let id = cleanText(searchParams.get("id"));

  if (!id) {
    try {
      const body = await req.json();
      id = cleanText(body.id);
    } catch {
      id = "";
    }
  }

  if (!id) {
    return NextResponse.json(
      { success: false, error: "Concern id is required." },
      { status: 400 }
    );
  }

  const existing = await prisma.enterprise.findUnique({
    where: { id },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, error: "Concern not found." },
      { status: 404 }
    );
  }

  if (CORE_ENTERPRISE_SLUGS.has(existing.slug)) {
    const enterprise = await prisma.enterprise.update({
      where: { id },
      data: { isActive: false },
    });

    return NextResponse.json({
      success: true,
      action: "set-inactive",
      data: enterprise,
      enterprise,
    });
  }

  await prisma.$transaction([
    prisma.enterpriseProject.deleteMany({
      where: { enterpriseSlug: existing.slug },
    }),
    prisma.enterprise.delete({
      where: { id },
    }),
  ]);

  return NextResponse.json({
    success: true,
    action: "deleted",
  });
}
