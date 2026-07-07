import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { createAdminToken } from "@/lib/admin-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";
import {
  checkRateLimit,
  getClientIp,
  rateLimitKey,
  resetRateLimit,
} from "@/lib/rate-limit";

const LOGIN_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;

export async function POST(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  try {
    const clientIp = getClientIp(req);
    const ipLimitKey = rateLimitKey("admin-login", "ip", clientIp);
    const ipLimited = checkRateLimit(ipLimitKey, {
      limit: 10,
      windowMs: LOGIN_RATE_LIMIT_WINDOW_MS,
    });
    if (ipLimited) return ipLimited;

    const body = await req.json();

    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const emailIpLimitKey = rateLimitKey("admin-login", "email-ip", email, clientIp);
    const emailIpLimited = checkRateLimit(emailIpLimitKey, {
      limit: 5,
      windowMs: LOGIN_RATE_LIMIT_WINDOW_MS,
    });
    if (emailIpLimited) return emailIpLimited;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatched = await bcrypt.compare(password, admin.password);

    if (!passwordMatched) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    resetRateLimit(ipLimitKey);
    resetRateLimit(emailIpLimitKey);

    const token = await createAdminToken({
      id: admin.id,
      email: admin.email,
      role: admin.role === "super_admin" ? "super_admin" : "admin",
    });

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("ADMIN_LOGIN_ERROR", error);

    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
