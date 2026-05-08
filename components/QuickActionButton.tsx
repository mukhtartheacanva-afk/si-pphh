"use client";

import { toggleStatusAlat } from "@/actions/alat-action";
import { ArrowLeftRight, Loader2 } from "lucide-react";
import { useState } from "react";
import Swal from "sweetalert2";

export default function QuickActionButton({
  id,
  status,
  nama,
  petugas,
  posId,
}: any) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (status === "RUSAK") {
      Swal.fire(
        "Gagal",
        "Alat rusak tidak bisa dipinjam/dikembalikan secara cepat.",
        "error",
      );
      return;
    }

    const actionText =
      status === "TERSEDIA" ? "Pinjamkan (Keluar)" : "Kembalikan (Masuk)";

    const result = await Swal.fire({
      title: "Aksi Cepat",
      text: `${actionText} alat "${nama}" sekarang?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Proses!",
      confirmButtonColor: status === "TERSEDIA" ? "#10b981" : "#3b82f6",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      setLoading(true);
      const res = await toggleStatusAlat(id, petugas, posId);
      if (res.success) {
        Swal.fire({
          title: "Berhasil",
          text: "Status alat berhasil diupdate.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        Swal.fire("Gagal", res.error, "error");
      }
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center ${
        status === "TERSEDIA"
          ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white"
          : "bg-amber-50 text-amber-600 hover:bg-amber-600 hover:text-white"
      } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      title={status === "TERSEDIA" ? "Klik untuk Pinjam" : "Klik untuk Kembali"}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <ArrowLeftRight size={18} />
      )}
    </button>
  );
}
