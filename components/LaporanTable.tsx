"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Trash2, Pencil } from "lucide-react";
import { hapusRiwayatMassal } from "@/actions/alat-action";
import Swal from "sweetalert2";
import Link from "next/link";

export default function LaporanTable({ riwayat }: { riwayat: any[] }) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Fungsi Toggle Centang Per Baris
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Fungsi Centang Semua
  const toggleAll = () => {
    if (selectedIds.length === riwayat.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(riwayat.map((item) => item.id));
    }
  };

  // Fungsi Eksekusi Hapus
  const handleHapus = async () => {
    const result = await Swal.fire({
      title: "Hapus Data?",
      text: `${selectedIds.length} data riwayat akan dihapus permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const res = await hapusRiwayatMassal(selectedIds);
      if (res.success) {
        Swal.fire("Terhapus!", "Data berhasil dibersihkan.", "success");
        setSelectedIds([]);
      } else {
        Swal.fire("Gagal", res.error, "error");
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Tombol Hapus Massal - Muncul hanya jika ada yang dipilih */}
      <div
        className={`no-print transition-all ${selectedIds.length > 0 ? "opacity-100 h-auto" : "opacity-0 h-0 overflow-hidden"}`}
      >
        <button
          onClick={handleHapus}
          className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-2xl text-[10px] font-black uppercase shadow-lg shadow-red-100 hover:bg-red-600"
        >
          <Trash2 size={14} /> Hapus ({selectedIds.length}) Data Terpilih
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden p-2">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-5 no-print">
                <input
                  type="checkbox"
                  onChange={toggleAll}
                  checked={
                    selectedIds.length === riwayat.length && riwayat.length > 0
                  }
                  className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                Alat / Barcode
              </th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400">
                Petugas
              </th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-center">
                Keluar
              </th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-center">
                Kembali
              </th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-center">
                Kondisi
              </th>
              <th className="p-5 text-[10px] font-black uppercase text-slate-400 text-right no-print">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {riwayat.map((item) => (
              <tr
                key={item.id}
                className={`hover:bg-slate-50/50 transition-colors ${selectedIds.includes(item.id) ? "bg-emerald-50/30" : ""}`}
              >
                <td className="p-5 no-print">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => toggleSelect(item.id)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td className="p-5">
                  <div className="font-bold text-slate-700">
                    {item.alat.namaAlat}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">
                    {item.alat.barcode} • {item.alat.pos?.namaPos}
                  </div>
                </td>
                <td className="p-5 font-bold text-slate-600 text-sm uppercase">
                  {item.petugas}
                </td>
                <td className="p-5 text-center font-medium text-slate-500 text-[11px]">
                  {format(new Date(item.waktuKeluar), "dd/MM/yy HH:mm")}
                </td>
                <td className="p-5 text-center font-medium text-slate-500 text-[11px]">
                  {item.waktuKembali ? (
                    format(new Date(item.waktuKembali), "dd/MM/yy HH:mm")
                  ) : (
                    <span className="text-amber-500 font-bold italic">
                      Proses
                    </span>
                  )}
                </td>
                <td className="p-5 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[9px] font-black uppercase ${item.kondisiBalik === "RUSAK" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}
                  >
                    {item.kondisiBalik || "BAIK"}
                  </span>
                </td>
                <td className="p-5 text-right no-print">
                  <Link
                    href={`/admin/laporan/edit/${item.id}`}
                    className="p-2 text-slate-300 hover:text-emerald-600 transition-colors inline-block"
                  >
                    <Pencil size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
