"use client";
import { useRouter } from "next/navigation";
import { simpanTamu, updateTamu } from "@/actions/guest-action";
import Swal from 'sweetalert2'; // Pakai Swal agar seragam

export default function ModalTamu({ type, data, listPos }: { type: string; data?: any; listPos?: any[] }) {
  const router = useRouter();

  const formatTanggalKeInput = (date: any) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };

  async function handleSubmit(formData: FormData) {
    // AMBIL posId dari form (untuk tambah baru)
    const selectedPosId = formData.get("posId") as string;

    const res = type === "edit" 
      ? await updateTamu(data.id, formData) 
      : await simpanTamu(formData, selectedPosId); // KIRIM posId ke sini

    if (res.success) {
      Swal.fire('Berhasil!', 'Data telah diperbarui.', 'success');
      router.push("/admin/dashboard"); 
      router.refresh(); // Paksa refresh data tabel
    } else {
      Swal.fire('Gagal', res.error, 'error');
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 text-black text-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl">
        <h2 className="text-xl font-bold mb-4">
          {type === "edit" ? "✏️ Edit Data Tamu" : "➕ Tambah Tamu Manual"}
        </h2>
        
        <form action={handleSubmit} className="space-y-3">
          
          {/* TAMBAHAN: Pilihan Pos Pelayanan (Hanya muncul jika tambah baru) */}
          {type !== "edit" && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-gray-400">Lokasi Pos Pelayanan</label>
              <select 
                name="posId" 
                className="w-full p-2 border rounded text-black bg-stone-50" 
                required
              >
                <option value="">-- Pilih Pos --</option>
                {listPos?.map((pos) => (
                  <option key={pos.id} value={pos.id}>{pos.namaPos}</option>
                ))}
              </select>
            </div>
          )}

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

          {/* Input lainnya tetap sama */}
          <input name="nama" defaultValue={data?.nama} placeholder="Nama Lengkap" className="w-full p-2 border rounded" required />
          <input name="alamat" defaultValue={data?.alamat} placeholder="Alamat" className="w-full p-2 border rounded" required />
          <input name="asalPerusahaan" defaultValue={data?.asalPerusahaan} placeholder="Instansi" className="w-full p-2 border rounded" required />
          <input name="jabatan" defaultValue={data?.jabatan} placeholder="Jabatan" className="w-full p-2 border rounded" required />
          <input name="noTelp" defaultValue={data?.noTelp} placeholder="No. Telp" className="w-full p-2 border rounded" required />
          <textarea name="keperluan" defaultValue={data?.keperluan} placeholder="Keperluan" className="w-full p-2 border rounded h-24" required />
          
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => router.push("/admin/dashboard")} className="flex-1 py-2 bg-stone-100 rounded-lg font-bold hover:bg-stone-200 transition-all">Batal</button>
            <button type="submit" className="flex-1 py-2 bg-emerald-600 rounded-lg text-white font-bold hover:bg-emerald-700 shadow-md transition-all">Simpan Data</button>
          </div>
        </form>
      </div>
    </div>
  );
}