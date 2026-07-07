import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-auth";
import { CORE_DIRECTOR_SLUGS } from "@/lib/board-directors";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

type Props = {
  params: Promise<{ id: string }>;
};

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
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function PUT(req: Request, { params }: Props) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const name = cleanText(body.name);
  const role = cleanText(body.role);
  const slug = makeSlug(body.slug);

  if (!name || !role || !slug) {
    return NextResponse.json(
      { error: "Name, role, and slug are required." },
      { status: 400 }
    );
  }

  const existing = await prisma.boardDirector.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Director not found." }, { status: 404 });
  }

  const isCoreDirector = CORE_DIRECTOR_SLUGS.includes(existing.slug);

  const director = await prisma.boardDirector.update({
    where: { id },
    data: {
      slug: isCoreDirector ? existing.slug : slug,
      name,
      role,
      education: cleanText(body.education),
      shortMessage: cleanText(body.shortMessage),
      profileDetails: cleanText(body.profileDetails),
      messageTitle: cleanText(body.messageTitle),
      messageBody: cleanText(body.messageBody),
      showMessage: body.showMessage !== false,
      image: cleanText(body.image),
      facebook: cleanText(body.facebook) || "#",
      whatsapp: cleanText(body.whatsapp) || "#",
      profileEnabled: Boolean(body.profileEnabled),
      isActive: body.isActive !== false,
      displayOrder: isCoreDirector
        ? existing.displayOrder
        : Number(body.displayOrder || 0),
    },
  });

  return NextResponse.json({ director });
}

export async function DELETE(req: Request, { params }: Props) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.boardDirector.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Director not found." }, { status: 404 });
  }

  if (CORE_DIRECTOR_SLUGS.includes(existing.slug)) {
    return NextResponse.json(
      { error: "Core board directors cannot be deleted. You can make them inactive instead." },
      { status: 403 }
    );
  }

  await prisma.boardDirector.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
