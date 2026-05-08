"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache"; // <--- TAMBAHKAN INI
import { createToken } from "@/lib/auth";

/**
 * LOGIN ADMIN (Tetap sama, sudah OK)
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
    cookieStore.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
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
 * LOGOUT ADMIN (Update bagian revalidate)
 */
export async function logoutAdmin() {
  const cookieStore = await cookies();
  
  // 1. Hapus cookie session
  cookieStore.delete("admin-token"); 

  // 2. PAKSA REFRESH CACHE (Ini obat buat error Unexpected Response tadi)
  // Menghapus cache semua halaman di bawah folder /admin
  revalidatePath("/admin", "layout"); 
  
  // 3. Balik ke login
  redirect("/");
}