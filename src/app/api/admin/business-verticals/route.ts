import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

const db = prisma as any;

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown) {
  const cleaned = cleanText(value);
  return cleaned.length ? cleaned : null;
}

function slugify(value: unknown) {
  return cleanText(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getModels() {
  const categoryModel = db.businessVerticalCategory;
  const itemModel = db.businessVerticalItem;
  const enterpriseModel = db.enterprise;

  if (!categoryModel || !itemModel || !enterpriseModel) {
    throw new Error("Required Prisma models are not available.");
  }

  return { categoryModel, itemModel, enterpriseModel };
}

async function upsertEnterpriseForSubCategory(input: {
  label: string;
  enterpriseSlug: string;
  targetUrl: string;
  description?: string | null;
  imageUrl?: string | null;
  location?: string | null;
  websiteUrl?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}) {
  const { enterpriseModel } = getModels();

  const description =
    cleanText(input.description) ||
    `${input.label} is a business vertical of Real Capita Group.`;

  await enterpriseModel.upsert({
    where: { slug: input.enterpriseSlug },
    update: {
      name: input.label,
      description,
      imageUrl: nullableText(input.imageUrl),
      location: nullableText(input.location),
      buttonText: "View Details",
      buttonHref: input.targetUrl,
      profileUrl: nullableText(input.websiteUrl),
      sortOrder: Number(input.displayOrder || 0),
      isActive: input.isActive !== false,
    },
    create: {
      name: input.label,
      slug: input.enterpriseSlug,
      description,
      imageUrl: nullableText(input.imageUrl),
      location: nullableText(input.location),
      buttonText: "View Details",
      buttonHref: input.targetUrl,
      profileUrl: nullableText(input.websiteUrl),
      sortOrder: Number(input.displayOrder || 0),
      isActive: input.isActive !== false,
    },
  });
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const { categoryModel } = getModels();

    const categories = await categoryModel.findMany({
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      include: {
        items: {
          orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    });

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("ADMIN_BUSINESS_VERTICALS_GET_ERROR", error);
    return NextResponse.json(
      { message: "Failed to load business verticals." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(request);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const action = cleanText(body.action);
    const { categoryModel, itemModel } = getModels();

    if (action === "createCategory") {
      const label = cleanText(body.label);

      if (!label) {
        return NextResponse.json({ message: "Category name is required." }, { status: 400 });
      }

      const categorySlug = slugify(label) || `category-${Date.now()}`;

      const existingCategory = await categoryModel.findUnique({
        where: { slug: categorySlug },
      });

      if (existingCategory) {
        return NextResponse.json(
          { message: "This Business Vertical category already exists." },
          { status: 409 }
        );
      }

      const category = await categoryModel.create({
        data: {
          label,
          slug: categorySlug,
          displayOrder: Number(body.displayOrder || 0),
          isActive: body.isActive !== false,
        },
      });

      return NextResponse.json({ category });
    }

    if (action === "updateCategory") {
      const id = cleanText(body.id);
      const label = cleanText(body.label);

      if (!id || !label) {
        return NextResponse.json({ message: "Category id and name are required." }, { status: 400 });
      }

      const category = await categoryModel.update({
        where: { id },
        data: {
          label,
          displayOrder: Number(body.displayOrder || 0),
          isActive: body.isActive !== false,
        },
      });

      return NextResponse.json({ category });
    }

    if (action === "deleteCategory") {
      const id = cleanText(body.id);

      if (!id) {
        return NextResponse.json({ message: "Category id is required." }, { status: 400 });
      }

      await categoryModel.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    }

    if (action === "createItem") {
      const categoryId = cleanText(body.categoryId);
      const label = cleanText(body.label);

      if (!categoryId || !label) {
        return NextResponse.json(
          { message: "Parent category and sub-category name are required." },
          { status: 400 }
        );
      }

      const category = await categoryModel.findUnique({ where: { id: categoryId } });

      if (!category) {
        return NextResponse.json({ message: "Parent category not found." }, { status: 404 });
      }

      const enterpriseSlug = slugify(body.enterpriseSlug || label);

      if (!enterpriseSlug) {
        return NextResponse.json(
          { message: "A valid sub-category slug is required." },
          { status: 400 }
        );
      }

      const duplicateItem = await itemModel.findFirst({
        where: { enterpriseSlug },
        select: { id: true },
      });

      if (duplicateItem) {
        return NextResponse.json(
          { message: "This Business Vertical sub-category slug already exists." },
          { status: 409 }
        );
      }

      const targetUrl = `/business-verticals/${enterpriseSlug}`;
      const displayOrder = Number(body.displayOrder || 0);
      const isActive = body.isActive !== false;

      const item = await itemModel.create({
        data: {
          categoryId,
          label,
          enterpriseSlug,
          targetUrl,
          imageUrl: nullableText(body.imageUrl),
          description: nullableText(body.description),
          location: nullableText(body.location),
          websiteUrl: nullableText(body.websiteUrl),
          displayOrder,
          isActive,
        },
      });

      return NextResponse.json({ item });
    }

    if (action === "updateItem") {
      const id = cleanText(body.id);
      const label = cleanText(body.label);

      if (!id || !label) {
        return NextResponse.json(
          { message: "Sub-category id and name are required." },
          { status: 400 }
        );
      }

      const enterpriseSlug = slugify(body.enterpriseSlug || label);

      if (!enterpriseSlug) {
        return NextResponse.json(
          { message: "A valid sub-category slug is required." },
          { status: 400 }
        );
      }

      const duplicateItem = await itemModel.findFirst({
        where: {
          enterpriseSlug,
          NOT: { id },
        },
        select: { id: true },
      });

      if (duplicateItem) {
        return NextResponse.json(
          { message: "This Business Vertical sub-category slug already exists." },
          { status: 409 }
        );
      }

      const targetUrl = `/business-verticals/${enterpriseSlug}`;
      const displayOrder = Number(body.displayOrder || 0);
      const isActive = body.isActive !== false;

      const item = await itemModel.update({
        where: { id },
        data: {
          label,
          enterpriseSlug,
          targetUrl,
          imageUrl: nullableText(body.imageUrl),
          description: nullableText(body.description),
          location: nullableText(body.location),
          websiteUrl: nullableText(body.websiteUrl),
          displayOrder,
          isActive,
        },
      });

      return NextResponse.json({ item });
    }

    if (action === "deleteItem") {
      const id = cleanText(body.id);

      if (!id) {
        return NextResponse.json({ message: "Sub-category id is required." }, { status: 400 });
      }

      await itemModel.delete({ where: { id } });
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ message: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("ADMIN_BUSINESS_VERTICALS_POST_ERROR", error);
    return NextResponse.json(
      { message: "Failed to save business vertical data." },
      { status: 500 }
    );
  }
}
