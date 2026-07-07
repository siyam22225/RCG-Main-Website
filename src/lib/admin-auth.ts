import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const adminJwtSecret = process.env.ADMIN_JWT_SECRET;

if (!adminJwtSecret) {
  throw new Error("ADMIN_JWT_SECRET is missing in .env");
}

const secret = new TextEncoder().encode(adminJwtSecret);

export type AdminRole = "super_admin" | "admin";

export type AdminTokenPayload = JWTPayload & {
  id: string;
  email: string;
  role: AdminRole;
};

export async function createAdminToken(payload: {
  id: string;
  email: string;
  role: AdminRole;
}) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyAdminToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload as AdminTokenPayload;
}