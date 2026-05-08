"use client";
import { simpanTamu } from "@/actions/guest-action";
import { useRef, useState } from "react";
import Swal from 'sweetalert2';

// Tambahkan Interface untuk props posId
interface FormTamuProps {
  posId: string;
}

export default function FormTamu({ posId }: FormTamuProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    // Masukkan posId sebagai argumen kedua sesuai update guest-action kita tadi
    const res = await simpanTamu(formData, posId);
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
      // Ganti alert biasa ke SweetAlert agar seragam
      Swal.fire('Gagal', res?.error || "Terjadi kesalahan", 'error');
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      {/* Isi form tetap sama, tidak ada yang perlu diubah di bagian input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
        <input name="nama" type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-black" placeholder="Contoh: Budi Santoso" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
        <input name="alamat" type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-black" placeholder="Alamat tinggal/kantor" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asal Perusahaan</label>
          <input name="asalPerusahaan" type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-black" placeholder="Nama instansi/PT" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jabatan</label>
          <input name="jabatan" type="text" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-black" placeholder="Posisi Anda" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telp / WA</label>
        <input name="noTelp" type="tel" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-black" placeholder="0812xxxx" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan / Keperluan</label>
        <textarea name="keperluan" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-black h-28" placeholder="Jelaskan tujuan kunjungan Anda..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kunjungan</label>
        <input name="tanggalBerkunjung" type="date" required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-black" />
      </div>

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