"use client"; // Wajib karena ada onClick

import { hapusTamu } from "@/actions/guest-action";
import Swal from "sweetalert2";

export default function DeleteButton({ id }: { id: string }) {
  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data kunjungan ini akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48", // rose-600
      cancelButtonColor: "#64748b", // slate-500
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const res = await hapusTamu(id);
      if (res?.success) {
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      } else {
        Swal.fire("Gagal!", "Gagal menghapus data.", "error");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-[10px] font-black text-rose-500 hover:text-rose-700 transition-colors uppercase"
    >
      Hapus
    </button>
  );
}