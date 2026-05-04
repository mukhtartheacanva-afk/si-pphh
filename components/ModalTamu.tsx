"use client";
import { useRouter } from "next/navigation";
import { simpanTamu, updateTamu } from "@/actions/guest-action";

export default function ModalTamu({ type, data }: { type: string; data?: any }) {
  const router = useRouter();

  // Fungsi helper agar tanggal dari DB bisa dibaca oleh input date (YYYY-MM-DD)
  const formatTanggalKeInput = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    // Kita ambil bagian tanggalnya saja: 2026-05-02
    return d.toISOString().split("T")[0];
  };

  async function handleSubmit(formData: FormData) {
    const res = type === "edit" 
      ? await updateTamu(data.id, formData) 
      : await simpanTamu(formData);

    if (res.success) {
      router.push("/admin/dashboard"); 
    } else {
      alert(res.error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-black">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {type === "edit" ? "✏️ Edit Data Tamu" : "➕ Tambah Tamu Manual"}
        </h2>
        <form action={handleSubmit} className="space-y-3">
          {/* PERBAIKAN DI SINI: name tetap tanggalBerkunjung, defaultValue pakai helper */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-gray-400">Tanggal Berkunjung</label>
            <input 
              name="tanggalBerkunjung" 
              type="date" 
              defaultValue={data ? formatTanggalKeInput(data.tanggalBerkunjung) : formatTanggalKeInput(new Date())} 
              className="w-full p-2 border rounded text-black" 
              required 
            />
          </div>

          <input name="nama" defaultValue={data?.nama} placeholder="Nama Lengkap" className="w-full p-2 border rounded text-black" required />
          <input name="alamat" defaultValue={data?.alamat} placeholder="Alamat" className="w-full p-2 border rounded text-black" required />
          <input name="asalPerusahaan" defaultValue={data?.asalPerusahaan} placeholder="Instansi" className="w-full p-2 border rounded text-black" required />
          <input name="jabatan" defaultValue={data?.jabatan} placeholder="Jabatan" className="w-full p-2 border rounded text-black" required />
          <input name="noTelp" defaultValue={data?.noTelp} placeholder="No. Telp" className="w-full p-2 border rounded text-black" required />
          <textarea name="keperluan" defaultValue={data?.keperluan} placeholder="Keperluan" className="w-full p-2 border rounded text-black h-24" required />
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => router.push("/admin/dashboard")} className="flex-1 py-2 bg-gray-100 rounded-lg font-bold">Batal</button>
            <button type="submit" className="flex-1 py-2 bg-blue-600 rounded-lg text-white font-bold">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  );
}