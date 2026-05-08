"use server";

import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * 1. FUNGSI AMBIL DATA
 */
export async function getDaftarAlat(query?: string, page = 1, limit = 10, kategori?: string) {
  try {
    const session = await getAdminSession();
    if (!session) return { error: "Unauthorized" };

    const skip = (page - 1) * limit;

    const where: any = {
      AND: [
        session.role !== "SUPERADMIN" ? { posId: session.posId } : {},
        kategori ? { kategori: kategori } : {},
        query ? {
          OR: [
            { namaAlat: { contains: query } },
            { barcode: { contains: query } },
          ],
        } : {},
      ],
    };

    const [data, total] = await Promise.all([
      db.alat.findMany({
        where,
        include: { pos: true },
        orderBy: { namaAlat: "asc" },
        take: limit,
        skip: skip,
      }),
      db.alat.count({ where })
    ]);
    
    return { 
      data, 
      total, 
      totalPages: Math.ceil(total / limit) || 1 
    };
  } catch (e) {
    console.error("DATABASE ERROR:", e);
    return { error: "Gagal mengambil data" };
  }
}

/**
 * 2. FUNGSI TAMBAH ALAT
 */
export async function tambahAlat(formData: FormData) {
  try {
    const session = await getAdminSession();
    if (!session) return { error: "Unauthorized" };

    const namaAlat = formData.get("namaAlat") as string;
    const barcode = formData.get("barcode") as string;
    const kategori = formData.get("kategori") as string;
    const posId = formData.get("posId") as string;

    const existing = await db.alat.findUnique({ where: { barcode } });
    if (existing) return { success: false, error: "Barcode sudah terdaftar!" };

    await db.alat.create({
      data: { namaAlat, barcode, kategori, posId, status: "TERSEDIA" },
    });

    revalidatePath("/admin/alat");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Gagal menyimpan data alat." };
  }
}

/**
 * 3. FUNGSI PINJAM ALAT
 */
