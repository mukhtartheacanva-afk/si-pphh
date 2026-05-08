"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { editAlat } from "@/actions/alat-action";
import { Edit3, ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import Swal from "sweetalert2";

export default function FormEditAlat({
  initialData,
  listPos,
}: {
  initialData: any;
  listPos: any[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await editAlat(initialData.id, formData);
    setLoading(false);

    if (res.success) {
      await Swal.fire({
        title: "Berhasil Diupdate!",
        text: "Data alat telah diperbarui di database.",
        icon: "success",
        confirmButtonColor: "#0284c7",
      });
      router.push("/admin/alat");
      router.refresh();
    } else {
      Swal.fire({ title: "Gagal", text: res.error, icon: "error" });
    }
  }

  return (
    <>
      <Link
        href="/admin/alat"
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-6 group"
      >
        <ArrowLeft
          size={20}
          className="group-hover:-translate-x-1 transition-transform"
        />
        BATALKAN EDIT
      </Link>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
        <div className="bg-sky-600 p-8 text-white flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-2xl">
            <Edit3 size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">
              Edit Data Alat
            </h1>
            <p className="text-sky-100 text-sm font-medium">
              Ubah informasi aset ID: {initialData.barcode}
            </p>
          </div>
        </div>

        <form action={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Nama Peralatan
              </label>
              <input
                name="namaAlat"
                type="text"
                defaultValue={initialData.namaAlat}
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none font-bold transition-all"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Nomor Barcode
              </label>
              <input
                name="barcode"
                type="text"
                defaultValue={initialData.barcode}
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 font-mono uppercase transition-all"
                required
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Kategori
              </label>
              <select
                name="kategori"
                defaultValue={initialData.kategori}
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none font-bold transition-all"
                required
              >
                <option value="APD">🛡️ APD</option>
                <option value="UKUR">📏 ALAT UKUR</option>
                <option value="LAPANGAN">🌲 ALAT LAPANGAN</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Status Alat
              </label>
              <select
                name="status"
                defaultValue={initialData.status}
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none font-bold transition-all text-orange-600"
                required
              >
                <option value="TERSEDIA">✅ TERSEDIA</option>
                <option value="KELUAR">📦 SEDANG DIPINJAM</option>
                <option value="RUSAK">❌ RUSAK / PERBAIKAN</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Lokasi Pos
              </label>
              <select
                name="posId"
                defaultValue={initialData.posId}
                className="w-full mt-2 p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-sky-500 outline-none font-bold appearance-none transition-all"
                required
              >
                {listPos.map((pos) => (
                  <option key={pos.id} value={pos.id}>
                    📍 {pos.namaPos}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 flex items-center justify-center gap-3 bg-slate-900 hover:bg-black text-white p-5 rounded-2xl font-black text-lg shadow-lg disabled:bg-slate-300 transition-all active:scale-95"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save size={22} /> SIMPAN PERUBAHAN
              </>
            )}
          </button>
        </form>
      </div>
    </>
  );
}
