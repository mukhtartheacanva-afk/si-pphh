"use client";

import { updateRiwayatManual } from "@/actions/alat-action";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, X, Save } from "lucide-react";

export default function EditRiwayatForm({ initialData }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      const res = await updateRiwayatManual(initialData.id, formData);
      if (res.success) {
        await Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Data riwayat telah diperbarui.",
          confirmButtonColor: "#059669",
        });
        router.push("/admin/laporan");
        router.refresh();
      } else {
        throw new Error(res.error);
      }
    } catch (error: any) {
      Swal.fire("Gagal", error.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-50 space-y-8"
    >
      {/* INFO ALAT */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] block mb-2">
          Nama Alat
        </label>
        <p className="font-black text-xl text-slate-800 italic uppercase italic leading-none">
          {initialData.alat.namaAlat}
        </p>
        <p className="text-[10px] font-mono text-slate-400 mt-1">
          {initialData.alat.barcode}
        </p>
      </div>

      {/* INPUT PETUGAS */}
      <div>
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] block mb-3">
          Nama Petugas
        </label>
        <input
          name="petugas"
          defaultValue={initialData.petugas}
          className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500/20 transition-all uppercase"
          placeholder="Nama Admin / Petugas..."
          required
        />
      </div>

      {/* INPUT TANGGAL */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] block mb-3">
            Waktu Keluar
          </label>
          <input
            name="tglKeluar"
            type="datetime-local"
            defaultValue={new Date(initialData.waktuKeluar)
              .toISOString()
              .slice(0, 16)}
            className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            required
          />
        </div>
        <div>
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] block mb-3">
            Waktu Kembali
          </label>
          <input
            name="tglKembali"
            type="datetime-local"
            defaultValue={
              initialData.waktuKembali
                ? new Date(initialData.waktuKembali).toISOString().slice(0, 16)
                : ""
            }
            className="w-full p-4 bg-slate-50 rounded-2xl border-none outline-none font-bold text-slate-600 focus:ring-2 focus:ring-emerald-500/20 transition-all"
          />
        </div>
      </div>

      {/* TOMBOL AKSI */}
      <div className="flex flex-col md:flex-row gap-4 pt-4">
        {/* Tombol Cancel */}
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-4 bg-white border border-slate-200 text-slate-400 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 hover:text-slate-600 transition-all flex items-center justify-center gap-2"
        >
          <X size={14} /> Batal / Kembali
        </button>

        {/* Tombol Simpan */}
        <button
          type="submit"
          disabled={loading}
          className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-slate-200 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            <Save size={14} />
          )}
          {loading ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}
