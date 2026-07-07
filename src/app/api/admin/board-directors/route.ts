import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-auth";
import { directors as coreDirectors } from "@/data/directors";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

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

async function ensureCoreDirectorsExist() {
  for (let index = 0; index < coreDirectors.length; index += 1) {
    const director = coreDirectors[index] as any;

    await prisma.boardDirector.upsert({
      where: { slug: director.slug },
      update: {},
      create: {
        slug: director.slug,
        name: director.name,
        role: director.role,
        education: director.education || "",
        shortMessage: director.shortMessage || "",
        profileDetails: director.profileDetails || "",
        messageTitle: director.messageTitle || "",
        messageBody: director.messageBody || "",
        showMessage: director.showMessage !== false,
        image: director.image,
        facebook: director.facebook || "#",
        whatsapp: director.whatsapp || "#",
        website: director.website || "#",
        profileEnabled: Boolean(director.profileEnabled),
        isActive: true,
        displayOrder: index + 1,
      },
    });
  }
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureCoreDirectorsExist();

  const directors = await prisma.boardDirector.findMany({
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json({ directors });
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
  const role = cleanText(body.role);
  const slug = makeSlug(body.slug || body.name);

  if (!name || !role || !slug) {
    return NextResponse.json(
      { error: "Name, role, and slug are required." },
      { status: 400 }
    );
  }

  const director = await prisma.boardDirector.create({
    data: {
      slug,
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
      website: cleanText(body.website) || "#",
      profileEnabled: Boolean(body.profileEnabled),
      isActive: body.isActive !== false,
      displayOrder: Number(body.displayOrder || 99),
    },
  });

  return NextResponse.json({ director });
}
