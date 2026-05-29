import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "./supabase";

const SECRET   = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me");
const COOKIE   = "mt_session";
const MAX_AGE  = 60 * 60 * 24 * 30; // 30 days

export interface SessionData {
  userId: string;
  email: string;
  role: "student" | "admin";
}

export async function signSession(data: SessionData): Promise<string> {
  return await new SignJWT(data as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(SECRET);
}

export async function verifySession(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionData | null> {
  const c = cookies().get(COOKIE);
  if (!c) return null;
  return await verifySession(c.value);
}

export async function setSessionCookie(data: SessionData) {
  const token = await signSession(data);
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE
  });
}

export function clearSessionCookie() {
  cookies().delete(COOKIE);
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/** Requires an admin session — throws/responds 401/403 from API routes */
export async function requireAdmin(): Promise<SessionData> {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHORIZED");
  if (s.role !== "admin") throw new Error("FORBIDDEN");
  return s;
}

/** Requires any authenticated user */
export async function requireUser(): Promise<SessionData> {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHORIZED");
  return s;
}

/** Fetches the full user row from DB */
export async function getCurrentUser() {
  const s = await getSession();
  if (!s) return null;
  const { data } = await supabaseAdmin
    .from("users")
    .select("id, email, full_name, phone, role, group_ids, access_grants, created_at")
    .eq("id", s.userId)
    .single();
  return data;
}
