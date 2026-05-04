"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. Fungsi Tambah (Bisa dipakai Guest maupun Admin)
export async function simpanTamu(formData: FormData) {
  const tglInput = formData.get("tanggalBerkunjung") as string; // Ambil dari form
  const data = {
    nama: formData.get("nama") as string,
    alamat: formData.get("alamat") as string,
    asalPerusahaan: formData.get("asalPerusahaan") as string,
    jabatan: formData.get("jabatan") as string,
    noTelp: formData.get("noTelp") as string,
    keperluan: formData.get("keperluan") as string,
    // Convert string tanggal "YYYY-MM-DD" ke objek Date JS
    tanggalBerkunjung: new Date(tglInput),
  };

  try {
    await db.guest.create({ data });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) { return { error: "Gagal simpan" }; }
}

// 2. Fungsi Update (Edit)
export async function updateTamu(id: string, formData: FormData) {
  const tglInput = formData.get("tanggalBerkunjung") as string; // Ambil dari form
  const data = {
    // Convert string tanggal "YYYY-MM-DD" ke objek Date JS
    tanggalBerkunjung: new Date(tglInput),
    nama: formData.get("nama") as string,
    alamat: formData.get("alamat") as string,
    asalPerusahaan: formData.get("asalPerusahaan") as string,
    jabatan: formData.get("jabatan") as string,
    noTelp: formData.get("noTelp") as string,
    keperluan: formData.get("keperluan") as string,
  };

  try {
    await db.guest.update({ where: { id }, data });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) { return { error: "Gagal update" }; }
}

// 3. Fungsi Hapus
export async function hapusTamu(id: string) {
  try {
    await db.guest.delete({ where: { id } });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) { return { error: "Gagal hapus" }; }
}