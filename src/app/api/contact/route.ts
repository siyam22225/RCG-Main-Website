import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, rateLimitKey } from "@/lib/rate-limit";

const CONTACT_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_CONTACT_BODY_BYTES = 32 * 1024;

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  queryType: z.string().min(2),
  subject: z.string().min(2),
  message: z.string().min(5),
});

function parseContentLength(req: Request) {
  const rawValue = req.headers.get("content-length");
  if (!rawValue) return null;

  const value = Number(rawValue);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function optionalText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(req: Request) {
  try {
    const contentLength = parseContentLength(req);
    if (contentLength !== null && contentLength > MAX_CONTACT_BODY_BYTES) {
      return NextResponse.json(
        { success: false, message: "Request body is too large." },
        { status: 413 }
      );
    }

    const clientIp = getClientIp(req);
    const ipLimited = checkRateLimit(rateLimitKey("contact-form", "ip", clientIp), {
      limit: 5,
      windowMs: CONTACT_RATE_LIMIT_WINDOW_MS,
    });
    if (ipLimited) return ipLimited;

    const body = await req.json();
    const email = optionalText(body?.email);
    const phone = optionalText(body?.phone);

    if (email) {
      const emailLimited = checkRateLimit(
        rateLimitKey("contact-form", "email", email),
        { limit: 5, windowMs: CONTACT_RATE_LIMIT_WINDOW_MS }
      );
      if (emailLimited) return emailLimited;
    }

    if (phone) {
      const phoneLimited = checkRateLimit(
        rateLimitKey("contact-form", "phone", phone),
        { limit: 5, windowMs: CONTACT_RATE_LIMIT_WINDOW_MS }
      );
      if (phoneLimited) return phoneLimited;
    }

    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, message: "Invalid form data", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const saved = await prisma.contactMessage.create({
      data: parsed.data,
    });

    return NextResponse.json(
      { success: true, message: "Message saved successfully", data: saved },
      { status: 201 }
    );
  } catch (error) {
    console.error("CONTACT_API_ERROR", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
