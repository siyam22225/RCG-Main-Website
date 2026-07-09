import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/admin-auth";

export async function requireAdminApi() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await verifyAdminToken(token);
    return null;
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
