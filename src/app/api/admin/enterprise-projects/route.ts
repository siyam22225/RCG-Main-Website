import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifyAdminToken } from "@/lib/admin-auth";
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

function parseJsonArray(value: unknown) {
  if (Array.isArray(value)) return value;
  return [];
}

export async function GET() {
  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.enterpriseProject.findMany({
    orderBy: [
      { enterpriseSlug: "asc" },
      { displayOrder: "asc" },
      { createdAt: "asc" },
    ],
  });

  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const admin = await requireAdmin();

  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const enterpriseSlug = cleanText(body.enterpriseSlug);
  const name = cleanText(body.name);
  const slug = makeSlug(body.slug || body.name);

  if (!enterpriseSlug || !name || !slug) {
    return NextResponse.json(
      { error: "Concern, project name, and slug are required." },
      { status: 400 }
    );
  }

  const parentSubCategory = await prisma.businessVerticalItem.findFirst({
    where: { enterpriseSlug },
    select: { id: true },
  });

  if (!parentSubCategory) {
    return NextResponse.json(
      { error: "Selected Business Vertical sub-category was not found." },
      { status: 400 }
    );
  }

  const existingProject = await prisma.enterpriseProject.findFirst({
    where: {
      enterpriseSlug,
      slug,
    },
    select: {
      id: true,
    },
  });

  if (existingProject) {
    return NextResponse.json(
      {
        error: "This featured project already exists under this sub-category.",
      },
      { status: 409 }
    );
  }
  const project = await prisma.enterpriseProject.create({
    data: {
      enterpriseSlug,
      slug,
      name,
      location: cleanText(body.location),
      image: cleanText(body.image),
      shortDescription: cleanText(body.shortDescription),
      fullDescription: parseJsonArray(body.fullDescription),
      media: parseJsonArray(body.media),
      profilePdf: cleanText(body.profilePdf),
      layoutPdf: cleanText(body.layoutPdf),
      websiteUrl: cleanText(body.websiteUrl),
      tour360Image: cleanText(body.tour360Image),
      isActive: body.isActive !== false,
      displayOrder: Number(body.displayOrder || 0),
    },
  });

  return NextResponse.json({ project });
}
