import { getDaftarAlat } from "@/actions/alat-action";
import Link from "next/link";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  PackagePlus,
  ScanLine,
  Edit2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { logoutAdmin } from "@/actions/auth-action";
import DeleteAlatButton from "@/components/DeleteAlatButton";
import QuickActionButton from "@/components/QuickActionButton";

// Komponen Client
import SearchAlat from "@/components/SearchAlat";
import KategoriFilter from "@/components/KategoriFilter";
import PrintAlatButton from "@/components/PrintAlatButton";
import LimitAlatSelect from "@/components/LimitAlatSelect";

export const dynamic = "force-dynamic";

export default async function ListAlatPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    cat?: string;
    limit?: string;
  }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || "";
  const page = resolvedParams.page || "1";
  const cat = resolvedParams.cat || "";
  const limit = Number(resolvedParams.limit) || 10;

  const query = q;
  const currentPage = Number(page) || 1;
  const currentCat = cat;

  const session = await getAdminSession();
  if (!session) redirect("/login");

  const result = await getDaftarAlat(query, currentPage, limit, currentCat);

  const listAlat = result.data || [];
  const totalPages = result.totalPages || 1;
  const total = result.total || 0;

  return (
    <div className="p-6 md:p-10 bg-[#F8FAFC] min-h-screen font-sans">
      {/* --- HEADER DASHBOARD (Hilang saat print) --- */}
      <div className="no-print">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 no-print">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="h-8 w-1.5 bg-emerald-600 rounded-full"></span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">
                Inventaris <span className="text-emerald-600">Alat</span>
              </h1>
            </div>
            <p className="text-slate-500 font-medium ml-3 lowercase first-letter:uppercase">
              UPT PPHH Surabaya — Manajemen Aset & APD
            </p>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <PrintAlatButton />
            <Link
              href="/admin/alat/scan"
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border-2 border-slate-200 px-5 py-3 rounded-2xl font-bold shadow-sm transition-all active:scale-95"
            >
              <ScanLine size={18} className="text-emerald-600" />
              SCAN BARCODE
            </Link>
            <Link
              href="/admin/alat/tambah"
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95"
            >
              <PackagePlus size={18} />
              TAMBAH ALAT
            </Link>
            {/* TOMBOL BARU: AKSES KE LAPORAN/RIWAYAT */}
            <Link
              href="/admin/laporan"
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-white hover:bg-amber-400 text-slate-600 border-2 border-slate-200 px-5 py-3 rounded-2xl font-bold shadow-sm transition-all active:scale-95"
            >
              <FileText size={18} className="text-blue-600" />
              RIWAYAT
            </Link>
            <form action={logoutAdmin} className="flex-none">
              <button
                type="submit"
                className="group flex items-center justify-center p-3 bg-white hover:bg-rose-50 text-rose-500 border-2 border-rose-100 rounded-2xl transition-all shadow-sm active:scale-95"
              >
                <LogOut size={20} />
              </button>
            </form>
          </div>
        </div>

        {/* --- FILTER SECTION (Hilang saat print) --- */}
        <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 mb-8 flex flex-col md:flex-row gap-4 items-center no-print">
          <SearchAlat defaultValue={query} />
          <KategoriFilter defaultValue={currentCat} />
          <LimitAlatSelect currentLimit={limit.toString()} />
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-auto px-4 text-right">
            Total: <span className="text-emerald-600">{total}</span> Unit
          </div>
        </div>
      </div>

      {/* --- HEADER KHUSUS PRINT (Muncul hanya saat print) --- */}
      <div className="hidden print:block text-center mb-10 border-b-4 border-slate-900 pb-5">
        <h1 className="text-2xl font-black uppercase tracking-tighter">
          Laporan Inventaris Alat & APD
        </h1>
        <p className="font-bold text-slate-600 uppercase tracking-widest text-sm">
          UPT Pelayanan Pengelolaan Hasil Hutan Surabaya
        </p>
        <div className="flex justify-center gap-4 mt-2 text-[10px] font-mono uppercase text-slate-500">
          <span>Kategori: {currentCat || "Semua"}</span>
          <span>•</span>
          <span>Tanggal Cetak: {new Date().toLocaleDateString("id-ID")}</span>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden print:shadow-none print:border-slate-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white uppercase text-[10px] tracking-[0.2em] font-black border-b border-slate-100 print:bg-slate-900 print:text-white">
                <th className="p-8 print:p-4 border-b">
                  Informasi Detail Alat
                </th>
                <th className="p-8 print:p-4 border-b">Barcode</th>
                <th className="p-8 print:p-4 border-b">Kategori</th>
                <th className="p-8 print:p-4 border-b text-center">Status</th>
                <th className="p-8 print:p-4 border-b text-right no-print">
                  Manajemen
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 print:divide-slate-200">
              {listAlat.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-32 text-center text-slate-400 font-bold italic"
                  >
                    Data tidak ditemukan.
                  </td>
                </tr>
              ) : (
                listAlat.map((item: any) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/50 transition-all group print:break-inside-avoid"
                  >
                    <td className="p-8 print:p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors uppercase print:text-sm">
                          {item.namaAlat}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 print:text-[8px]">
                          Pos: {item.pos.namaPos}
                        </span>
                      </div>
                    </td>
                    <td className="p-8 print:p-4">
                      <code className="font-mono bg-slate-100 px-3 py-1.5 rounded-lg text-sm text-slate-600 print:bg-transparent print:p-0 print:text-xs">
                        {item.barcode}
                      </code>
                    </td>
                    <td className="p-8 print:p-4">
                      <span className="text-[11px] font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border uppercase print:border-none print:bg-transparent print:text-xs">
                        {item.kategori}
                      </span>
                    </td>
                    <td className="p-8 print:p-4">
                      <div className="flex justify-center">
                        <StatusBadge status={item.status} />
                      </div>
                    </td>
                    <td className="p-8 print:p-4 text-right no-print">
                      <div className="flex justify-end items-center gap-2">
                        <QuickActionButton
                          id={item.id}
                          status={item.status}
                          nama={item.namaAlat}
                          petugas={session.username}
                          posId={session.posId}
                        />
                        <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>
                        <Link
                          href={`/admin/alat/edit/${item.id}`}
                          className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <DeleteAlatButton id={item.id} nama={item.namaAlat} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- PAGINATION (Hilang saat print) --- */}
      <div className="mt-10 flex flex-col md:flex-row items-center justify-between gap-4 no-print border-t border-slate-200 pt-8">
        <p className="text-[11px] font-black uppercase text-slate-400 tracking-widest">
          Halaman <span className="text-slate-900">{currentPage}</span> dari{" "}
          {totalPages}
        </p>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/alat?page=${currentPage - 1}&limit=${limit}${query ? `&q=${query}` : ""}${currentCat ? `&cat=${currentCat}` : ""}`}
            className={`flex items-center gap-1 px-5 py-2.5 rounded-xl border bg-white text-[10px] font-black uppercase transition-all ${
              currentPage <= 1
                ? "opacity-30 pointer-events-none"
                : "hover:bg-slate-900 hover:text-white"
            }`}
          >
            <ChevronLeft size={14} /> Prev
          </Link>

          <Link
            href={`/admin/alat?page=${currentPage + 1}&limit=${limit}${query ? `&q=${query}` : ""}${currentCat ? `&cat=${currentCat}` : ""}`}
            className={`flex items-center gap-1 px-5 py-2.5 rounded-xl border bg-white text-[10px] font-black uppercase transition-all ${
              currentPage >= totalPages
                ? "opacity-30 pointer-events-none"
                : "hover:bg-slate-900 hover:text-white"
            }`}
          >
            Next <ChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    TERSEDIA:
      "bg-emerald-50 text-emerald-600 border-emerald-100 print:text-emerald-700",
    KELUAR: "bg-amber-50 text-amber-600 border-amber-100 print:text-amber-700",
    RUSAK: "bg-rose-50 text-rose-600 border-rose-100 print:text-rose-700",
  };
  return (
    <span
      className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest shadow-sm print:shadow-none print:border-slate-200 ${styles[status]}`}
    >
      {status}
    </span>
  );
}
