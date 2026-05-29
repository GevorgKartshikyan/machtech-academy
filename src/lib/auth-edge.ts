import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me");

export interface SessionData {
  userId: string;
  email: string;
  role: "student" | "admin";
}

/** Edge-runtime-safe JWT verification — used by middleware. No bcrypt/supabase. */
export async function verifySessionEdge(token: string): Promise<SessionData | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionData;
  } catch {
    return null;
  }
}
