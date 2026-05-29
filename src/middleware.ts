import { NextRequest, NextResponse } from "next/server";
import { verifySessionEdge } from "@/lib/auth-edge";

/**
 * Protects /admin and admin API routes at the edge.
 * Full role re-check still happens server-side in each API route (requireAdmin).
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only guard admin API namespace and /admin page
  const needsAdmin = pathname.startsWith("/api/admin") || pathname.startsWith("/admin");
  if (!needsAdmin) return NextResponse.next();

  const token = req.cookies.get("mt_session")?.value;
  const session = token ? await verifySessionEdge(token) : null;

  if (!session) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (session.role !== "admin") {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
