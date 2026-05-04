// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("admin_session");
  const isLoginPage = request.nextUrl.pathname.startsWith("/login");
  const isAdminPage = request.nextUrl.pathname.startsWith("/admin");

  // Jika mencoba akses /admin tapi belum login
  if (isAdminPage && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika sudah login tapi malah mau ke halaman login lagi
  if (isLoginPage && session) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

// Hanya proteksi folder admin dan login
export const config = {
  matcher: ["/admin/:path*", "/login"],
};