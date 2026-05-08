import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import BarcodeScanner from "@/components/BarcodeScanner";

export default async function ScanPage() {
  const session = await getAdminSession();
  if (!session) redirect("/login?callback=/admin/alat/scan");

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 md:p-10">
      <div className="max-w-xl mx-auto">
        <Link
          href="/admin/alat"
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> KEMBALI
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Entry <span className="text-emerald-500">Barcode</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2 font-medium uppercase tracking-widest">
            Input Manual atau Scan Kamera
          </p>
        </div>

        {/* Kirim session ke komponen scanner */}
        <BarcodeScanner session={session} />
      </div>
    </div>
  );
}
