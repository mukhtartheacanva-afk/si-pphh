import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("admin-token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Proteksi Halaman Admin
  if (pathname.startsWith("/admin")) {
    // Jika tidak ada token
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      // Simpan halaman yang mau diakses (misal: /admin/alat) agar bisa balik lagi setelah login
      loginUrl.searchParams.set("callback", pathname); 
      return NextResponse.redirect(loginUrl);
    }

    // Verifikasi token secara asinkron
    const payload = await verifyToken(token);
    
    // Jika token tidak valid atau expired
    if (!payload) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("admin-token"); // Bersihkan sisa token
      return response;
    }
  }

  // 2. Cegah Admin Balik ke Login kalau sudah login
  if (pathname === "/login" && token) {
    const payload = await verifyToken(token);
    
    if (payload) {
      // Jika sudah login tapi iseng buka halaman /login, lempar ke dashboard utama
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Mencegat semua request di folder /admin dan halaman /login
     * Tidak mencegat file statis, api, dll.
     */
    '/admin/:path*',
    '/login',
  ],
};