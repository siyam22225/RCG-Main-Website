import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";
import {
  getOrCreateEffectiveFormerChairmanMessage,
} from "@/lib/formerChairman";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown) {
  const text = cleanText(value);
  return text || null;
}

function cleanBoolean(value: unknown) {
  return typeof value === "boolean" ? value : true;
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const message = await getOrCreateEffectiveFormerChairmanMessage();
    const response = NextResponse.json({ message });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("ADMIN_FORMER_CHAIRMAN_GET_ERROR", error);
    return NextResponse.json(
      { message: "Failed to load former chairman message." },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(request);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const body = await request.json();
    const existing = await getOrCreateEffectiveFormerChairmanMessage();

    const updated = await prisma.formerChairmanMessage.update({
      where: { id: existing.id },
      data: {
        isActive: cleanBoolean(body.isActive),
        name: cleanText(body.name) || "Former Chairman",
        designation: nullableText(body.designation),
        image: nullableText(body.image),
        title: cleanText(body.title) || "Former Chairman Message",
        eyebrow: nullableText(body.eyebrow),
        introLead: nullableText(body.introLead),
        articleLabel: nullableText(body.articleLabel),
        articleHeading: nullableText(body.articleHeading),
        messageBody: nullableText(body.messageBody),
        profileItems: nullableText(body.profileItems),
      },
    });

    const response = NextResponse.json({ message: updated });
    response.headers.set("Cache-Control", "no-store, max-age=0");
    return response;
  } catch (error) {
    console.error("ADMIN_FORMER_CHAIRMAN_PUT_ERROR", error);
    return NextResponse.json(
      { message: "Failed to update former chairman message." },
      { status: 500 }
    );
  }
}
