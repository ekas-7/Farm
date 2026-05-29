import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME, FARMER_COOKIE_NAME, verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ── Admin routes ──────────────────────────────────────────────
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token) return NextResponse.redirect(new URL("/admin/login", req.url));
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  if (pathname === "/admin/login") {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }
  }

  // ── Farmer routes ─────────────────────────────────────────────
  if (pathname === "/farmer/dashboard") {
    const token = req.cookies.get(FARMER_COOKIE_NAME)?.value;
    if (!token) return NextResponse.redirect(new URL("/farmer/login", req.url));
    const payload = await verifyToken(token);
    if (!payload || payload.role !== "farmer") {
      return NextResponse.redirect(new URL("/farmer/login", req.url));
    }
  }

  if (pathname === "/farmer/login" || pathname === "/farmer/register") {
    const token = req.cookies.get(FARMER_COOKIE_NAME)?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload?.role === "farmer") {
        return NextResponse.redirect(new URL("/farmer/dashboard", req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/farmer/dashboard", "/farmer/login", "/farmer/register"],
};
