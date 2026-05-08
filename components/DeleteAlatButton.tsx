"use client";

import { hapusAlat } from "@/actions/alat-action";
import { Trash2 } from "lucide-react";
import Swal from "sweetalert2";

export default function DeleteAlatButton({
  id,
  nama,
}: {
  id: string;
  nama: string;
}) {
  const onClick = async () => {
    const result = await Swal.fire({
      title: "Hapus Alat?",
      text: `Anda akan menghapus ${nama} secara permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#be123c",
      cancelButtonColor: "#44403c",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      const res = await hapusAlat(id);
      if (res.success) {
        Swal.fire("Terhapus!", "Data alat telah dibuang.", "success");
      } else {
        Swal.fire("Gagal!", res.error, "error");
      }
    }
  };

  return (
    <button
      onClick={onClick}
      className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
    >
      <Trash2 size={18} />
    </button>
  );
}
