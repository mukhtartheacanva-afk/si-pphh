import { db } from "@/lib/db";
import SearchTamu from "@/components/SearchTamu";
import { hapusTamu } from "@/actions/guest-action";
import PrintButton from "@/components/PrintButton";
import Link from "next/link";
import ModalTamu from "@/components/ModalTamu";
import { redirect } from "next/navigation";
import LimitSelect from "@/components/LimitSelect"; 
import FilterPeriode from "@/components/FilterPeriode";
import { logoutAdmin } from "@/actions/auth-action";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; modal?: string; id?: string; page?: string; limit?: string; bulan?: string; tahun?: string }>;
}) {
  const { query, modal, id, page, limit, bulan, tahun } = await searchParams;

  // --- 1. LOGIKA FILTER DATABASE (TETAP AMAN) ---
  const finalFilter: any = { AND: [] };

  if (query) {
    finalFilter.AND.push({
      OR: [
        { nama: { contains: query } },
        { asalPerusahaan: { contains: query } },
      ],
    });
  }

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

  const whereClause = finalFilter.AND.length > 0 ? finalFilter : {};

  // --- 2. LOGIKA PAGINATION & LIMIT ---
  const currentPage = Number(page) || 1;
  const pageSize = Number(limit) || 10;
  const skip = (currentPage - 1) * pageSize;

  // --- 3. AMBIL DATA DARI DB ---
  const totalTamu = await db.guest.count({ where: whereClause });
  const totalPages = Math.ceil(totalTamu / pageSize) || 1;

  const tamu = await db.guest.findMany({
    where: whereClause,
    orderBy: { tanggalBerkunjung: "desc" },
    take: pageSize,
    skip: skip,
  });

  const currentData = id ? await db.guest.findUnique({ where: { id } }) : null;

  const namaBulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  const teksPeriode = bulan ? `${namaBulan[parseInt(bulan) - 1]} ${tahun || ""}` : (tahun || "Semua Periode");

  return (
    <div className="min-h-screen bg-emerald-100 bg-[url('/motif-kayu.png')] bg-no-repeat bg-contain p-4 md:p-8 text-slate-900 font-sans">
      
      <div className="max-w-6xl mx-auto">
        
        {/* --- HEADER SECTION (POSISI LOGOUT DI KANAN) --- */}
        <div className="flex items-center justify-between mb-8 no-print">
          <div className="space-y-1">
            <h1 className="text-4xl font-extrabold tracking-tight text-amber-600">Monitoring Tamu</h1>
            <div className="flex items-center gap-2 text-slate-500">
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold uppercase">PPHH-Surabaya</span>
              <span className="text-sm">•</span>
              <p className="text-sm font-medium">Administrasi</p>
            </div>
          </div>

          {/* LOGOUT BUTTON ACTION */}
          <form action={logoutAdmin}>
            <button 
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-sm font-bold transition-all shadow-sm group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Keluar Sistem
            </button>
          </form>
        </div>

        {/* --- STATS & LIMIT SELECTOR (DIRAPIKAN AGAR TIDAK DESAKAN) --- */}
        <div className="mb-4 flex flex-col gap-4 no-print">
          
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <PrintButton />
              <div className="h-6 w-[1px] bg-slate-300 hidden md:block"></div>
              <Link 
                href="/admin/dashboard?modal=tambah"
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-md active:scale-95"
              >
                <span className="text-xl">+</span> Tambah Tamu
              </Link>
            </div>

            <p className="text-sm text-slate-500 bg-white/50 px-3 py-1 rounded-lg border border-slate-200">
              Menampilkan <span className="font-bold text-slate-800">{tamu.length}</span> dari <span className="font-bold text-slate-800">{totalTamu}</span> total kunjungan
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white/40 p-2 rounded-2xl border border-slate-200/50">
            <div className="flex-1 min-w-[250px]">
              <SearchTamu />
            </div> 
            <div className="flex flex-wrap items-center gap-2">
              <FilterPeriode />
              <div className="h-6 w-[1px] bg-slate-300 hidden md:block mx-1"></div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Baris:</span>
                <LimitSelect currentLimit={pageSize.toString()} />
              </div>
            </div>            
          </div>
        </div>

        {/* --- JUDUL CETAK DINAMIS --- */}
        <div className="hidden print:block mb-10 text-center border-b-4 border-double border-slate-800 pb-6">
          <h1 className="text-4xl font-extrabold uppercase tracking-widest text-black">Laporan Daftar Kunjungan Tamu</h1>
          <p className="text-xl font-bold text-slate-700 mt-2">PPHH Surabaya - Monitoring Kunjungan Tamu</p>
          <div className="mt-4 inline-block px-6 py-1 border-2 border-slate-800 font-black text-lg uppercase">
            Periode: {teksPeriode}
          </div>
          <div className="mt-4 text-sm text-slate-500 italic">
            Dicetak secara sistem pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>

        {/* --- TABLE SECTION (TETAP AMAN) --- */}
        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Waktu Kunjungan</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nama/Jabatan</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Asal/Alamat</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kontak</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Keperluan</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center no-print">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tamu.length > 0 ? (
                  tamu.map((item) => (
                    <tr key={item.id} className="hover:bg-indigo-50/30 transition-colors group">
                      <td className="p-4 text-sm font-bold text-slate-700">
                        {item.tanggalBerkunjung ? new Date(item.tanggalBerkunjung).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                      </td>
                      <td className="p-4 text-sm">
                        <div className="font-bold text-slate-800">{item.nama}</div>
                        <div className="text-xs text-slate-400 italic">{item.jabatan || "-"}</div>
                      </td>
                      <td className="p-4 text-sm">
                        <div className="font-semibold text-slate-700 leading-tight">{item.asalPerusahaan}</div>
                        <div className="text-xs text-slate-500 truncate max-w-[150px]">{item.alamat}</div>
                      </td>
                      <td className="p-4 text-sm italic">{item.noTelp}</td>
                      <td className="p-4 text-sm text-slate-600 line-clamp-2 max-w-[200px]">{item.keperluan}</td>
                      <td className="p-4 text-center no-print">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/dashboard?modal=edit&id=${item.id}&limit=${pageSize}&page=${currentPage}`} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg text-xs font-bold uppercase">Edit</Link>
                          <form action={async () => { "use server"; await hapusTamu(item.id); }}>
                            <button type="submit" className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold uppercase">Hapus</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={6} className="p-10 text-center text-slate-400 italic">Tidak ada data untuk periode ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* --- PAGINATION FOOTER (TETAP AMAN) --- */}
          <div className="p-5 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
            <p className="text-sm text-slate-500 font-medium">Halaman <span className="text-slate-900 font-bold">{currentPage}</span> dari <span className="text-slate-900 font-bold">{totalPages}</span></p>
            <div className="flex items-center gap-2">
              <Link href={`/admin/dashboard?page=${currentPage - 1}&limit=${pageSize}${query ? `&query=${query}` : ""}${bulan ? `&bulan=${bulan}` : ""}${tahun ? `&tahun=${tahun}` : ""}`} className={`px-5 py-2 rounded-xl border bg-white text-sm font-bold shadow-sm ${currentPage <= 1 ? "pointer-events-none opacity-40" : "hover:bg-slate-50"}`}>← Prev</Link>
              <Link href={`/admin/dashboard?page=${currentPage + 1}&limit=${pageSize}${query ? `&query=${query}` : ""}${bulan ? `&bulan=${bulan}` : ""}${tahun ? `&tahun=${tahun}` : ""}`} className={`px-5 py-2 rounded-xl border bg-white text-sm font-bold shadow-sm ${currentPage >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-slate-50"}`}>Next →</Link>
            </div>
          </div>
        </div>

        {modal && <ModalTamu type={modal} data={currentData} />}
      </div>
    </div>
  );
}