export async function pinjamAlat(barcode: string, petugas: string, posId: string) {
  try {
    const alat = await db.alat.findUnique({
      where: { barcode },
      include: { pos: true }
    });

    if (!alat) throw new Error("Alat tidak ditemukan!");
    if (posId && alat.posId !== posId) {
      throw new Error(`Alat milik ${alat.pos.namaPos}, Anda tidak bisa memprosesnya.`);
    }

    if (alat.status === "KELUAR") throw new Error("Alat sedang dipinjam!");
    if (alat.status === "RUSAK") throw new Error("Alat rusak!");

    await db.$transaction([
      db.alat.update({
        where: { id: alat.id },
        data: { status: "KELUAR" }
      }),
      db.checklist.create({
        data: {
          alatId: alat.id,
          petugas,
          status: "BELUM_KEMBALI"
        }
      })
    ]);

    revalidatePath("/admin/alat");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 4. FUNGSI KEMBALI ALAT
 */
export async function kembaliAlat(barcode: string, kondisi: string) {
  try {
    // 1. Cari alat
    const alat = await db.alat.findUnique({ where: { barcode } });
    if (!alat) throw new Error("Alat tidak terdaftar!");

    // 2. Cari log peminjaman aktif
    const logAktif = await db.checklist.findFirst({
      where: { alatId: alat.id, status: "BELUM_KEMBALI" },
      orderBy: { waktuKeluar: 'desc' }
    });

    if (!logAktif) throw new Error("Data peminjaman aktif tidak ditemukan (Alat sudah di gudang).");

    // 3. Update data
    await db.$transaction([
      db.alat.update({
        where: { id: alat.id },
        data: { status: kondisi === "RUSAK" ? "RUSAK" : "TERSEDIA" }
      }),
      db.checklist.update({
        where: { id: logAktif.id },
        data: {
          waktuKembali: new Date(),
          kondisiBalik: kondisi,
          status: "KEMBALI"
        }
      })
    ]);

    revalidatePath("/admin/alat");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 5. FUNGSI EDIT ALAT
 */
export async function editAlat(id: string, formData: FormData) {
  try {
    const namaAlat = formData.get("namaAlat") as string;
    const barcode = formData.get("barcode") as string;
    const kategori = formData.get("kategori") as string;
    const posId = formData.get("posId") as string;
    const status = formData.get("status") as string;

    await db.alat.update({
      where: { id },
      data: { namaAlat, barcode, kategori, posId, status }
    });

    revalidatePath("/admin/alat");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal memperbarui data" };
  }
}

/**
 * 6. FUNGSI HAPUS ALAT
 */
export async function hapusAlat(id: string) {
  try {
    await db.alat.delete({ where: { id } });
    revalidatePath("/admin/alat");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal menghapus data." };
  }
}

/**
 * 7. FUNGSI INPUT MANUAL RIWAYAT KELUAR DAN MASUK
 */
export async function inputManualRiwayat(formData: FormData) {
  try {
    const barcode = formData.get("barcode") as string;
    const petugas = formData.get("petugas") as string;
    const tglKeluar = formData.get("tglKeluar") as string;
    const tglKembali = formData.get("tglKembali") as string;
    const kondisi = formData.get("kondisi") as string;

    // 1. Cari alatnya
    const alat = await db.alat.findUnique({ where: { barcode } });
    if (!alat) throw new Error("Barcode alat tidak ditemukan di database!");

    // 2. Simpan ke tabel checklist
    await db.checklist.create({
      data: {
        alatId: alat.id,
        petugas: petugas,
        waktuKeluar: new Date(tglKeluar),
        waktuKembali: tglKembali ? new Date(tglKembali) : null,
        kondisiBalik: kondisi || "BAIK",
        status: tglKembali ? "KEMBALI" : "BELUM_KEMBALI"
      }
    });

    revalidatePath("/admin/laporan");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 8. FUNGSI UPDATE RIWAYAT KELUAR DAN MASUK
 */
export async function updateRiwayatManual(id: string, formData: FormData) {
  try {
    const petugas = formData.get("petugas") as string;
    const tglKeluar = formData.get("tglKeluar") as string;
    const tglKembali = formData.get("tglKembali") as string;

    await db.checklist.update({
      where: { id },
      data: {
        petugas,
        waktuKeluar: new Date(tglKeluar),
        waktuKembali: tglKembali ? new Date(tglKembali) : null,
        // Update status otomatis
        status: tglKembali ? "KEMBALI" : "BELUM_KEMBALI"
      }
    });

    revalidatePath("/admin/laporan");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * 9. FUNGSI HAPUS RIWAYAT KELUAR DAN MASUK
 */
export async function hapusRiwayatMassal(ids: string[]) {
  try {
    await db.checklist.deleteMany({
      where: {
        id: { in: ids }
      }
    });
    revalidatePath("/admin/laporan");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Gagal menghapus data riwayat." };
  }
}

/**
 * 10. FUNGSI TOMBOL SAKTI KELUAR DAN MASUK
 */
export async function toggleStatusAlat(id: string, petugas: string, posId: string) {
  try {
    const alat = await db.alat.findUnique({ where: { id } });
    if (!alat) throw new Error("Alat tidak ditemukan");

    if (alat.status === "TERSEDIA") {
      // PROSES PINJAM OTOMATIS
      await db.$transaction([
        db.alat.update({ where: { id }, data: { status: "KELUAR" } }),
        db.checklist.create({
          data: {
            alatId: id,
            petugas,
            status: "BELUM_KEMBALI"
          }
        })
      ]);
    } else if (alat.status === "KELUAR") {
      // PROSES KEMBALI OTOMATIS
      const logAktif = await db.checklist.findFirst({
        where: { alatId: id, status: "BELUM_KEMBALI" },
        orderBy: { waktuKeluar: 'desc' }
      });

      await db.$transaction([
        db.alat.update({ where: { id }, data: { status: "TERSEDIA" } }),
        db.checklist.update({
          where: { id: logAktif?.id },
          data: {
            waktuKembali: new Date(),
            kondisiBalik: "BAIK",
            status: "KEMBALI"
          }
        })
      ]);
    }

    revalidatePath("/admin/alat");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}