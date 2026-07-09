import { closeSync, openSync, readSync, statSync } from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function cleanPublicPath(value: string) {
  const pathname = value.split(/[?#]/)[0].replace(/^\/+/, "");

  try {
    return decodeURI(pathname);
  } catch {
    return pathname;
  }
}

function hasImageSignature(filePath: string) {
  const fileDescriptor = openSync(filePath, "r");

  try {
    const buffer = Buffer.alloc(16);
    const bytesRead = readSync(fileDescriptor, buffer, 0, buffer.length, 0);
    const header = buffer.subarray(0, bytesRead);
    const ascii = header.toString("ascii");

    const isJpeg = header[0] === 0xff && header[1] === 0xd8 && header[2] === 0xff;
    const isPng =
      header[0] === 0x89 &&
      header[1] === 0x50 &&
      header[2] === 0x4e &&
      header[3] === 0x47 &&
      header[4] === 0x0d &&
      header[5] === 0x0a &&
      header[6] === 0x1a &&
      header[7] === 0x0a;
    const isGif = ascii.startsWith("GIF87a") || ascii.startsWith("GIF89a");
    const isWebp = ascii.startsWith("RIFF") && ascii.slice(8, 12) === "WEBP";
    const isAvif = ascii.slice(4, 8) === "ftyp" && ascii.slice(8, 12) === "avif";

    return isJpeg || isPng || isGif || isWebp || isAvif;
  } finally {
    closeSync(fileDescriptor);
  }
}

export function isUsablePublicMediaUrl(value: string | null | undefined) {
  const trimmed = value?.trim();
  if (!trimmed) return false;

  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return true;
  }

  const resolvedPath = path.resolve(PUBLIC_DIR, cleanPublicPath(trimmed));
  if (!resolvedPath.startsWith(`${PUBLIC_DIR}${path.sep}`)) return false;

  try {
    const stats = statSync(resolvedPath);
    return stats.isFile() && stats.size > 0 && hasImageSignature(resolvedPath);
  } catch {
    return false;
  }
}

export function safePublicMediaUrl(
  value: string | null | undefined,
  fallback: string | null = null
) {
  const trimmed = value?.trim();
  return trimmed && isUsablePublicMediaUrl(trimmed) ? trimmed : fallback;
}
