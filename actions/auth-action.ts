"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache"; 
import { createToken } from "@/lib/auth";

/**
 * LOGIN ADMIN
 */
export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  try {
    const admin = await db.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return { error: "Username atau password salah!" };
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return { error: "Username atau password salah!" };
    }

    const token = await createToken({
      id: admin.id,
      username: admin.username,
      role: admin.role,
      posId: admin.posId,
    });

    const cookieStore = await cookies();
    
    // --- PERBAIKAN DI SINI ---
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      // Di-set false dulu karena VPS belum pakai HTTPS (SSL)
      // Kalau ini true, cookie bakal ditolak browser di koneksi HTTP biasa
      secure: false, 
      maxAge: 60 * 60 * 24, // 24 Jam
      path: "/",
      sameSite: "lax",
    });

    return { success: true };
    
  } catch (error) {
    console.error("Login Error:", error);
    return { error: "Terjadi kesalahan pada sistem." };
  }
}

/**
 * LOGOUT ADMIN
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  
  // 1. Hapus cookie session
  cookieStore.delete("admin-token"); 

  // 2. PAKSA REFRESH CACHE
  revalidatePath("/admin", "layout"); 
  
  // 3. Balik ke login
  redirect("/");
}