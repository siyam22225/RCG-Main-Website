import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, getClientIp, rateLimitKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

const DEFAULT_MAX_CV_SIZE_MB = 5;
const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];
const CAREER_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const MAX_CAREER_REQUEST_BYTES = 26 * 1024 * 1024;

function safeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeMaxCvSizeMb(value: unknown) {
  const num = Number(value);
  if (!Number.isFinite(num)) return DEFAULT_MAX_CV_SIZE_MB;
  return Math.min(25, Math.max(1, Math.floor(num)));
}

function cleanFileName(name: string) {
  const ext = path.extname(name).toLowerCase();
  const base = path
    .basename(name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return `${base || "cv"}-${Date.now()}${ext}`;
}

function parseContentLength(req: Request) {
  const rawValue = req.headers.get("content-length");
  if (!rawValue) return null;

  const value = Number(rawValue);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export async function POST(request: Request) {
  try {
    const contentLength = parseContentLength(request);
    if (contentLength !== null && contentLength > MAX_CAREER_REQUEST_BYTES) {
      return NextResponse.json(
        { message: "Application upload is too large." },
        { status: 413 }
      );
    }

    const clientIp = getClientIp(request);
    const ipLimited = checkRateLimit(rateLimitKey("career-apply", "ip", clientIp), {
      limit: 3,
      windowMs: CAREER_RATE_LIMIT_WINDOW_MS,
    });
    if (ipLimited) return ipLimited;

    const formData = await request.formData();

    const vacancyId = safeText(formData.get("vacancyId")) || null;
    const position = safeText(formData.get("position"));
    const name = safeText(formData.get("name"));
    const phone = safeText(formData.get("phone"));
    const email = safeText(formData.get("email"));
    const experience = safeText(formData.get("experience")) || null;
    const expectedSalary = safeText(formData.get("expectedSalary")) || null;
    const message = safeText(formData.get("message")) || null;
    const cv = formData.get("cv");

    if (email) {
      const emailLimited = checkRateLimit(
        rateLimitKey("career-apply", "email", email),
        { limit: 3, windowMs: CAREER_RATE_LIMIT_WINDOW_MS }
      );
      if (emailLimited) return emailLimited;
    }

    let maxCvSizeMb = DEFAULT_MAX_CV_SIZE_MB;

    if (vacancyId) {
      const vacancy = await prisma.careerVacancy.findUnique({
        where: { id: vacancyId },
        select: { maxCvSizeMb: true },
      });

      if (vacancy?.maxCvSizeMb) {
        maxCvSizeMb = normalizeMaxCvSizeMb(vacancy.maxCvSizeMb);
      }
    }

    if (!name || !email || !phone || !position) {
      return NextResponse.json(
        { message: "Please fill all required fields." },
        { status: 400 }
      );
    }

    if (!(cv instanceof File)) {
      return NextResponse.json(
        { message: "Please upload your CV." },
        { status: 400 }
      );
    }

    if (cv.size > maxCvSizeMb * 1024 * 1024) {
      return NextResponse.json(
        { message: `CV file size must be within ${maxCvSizeMb} MB.` },
        { status: 400 }
      );
    }

    const extension = path.extname(cv.name).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json(
        { message: "Only PDF, DOC, and DOCX files are allowed." },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads", "career-cvs");
    await mkdir(uploadDir, { recursive: true });

    const fileName = cleanFileName(cv.name);
    const filePath = path.join(uploadDir, fileName);
    const bytes = Buffer.from(await cv.arrayBuffer());

    await writeFile(filePath, bytes);

    const cvUrl = `/uploads/career-cvs/${fileName}`;

    const application = await prisma.careerApplication.create({
      data: {
        vacancyId,
        position,
        name,
        phone,
        email,
        experience,
        expectedSalary,
        message,
        cvUrl,
      },
    });

    return NextResponse.json({
      message: "Application submitted successfully.",
      applicationId: application.id,
    });
  } catch (error) {
    console.error("CAREER_APPLICATION_ERROR", error);

    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
