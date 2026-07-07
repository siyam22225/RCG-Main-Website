import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "./lib/admin-auth";

const ADMIN_LOGIN_PATH = "/admin/login";

function redirectToLogin(req: NextRequest) {
  const loginUrl = new URL(ADMIN_LOGIN_PATH, req.url);
  loginUrl.searchParams.set("next", req.nextUrl.pathname);

  const res = NextResponse.redirect(loginUrl);

  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return res;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === ADMIN_LOGIN_PATH) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return redirectToLogin(req);
  }

  try {
    await verifyAdminToken(token);
    return NextResponse.next();
  } catch {
    return redirectToLogin(req);
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
