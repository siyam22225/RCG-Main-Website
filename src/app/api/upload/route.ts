import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { verifyAdminToken } from "@/lib/admin-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export const runtime = "nodejs";

const BYTES_IN_MB = 1024 * 1024;
const uploadConfigs = [
  {
    folderName: "images",
    maxBytes: 5 * BYTES_IN_MB,
    types: new Set(["image/jpeg", "image/png", "image/webp"]),
  },
  {
    folderName: "videos",
    maxBytes: 50 * BYTES_IN_MB,
    types: new Set(["video/mp4", "video/webm", "video/quicktime"]),
  },
  {
    folderName: "documents",
    maxBytes: 10 * BYTES_IN_MB,
    types: new Set(["application/pdf"]),
  },
];

const maxRequestBytes =
  Math.max(...uploadConfigs.map((config) => config.maxBytes)) + BYTES_IN_MB;

async function requireAdminApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  try {
    return await verifyAdminToken(token);
  } catch {
    return null;
  }
}

function getUploadConfig(fileType: string) {
  return uploadConfigs.find((config) => config.types.has(fileType));
}

function parseContentLength(req: Request) {
  const rawValue = req.headers.get("content-length");
  if (!rawValue) return null;

  const value = Number(rawValue);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

function fileTooLargeResponse(maxBytes: number) {
  return NextResponse.json(
    { error: `File size must be within ${maxBytes / BYTES_IN_MB} MB.` },
    { status: 413 }
  );
}

export async function POST(req: Request) {
  try {
    const invalidOrigin = requireSameOriginAdminRequest(req);
    if (invalidOrigin) return invalidOrigin;

    const admin = await requireAdminApi();

    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized upload request." },
        { status: 401 }
      );
    }

    const contentLength = parseContentLength(req);
    if (contentLength !== null && contentLength > maxRequestBytes) {
      return NextResponse.json(
        { error: "Uploaded file is too large." },
        { status: 413 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const uploadConfig = getUploadConfig(file.type);

    if (!uploadConfig) {
      return NextResponse.json(
        { error: "Only image, video, and PDF files are allowed." },
        { status: 400 }
      );
    }

    if (file.size > uploadConfig.maxBytes) {
      return fileTooLargeResponse(uploadConfig.maxBytes);
    }

    const bytes = await file.arrayBuffer();

    if (bytes.byteLength > uploadConfig.maxBytes) {
      return fileTooLargeResponse(uploadConfig.maxBytes);
    }

    const buffer = Buffer.from(bytes);

    const folderName = uploadConfig.folderName;
    const uploadDir = path.join(process.cwd(), "public", "uploads", folderName);

    await mkdir(uploadDir, { recursive: true });

    const safeName = file.name
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "")
      .toLowerCase();

    const fileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    return NextResponse.json({
      url: `/uploads/${folderName}/${fileName}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }
}
