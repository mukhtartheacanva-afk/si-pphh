// app/admin/dashboard/page.tsx
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth"; // Import helper session lo
import { redirect } from "next/navigation";

// Komponen Internal
import SearchTamu from "@/components/SearchTamu";
import PrintButton from "@/components/PrintButton";
import ModalTamu from "@/components/ModalTamu";
import LimitSelect from "@/components/LimitSelect";
import FilterPeriode from "@/components/FilterPeriode";
import DeleteButton from "@/components/DeleteButton";

// Auth & Session
import { logoutAdmin } from "@/actions/auth-action";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface DashboardProps {
  searchParams: Promise<{
    query?: string;
    modal?: string;
    id?: string;
    page?: string;
    limit?: string;
    bulan?: string;
    tahun?: string;
  }>;
}

export default async function AdminDashboard({ searchParams }: DashboardProps) {
  const { query, modal, id, page, limit, bulan, tahun } = await searchParams;

  // --- 1. AUTHENTICATION & ROLE CHECK ---
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  if (!token) redirect("/login");

  const adminSession = await verifyToken(token);
  if (!adminSession) redirect("/login");

  const adminDetail = await db.admin.findUnique({
    where: { id: adminSession.id },
    include: { pos: true },
  });

  // --- 2. LOGIKA FILTER DATABASE (KETAT) ---
  const finalFilter: any = { AND: [] };

  // 1. Kunci berdasarkan Role (Wajib)
  // Catatan: Di Schema lo role-nya "PETUGAS", di kodingan dashboard sebelumnya lo tulis "POS".
  // Gue pakai logic: Jika bukan SUPERADMIN, maka wajib filter posId.
  if (adminDetail?.role !== "SUPERADMIN") {
    finalFilter.AND.push({ posId: adminDetail?.posId });
  }

  // 2. Tambahkan filter pencarian jika ada
  if (query) {
    finalFilter.AND.push({
      OR: [
        { nama: { contains: query, mode: "insensitive" } },
        { asalPerusahaan: { contains: query, mode: "insensitive" } },
      ],
    });
  }

  // 3. Tambahkan filter periode jika ada
  if (bulan || tahun) {
    const thn = tahun ? parseInt(tahun) : new Date().getFullYear();
    if (bulan) {
      const bln = parseInt(bulan);
      finalFilter.AND.push({
        tanggalBerkunjung: {
          gte: new Date(thn, bln - 1, 1),
          lte: new Date(thn, bln, 0, 23, 59, 59),
        },
      });
    } else {
      finalFilter.AND.push({
        tanggalBerkunjung: {
          gte: new Date(thn, 0, 1),
          lte: new Date(thn, 11, 31, 23, 59, 59),
        },
      });
    }
  }

  // SEKARANG: whereClause tidak akan pernah kosong {} untuk Admin Pos
  const whereClause = finalFilter;

  // --- 3. DATA FETCHING ---
  const currentPage = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const skip = (currentPage - 1) * pageSize;

  const [totalTamu, tamu, allPos] = await Promise.all([
    db.guest.count({ where: whereClause }),
    db.guest.findMany({
      where: whereClause,
      include: { pos: true },
      orderBy: { tanggalBerkunjung: "desc" },
      take: pageSize,
      skip: skip,
    }),
    db.pos.findMany({ orderBy: { namaPos: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalTamu / pageSize) || 1;
  const currentData = id ? await db.guest.findUnique({ where: { id } }) : null;
  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const teksPeriode = bulan
    ? `${namaBulan[parseInt(bulan) - 1]} ${tahun || ""}`
    : tahun || "Semua Periode";

  return (
    <div
      className="min-h-screen bg-emerald-50 p-4 md:p-8 text-slate-900 font-sans selection:bg-amber-200"
      style={{
        backgroundImage: "url('/motif-daun.png')", // Ganti dengan path gambar daun lo
        backgroundSize: "500px", // Ukuran daunnya disesuaikan aja
        backgroundRepeat: "no-repeat",
        backgroundPosition: "top left", // INI KUNCINYA: pindah ke pojok kiri atas
        backgroundAttachment: "fixed", // Biar pas scroll daunnya tetep di situ
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 no-print">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-amber-900 uppercase">
              Monitoring Tamu
            </h1>
            {/* Bagian Badge di Header */}
            <div className="flex items-center gap-2 mt-1">
              {adminDetail?.role === "SUPERADMIN" ? (
                <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                  🌐 Admin Pusat
                </span>
              ) : (
                <span className="bg-emerald-700 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-sm">
                  📍 Pos: {adminDetail?.pos?.namaPos || "Tidak Terdaftar"}
                </span>
              )}
              <span className="text-slate-300">|</span>
              <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">
                UPT. Pelayanan Pengelolaan Hasil Hutan
              </p>
            </div>
          </div>

          <form action={logoutAdmin}>
            <button
              type="submit"
              className="px-6 py-2.5 bg-white hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-100 rounded-2xl text-xs font-black transition-all shadow-sm active:scale-95 uppercase tracking-widest"
            >
              Keluar Sistem
            </button>
          </form>
        </div>

        {/* CONTROLS */}
        <div className="mb-6 flex flex-col gap-4 no-print">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PrintButton />
              <Link
                href="/admin/dashboard?modal=tambah"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-black transition-all shadow-lg active:scale-95 text-xs uppercase tracking-tighter"
              >
                + Tambah Tamu Manual
              </Link>
            </div>
            <div className="text-[11px] font-black text-slate-500 bg-white/80 backdrop-blur px-4 py-2 rounded-xl border border-white shadow-sm uppercase">
              Total Data:{" "}
              <span className="text-indigo-600 font-black">{totalTamu}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 bg-white/40 p-2 rounded-[2rem] border border-white/60 backdrop-blur-sm shadow-inner">
            <div className="md:col-span-7">
              <SearchTamu />
            </div>
            <div className="md:col-span-5 flex items-center gap-2">
              <FilterPeriode />
              <LimitSelect currentLimit={pageSize.toString()} />
            </div>
          </div>
        </div>
        {/* --- JUDUL CETAK DINAMIS --- */}
        <div className="hidden print:block mb-10 text-center border-b-4 border-double border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold uppercase tracking-widest text-black">
            Laporan Daftar Kunjungan Tamu
          </h1>
          <p className="text-xl font-bold text-slate-700 mt-2">
            PPHH Surabaya - Monitoring Kunjungan Tamu
          </p>
          <div className="mt-4 inline-block px-6 py-1 border-2 border-slate-800 font-black text-lg uppercase">
            Periode: {teksPeriode}
          </div>
          {/* <div className="mt-4 text-sm text-slate-500 italic">
            Dicetak secara sistem pada:{" "}
            {new Date().toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div> */}
        </div>
        {/* TABLE */}
        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-[2.5rem] border border-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white/90">
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest">
                    Waktu
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest">
                    Identitas
                  </th>
                  {adminDetail?.role === "PUSAT" && (
                    <th className="p-5 text-[10px] font-black uppercase tracking-widest">
                      Lokasi
                    </th>
                  )}
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest">
                    Instansi
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest">
                    Keperluan
                  </th>
                  <th className="p-5 text-[10px] font-black uppercase tracking-widest text-center no-print">
                    Opsi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tamu.length > 0 ? (
                  tamu.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-amber-50/50 transition-colors group"
                    >
                      <td className="p-5 text-xs font-black text-slate-500">
                        {new Date(item.tanggalBerkunjung).toLocaleDateString(
                          "id-ID",
                          { day: "2-digit", month: "short", year: "numeric" },
                        )}
                      </td>
                      <td className="p-5">
                        <div className="font-black text-slate-800 uppercase text-xs tracking-tight">
                          {item.nama}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold italic">
                          {item.jabatan || "-"}
                        </div>
                      </td>
                      {adminDetail?.role === "PUSAT" && (
                        <td className="p-5">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded-lg text-[9px] font-black uppercase">
                            {item.pos?.namaPos || "Umum"}
                          </span>
                        </td>
                      )}
                      <td className="p-5">
                        <div className="text-xs font-bold text-slate-700 leading-tight">
                          {item.asalPerusahaan}
                        </div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                          {item.alamat}
                        </div>
                      </td>
                      <td className="p-5 text-xs text-slate-600 italic leading-relaxed max-w-[220px]">
                        "{item.keperluan}"
                      </td>
                      <td className="p-5 no-print">
                        <div className="flex items-center justify-center gap-4">
                          <Link
                            href={`/admin/dashboard?modal=edit&id=${item.id}`}
                            className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase"
                          >
                            Edit
                          </Link>
                          <DeleteButton id={item.id} />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-20 text-center">
                      <div className="flex flex-col items-center opacity-20 italic">
                        <span className="text-4xl mb-2">📂</span>
                        <p className="font-black uppercase text-xs tracking-widest">
                          Data tidak ditemukan
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          <div className="p-6 bg-slate-50/80 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 no-print">
            <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
              Halaman <span className="text-slate-800">{currentPage}</span> dari{" "}
              {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/dashboard?page=${currentPage - 1}&limit=${pageSize}${query ? `&query=${query}` : ""}${bulan ? `&bulan=${bulan}` : ""}${tahun ? `&tahun=${tahun}` : ""}`}
                className={`px-5 py-2 rounded-xl border bg-white text-[10px] font-black uppercase shadow-sm transition-all ${currentPage <= 1 ? "pointer-events-none opacity-30" : "hover:bg-slate-900 hover:text-white"}`}
              >
                Prev
              </Link>
              <Link
                href={`/admin/dashboard?page=${currentPage + 1}&limit=${pageSize}${query ? `&query=${query}` : ""}${bulan ? `&bulan=${bulan}` : ""}${tahun ? `&tahun=${tahun}` : ""}`}
                className={`px-5 py-2 rounded-xl border bg-white text-[10px] font-black uppercase shadow-sm transition-all ${currentPage >= totalPages ? "pointer-events-none opacity-30" : "hover:bg-slate-900 hover:text-white"}`}
              >
                Next
              </Link>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {modal && (
          <ModalTamu type={modal} data={currentData} listPos={allPos} />
        )}
      </div>
      {/* FOOTER KHUSUS PRINT UNTUK NOMOR HALAMAN */}
      <div className="footer-print no-print-screen">
        <div className="page-number"></div>
      </div>
    </div>
  );
}
