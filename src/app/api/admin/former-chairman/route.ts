import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

const defaultProfileItems = [
  "Position | Chairman",
  "Education | B.Com (Hons), Management",
  "Profession | Businessman & Contractor",
  "Achievements | Recognized for leadership, dedication, and development vision.",
  "Business Activities | First Class Contractor in LGED & Roads & Highways department all over Dhaka City Corporation. (1981-2006)",
  "Legacy | A lasting contribution to structured growth and corporate trust.",
  "Personal Qualities | Known for integrity, vision, and commitment to excellence.",
  "Foreign Visit | India & KSA",
].join("\n");

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function nullableText(value: unknown) {
  const text = cleanText(value);
  return text || null;
}

async function getOrCreateMessage() {
  const existing = await prisma.formerChairmanMessage.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (existing) return existing;

  return prisma.formerChairmanMessage.create({
    data: {
      isActive: true,
      name: "Former Chairman",
      designation: "",
      image: "/images/message/former-chairman.jpg",
      title: "Former Chairman Message",
      eyebrow: "Who We Are",
      introLead:
        "A vision for planned development, responsible growth, and reliable living opportunities for future generations.",
      articleLabel: "Message",
      articleHeading:
        "Building with vision, trust, and long-term responsibility.",
      messageBody: "",
      profileItems: defaultProfileItems,
    },
  });
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  try {
    const message = await getOrCreateMessage();
    return NextResponse.json({ message });
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
    const existing = await getOrCreateMessage();

    const updated = await prisma.formerChairmanMessage.update({
      where: { id: existing.id },
      data: {
        isActive: body.isActive !== false,
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

    return NextResponse.json({ message: updated });
  } catch (error) {
    console.error("ADMIN_FORMER_CHAIRMAN_PUT_ERROR", error);
    return NextResponse.json(
      { message: "Failed to update former chairman message." },
      { status: 500 }
    );
  }
}
