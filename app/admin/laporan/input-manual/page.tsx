"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Calendar, User, Barcode } from "lucide-react";
import Link from "next/link";
import { inputManualRiwayat } from "@/actions/alat-action";
import Swal from "sweetalert2";

export default function InputManualPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await inputManualRiwayat(formData);

    if (res.success) {
      await Swal.fire("Berhasil!", "Riwayat manual telah disimpan.", "success");
      router.push("/admin/laporan");
      router.refresh();
    } else {
      Swal.fire("Gagal", res.error, "error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/admin/laporan"
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-6 transition-all font-bold text-xs"
        >
          <ArrowLeft size={16} /> KEMBALI KE LAPORAN
        </Link>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
          <div className="bg-slate-900 p-8 text-white">
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">
              Input <span className="text-emerald-400">Riwayat Manual</span>
            </h1>
            <p className="text-slate-400 text-xs mt-1 font-bold uppercase tracking-widest">
              Gunakan ini untuk input data susulan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Barcode */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Barcode Alat
                </label>
                <div className="relative">
                  <Barcode
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    name="barcode"
                    type="text"
                    placeholder="Contoh: HELEM01"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* Nama Petugas */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Nama Petugas
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    name="petugas"
                    type="text"
                    placeholder="Nama Lengkap"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* Tgl Keluar */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Waktu Keluar
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    required
                    name="tglKeluar"
                    type="datetime-local"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* Tgl Kembali */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                  Waktu Kembali (Opsional)
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    name="tglKembali"
                    type="datetime-local"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-700"
                  />
                </div>
              </div>
            </div>

            {/* Kondisi */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">
                Kondisi Saat Kembali
              </label>
              <select
                name="kondisi"
                className="w-full p-3 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500/20 outline-none font-bold text-slate-700"
              >
                <option value="BAIK">BAIK</option>
                <option value="RUSAK">RUSAK</option>
                <option value="HILANG">HILANG</option>
              </select>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 uppercase text-sm tracking-widest"
            >
              {loading ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save size={18} /> Simpan Riwayat
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
