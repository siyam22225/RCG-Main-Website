import { NextResponse } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitOptions = {
  limit: number;
  windowMs: number;
  message?: string;
};

const rateLimitEntries = new Map<string, RateLimitEntry>();
let lastCleanupAt = 0;

function cleanupExpiredEntries(now: number) {
  if (now - lastCleanupAt < 60_000) return;

  for (const [key, entry] of rateLimitEntries.entries()) {
    if (entry.resetAt <= now) {
      rateLimitEntries.delete(key);
    }
  }

  lastCleanupAt = now;
}

function normalizeKeyPart(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ").slice(0, 160);
}

// Lightweight single-instance protection. Replace with Redis/database-backed
// rate limiting before running multiple Node instances.
export function checkRateLimit(key: string, options: RateLimitOptions) {
  const now = Date.now();
  cleanupExpiredEntries(now);

  let entry = rateLimitEntries.get(key);

  if (!entry || entry.resetAt <= now) {
    entry = { count: 0, resetAt: now + options.windowMs };
    rateLimitEntries.set(key, entry);
  }

  entry.count += 1;

  if (entry.count <= options.limit) {
    return null;
  }

  const retryAfter = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

  return NextResponse.json(
    {
      success: false,
      message: options.message || "Too many requests. Please try again later.",
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
      },
    }
  );
}

export function resetRateLimit(key: string) {
  rateLimitEntries.delete(key);
}

export function rateLimitKey(action: string, ...parts: Array<string | null | undefined>) {
  return [action, ...parts.map((part) => normalizeKeyPart(part || "unknown"))].join(":");
}

export function getClientIp(req: Request) {
  const forwardedFor = req.headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((value) => value.trim())
    .find(Boolean);

  return forwardedFor || req.headers.get("x-real-ip")?.trim() || "unknown";
}
