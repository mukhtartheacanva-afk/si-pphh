"use server";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. Fungsi Tambah (Sekarang wajib bawa posId)
export async function simpanTamu(formData: FormData, posId: string) {
  const tglInput = formData.get("tanggalBerkunjung") as string;
  
  try {
    await db.guest.create({
      data: {
        nama: formData.get("nama") as string,
        alamat: formData.get("alamat") as string,
        asalPerusahaan: formData.get("asalPerusahaan") as string,
        jabatan: formData.get("jabatan") as string,
        noTelp: formData.get("noTelp") as string,
        keperluan: formData.get("keperluan") as string,
        tanggalBerkunjung: new Date(tglInput),
        // Relasi ke Pos Pelayanan
        posId: posId, 
      },
    });
    
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) { 
    return { error: "Gagal simpan data ke pos tersebut" }; 
  }
}

// 2. Fungsi Update (Edit)
export async function updateTamu(id: string, formData: FormData) {
  const tglInput = formData.get("tanggalBerkunjung") as string;
  
  const data = {
    tanggalBerkunjung: new Date(tglInput),
    nama: formData.get("nama") as string,
    alamat: formData.get("alamat") as string,
    asalPerusahaan: formData.get("asalPerusahaan") as string,
    jabatan: formData.get("jabatan") as string,
    noTelp: formData.get("noTelp") as string,
    keperluan: formData.get("keperluan") as string,
    // posId biasanya tidak diupdate kecuali tamu salah input pos
  };

  try {
    await db.guest.update({ where: { id }, data });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) { 
    return { error: "Gagal update data tamu" }; 
  }
}

// 3. Fungsi Hapus
export async function hapusTamu(id: string) {
  try {
    await db.guest.delete({ where: { id } });
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (e) { 
    return { error: "Gagal hapus data tamu" }; 
  }
}