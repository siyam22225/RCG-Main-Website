import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-api-auth";
import { requireSameOriginAdminRequest } from "@/lib/admin-request-guard";

export async function POST(req: Request) {
  const invalidOrigin = requireSameOriginAdminRequest(req);
  if (invalidOrigin) return invalidOrigin;

  const unauthorized = await requireAdminApi();
  const res =
    unauthorized ??
    NextResponse.json(
      { success: true, message: "Logged out" },
      { status: 200 }
    );

  res.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });

  return res;
}
