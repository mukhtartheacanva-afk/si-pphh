"use client";

import Link from "next/link";
import { Printer, Plus, ArrowLeft } from "lucide-react";

export default function LaporanHeader() {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
      {/* BAGIAN INI TETAP MUNCUL PAS DI-PRINT */}
      <div>
        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-800">
          Laporan <span className="text-emerald-600">Inventaris</span>
        </h1>
        <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">
          UPT Pelayanan Pengelolaan Hasil Hutan • Surabaya
        </p>
      </div>

      {/* BAGIAN INI NGILANG PAS DI-PRINT (no-print) */}
      <div className="flex gap-2 no-print">
        <Link
          href="/admin/laporan/input-manual"
          className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-50 transition-all"
        >
          <Plus size={14} /> Input Manual
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
        >
          <Printer size={14} /> Cetak Laporan
        </button>
        <Link
          href="/admin/alat"
          className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-black uppercase hover:bg-amber-400 transition-all"
        >
          <ArrowLeft size={20} /> KEMBALI
        </Link>
      </div>
    </div>
  );
}
