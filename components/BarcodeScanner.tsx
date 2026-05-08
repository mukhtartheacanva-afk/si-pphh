"use client";

import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { pinjamAlat, kembaliAlat } from "@/actions/alat-action";
import Swal from "sweetalert2";
import { Loader2, Keyboard } from "lucide-react";

export default function BarcodeScanner({ session }: { session: any }) {
  const [manualCode, setManualCode] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  async function prosesBarcode(code: string) {
    if (!code || isProcessing) return;

    setIsProcessing(true);

    // SweetAlert dengan dua tombol aksi
    const result = await Swal.fire({
      title: `Barcode: ${code}`,
      text: "Tentukan aksi inventaris:",
      icon: "question",
      showCancelButton: true,
      showDenyButton: true, // Kita pakai Deny Button agar lebih jelas bedanya
      confirmButtonText: "Pinjam (Keluar)",
      denyButtonText: "Kembali (Masuk)",
      cancelButtonText: "Batal",
      confirmButtonColor: "#10b981", // Hijau
      denyButtonColor: "#3b82f6", // Biru
    });

    if (result.isConfirmed) {
      // PROSES PINJAM
      const res = await pinjamAlat(code, session.username, session.posId);
      handleResponse(res);
    } else if (result.isDenied) {
      // PROSES KEMBALI
      const res = await kembaliAlat(code, "BAIK");
      handleResponse(res);
    } else {
      // Jika klik Batal atau luar modal
      setIsProcessing(false);
    }
  }

  function handleResponse(res: any) {
    if (res.success) {
      Swal.fire("Berhasil!", "Data telah diperbarui.", "success").then(() => {
        window.location.href = "/admin/alat/scan";
      });
    } else {
      Swal.fire("Gagal", res.error, "error").then(() => {
        setIsProcessing(false);
      });
    }
  }

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: 250 },
      false,
    );
    scanner.render(
      (text) => prosesBarcode(text),
      () => {},
    );
    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-slate-800 p-6 rounded-3xl border-2 border-slate-700 shadow-inner">
        <label className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3 block">
          Input Manual Barcode
        </label>
        <div className="relative">
          <Keyboard
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Ketik kode barcode..."
            className="w-full pl-12 pr-4 py-4 bg-slate-900 rounded-2xl border-2 border-slate-700 focus:border-emerald-500 outline-none font-mono text-xl text-white tracking-widest transition-all"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => {
              if (e.key === "Enter") prosesBarcode(manualCode);
            }}
          />
        </div>
        <button
          onClick={() => prosesBarcode(manualCode)}
          disabled={!manualCode || isProcessing}
          className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 p-4 rounded-2xl font-black uppercase text-sm text-white shadow-lg disabled:bg-slate-700 transition-all"
        >
          {isProcessing ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            "PROSES DATA"
          )}
        </button>
      </div>

      <div className="relative text-center">
        <span className="bg-slate-900 px-4 text-slate-600 text-xs font-bold uppercase tracking-widest relative z-10">
          Atau Scan Kamera
        </span>
        <hr className="absolute top-1/2 w-full border-slate-800" />
      </div>

      <div
        id="reader"
        className="overflow-hidden rounded-3xl border-4 border-slate-800 bg-black opacity-60 hover:opacity-100 transition-opacity"
      ></div>
    </div>
  );
}
