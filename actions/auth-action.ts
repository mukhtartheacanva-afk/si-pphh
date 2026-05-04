// actions/auth-action.ts
"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * LOGIN ADMIN
 */
export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // 1. Cari user di database
  const admin = await db.admin.findUnique({
    where: { username },
  });

  if (!admin) {
    return { error: "Username atau password salah!" };
  }

  // 2. Cek password
  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    return { error: "Username atau password salah!" };
  }

  // 3. Set Cookie (Gunakan nama yang konsisten)
  const cookieStore = await cookies();
  cookieStore.set("admin_session", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24, // 24 jam
    path: "/",
    sameSite: "lax", // Tambahan proteksi CSRF standar
  });

  return { success: true };
}

/**
 * LOGOUT ADMIN
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  
  // SINKRONISASI: Hapus nama cookie yang sama dengan saat login
  cookieStore.delete("admin_session"); 
  
  // Tambahkan sedikit delay atau log jika perlu untuk debugging di dev
  // tapi biasanya redirect sudah cukup.
  redirect("/login");
}