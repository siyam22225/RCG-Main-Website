import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

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

async function getId(context: RouteContext) {
  const params = await context.params;
  return params.id;
}

export async function GET(_request: Request, context: RouteContext) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const id = await getId(context);

    const career = await prisma.careerVacancy.findUnique({
      where: { id },
      include: {
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!career) {
      return NextResponse.json({ message: "Vacancy not found." }, { status: 404 });
    }

    return NextResponse.json({ career });
  } catch (error) {
    console.error("ADMIN_CAREER_GET_ONE_ERROR", error);
    return NextResponse.json({ message: "Failed to load vacancy." }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const invalidOrigin = requireSameOriginAdminRequest(request);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const id = await getId(context);
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

    const career = await prisma.careerVacancy.update({
      where: { id },
      data: {
        title,
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

    return NextResponse.json({ career });
  } catch (error) {
    console.error("ADMIN_CAREER_PUT_ERROR", error);
    return NextResponse.json({ message: "Failed to update career vacancy." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const invalidOrigin = requireSameOriginAdminRequest(_request);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const id = await getId(context);

    await prisma.careerApplication.updateMany({
      where: { vacancyId: id },
      data: { vacancyId: null },
    });

    await prisma.careerVacancy.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Vacancy deleted successfully." });
  } catch (error) {
    console.error("ADMIN_CAREER_DELETE_ERROR", error);
    return NextResponse.json({ message: "Failed to delete career vacancy." }, { status: 500 });
  }
}
