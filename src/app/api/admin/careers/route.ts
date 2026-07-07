import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown) {
  const cleaned = text(value);
  return cleaned || null;
}

function nullableDate(value: unknown) {
  const cleaned = text(value);
  if (!cleaned) return null;

  const date = new Date(cleaned);
  return Number.isNaN(date.getTime()) ? null : date;
}

function nullableInt(value: unknown) {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? Math.floor(num) : null;
}

function cvSizeMb(value: unknown) {
  const num = Number(value);
  if (!Number.isFinite(num)) return 5;
  return Math.min(25, Math.max(1, Math.floor(num)));
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const careers = await prisma.careerVacancy.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    return NextResponse.json({ careers });
  } catch (error) {
    console.error("ADMIN_CAREERS_GET_ERROR", error);
    return NextResponse.json({ message: "Failed to load career vacancies." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(request);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();

    const title = text(body.title);
    const department = text(body.department);
    const jobType = text(body.jobType);
    const location = text(body.location);
    const shortDescription = text(body.shortDescription);

    if (!title || !department || !jobType || !location || !shortDescription) {
      return NextResponse.json(
        { message: "Title, department, job type, location, and short description are required." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(text(body.slug) || title);
    const slug = `${baseSlug}-${Date.now()}`;

    const career = await prisma.careerVacancy.create({
      data: {
        title,
        slug,
        department,
        jobType,
        location,
        salaryRange: nullableText(body.salaryRange),
        deadline: nullableDate(body.deadline),
        shortDescription,
        responsibilities: nullableText(body.responsibilities),
        requirements: nullableText(body.requirements),
        experience: nullableText(body.experience),
        numberOfVacancies: nullableInt(body.numberOfVacancies),
        maxCvSizeMb: cvSizeMb(body.maxCvSizeMb),
        status: text(body.status) || "draft",
        isFeatured: Boolean(body.isFeatured),
      },
    });

    return NextResponse.json({ career }, { status: 201 });
  } catch (error) {
    console.error("ADMIN_CAREERS_POST_ERROR", error);
    return NextResponse.json({ message: "Failed to create career vacancy." }, { status: 500 });
  }
}
