"use client";
import { simpanTamu } from "@/actions/guest-action";
import { useRef, useState } from "react";
import Swal from 'sweetalert2'; // 1. Import SweetAlert2

export default function FormTamu() {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    const res = await simpanTamu(formData);
    setLoading(false);

    if (res?.success) {
      Swal.fire({
        title: 'Terima Kasih!',
        text: 'Data kunjungan Anda telah tersimpan.',
        icon: 'success',
        confirmButtonText: 'Oke',
        confirmButtonColor: '#10b981',
      });
      formRef.current?.reset();
    } else {
      alert(res?.error || "Terjadi kesalahan");
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {/* Baris 1: Nama */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
        <input name="nama" type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" placeholder="Contoh: Budi Santoso" />
      </div>

      {/* Baris 2: Alamat */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
        <input name="alamat" type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" placeholder="Alamat tinggal/kantor" />
      </div>

      {/* Baris 3: Perusahaan & Jabatan (Dibuat berdampingan di layar lebar) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asal Perusahaan</label>
          <input name="asalPerusahaan" type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" placeholder="Nama instansi/PT" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
          <input name="jabatan" type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" placeholder="Posisi Anda" />
        </div>
      </div>

      {/* Baris 4: Nomor Telepon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telp / WA</label>
        <input name="noTelp" type="tel" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" placeholder="0812xxxx" />
      </div>

      {/* Baris 5: Keperluan */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan / Keperluan</label>
        <textarea name="keperluan" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black h-28" placeholder="Jelaskan tujuan kunjungan Anda..." />
      </div>

      {/* Baris 6: tanggal berkunjung */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kunjungan</label>
        <input name="tanggalBerkunjung" type="date" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black" />
      </div>

      {/* Tombol Simpan */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-white transition duration-300 ${loading ? 'bg-gray-400' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg'}`}
      >
        {loading ? "Menyimpan..." : "Kirim Data Kunjungan"}
      </button>
    </form>
  );
}