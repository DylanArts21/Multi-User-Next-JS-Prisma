import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

/**
 * Middleware untuk proteksi dashboard:
 * - Akses ke /_next, /api/auth, file statis, dan favicon dibiarkan lewat.
 * - Jika tidak ada token dan mengakses /dashboard -> redirect ke /api/auth/signin (callbackUrl diset).
 * - /dashboard/admin/* -> hanya role === "ADMIN"
 * - /dashboard/user/*  -> hanya role === "USER"
 */

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // allow next internals, auth endpoints, and static files (by extension)
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/auth") ||
    pathname === "/favicon.ico" ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // only run middleware for dashboard paths (config.matcher below),
  // but keep this guard in case config changes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // ambil token (next-auth)
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Normalisasi role
  const role = (token?.role || "").toString();

  // Jika mengakses /dashboard -> arahkan ke halaman role-specific
  if (pathname === "/dashboard" || pathname === "/dashboard/") {
    if (role === "admin") {
      return NextResponse.redirect(new URL("/dashboard/admin", req.url));
    }
    if (role === "user") {
      return NextResponse.redirect(new URL("/dashboard/user", req.url));
    }
    // role tidak valid
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  // Hanya ADMIN boleh akses /dashboard/admin/*
  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  // Hanya USER boleh akses /dashboard/user/*
  if (pathname.startsWith("/dashboard/user") && role !== "user") {
    return NextResponse.redirect(new URL("/forbidden", req.url));
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/dashboard/:path*"],
};