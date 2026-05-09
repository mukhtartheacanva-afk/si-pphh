"use client";

import { useState } from "react";
import Link from "next/link";
import FeatureCard from "./FeatureCard";
import { BookOpen, BarChart3, HardHat, FileText } from "lucide-react";
import { MonitorPlay, GraduationCap, Lightbulb } from "lucide-react";
import { BookCheck } from "lucide-react";
import { useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function HomeClient({
  countTamu,
  countPos,
  allPos,
}: {
  countTamu: number;
  countPos: number;
  allPos: any[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter(); // Tambahkan baris ini

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* --- 1. HERO SECTION --- */}
      <header className="relative bg-gradient-to-bl from-lime-950 via-lime-900 to-amber-300 text-white pt-24 pb-40 px-6 overflow-hidden">
        {/* Aksesoris Daun (Sesuai perbaikan size) */}
        <div
          className="absolute -top-10 -left-10 opacity-90 pointer-events-none z-0"
          style={{
            backgroundImage: "url('/motif-daun.png')",
            backgroundSize: "600px", // Sekarang sizenya bisa lo atur di sini
            backgroundRepeat: "no-repeat",
            width: "900px",
            height: "900px",
          }}
        />
        {/* --- Motif Kayu yang FULL --- */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none z-0" // inset-0 bikin nempel ke semua sisi
          style={{
            backgroundImage: "url('/bg-kayu.jpg')",
            backgroundSize: "cover", // INI KUNCINYA: Biar gambarnya narik full
            backgroundPosition: "center", // Biar corak kayunya rata di tengah
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "fixed",
            // width: "100%", // Pastikan lebarnya 100%
            // height: "100%", // Pastikan tingginya 100%
          }}
        />
        {/* Logo Transparan di Background */}
        {/* <img
          // src="/logo-jatim.png"
          // className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 w-[400px] pointer-events-none z-0"
          // alt="Decoration"

        /> */}
        <div className="absolute top-8 left-8 z-20 no-print">
          <img
            src="/logo-jatim.png"
            alt="Logo UPT"
            className="h-12 md:h-25 w-auto drop-shadow-lg"
          />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-amber-400/30 border border-white/20 rounded-full text-amber-50 text-[14px] font-black uppercase tracking-[0.2em] mb-6">
            UPT Pelayanan Pengelolaan Hasil Hutan • Official Digital System
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase italic leading-none text-shadow-strong drop-shadow-2xl">
            SI-PPHH <span className="text-amber-500"></span>
          </h1>
          {/* Deskripsi - Kasih font-medium dan bayangan halus */}
          <p className="text-lg md:text-xl text-white max-w-2xl mx-auto font-medium leading-relaxed mb-12 text-shadow-soft">
            <span className="text-amber-500 font-bold drop-shadow-md">
              Sistem Informasi Pelayanan Pengelolaan Hasil Hutan
            </span>
            <br />
            <span className="opacity-100">
              Digital Guestbook, Monitoring & Inventaris. <br />
              Mendukung Transparansi dan Efisiensi Penatausahaan Hasil Hutan{" "}
              <br />
              Jawa Timur.
            </span>
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-10 py-4 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-black rounded-2xl transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              ISI BUKU TAMU
            </button>
            <Link
              href="/login"
              className="px-10 py-4 bg-white/10 hover:bg-white/20 text-amber-50 font-black rounded-2xl border border-white/20 backdrop-blur-md transition-all hover:-translate-y-1 active:scale-95"
            >
              LOGIN PETUGAS
            </Link>
          </div>
        </div>
      </header>

      {/* --- 2. STATS SECTION --- */}
      <section className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            emoji="👥"
            val={countTamu.toLocaleString()}
            label="Total Kunjungan"
          />
          <StatCard emoji="📍" val={countPos} label="Titik Pos Layanan" />
          <div className="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl border border-emerald-500 flex items-center gap-6 text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              🌳
            </div>
            <div>
              <h3 className="text-3xl font-black uppercase leading-none">
                PPHH
              </h3>
              <p className="text-[10px] font-black text-emerald-200 uppercase tracking-widest mt-1">
                Surabaya - 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. MODAL POP-UP --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-emerald-950/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-8 md:p-12 animate-in zoom-in duration-300">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
                Pilih Lokasi Pos
              </h2>
              <p className="text-slate-500 font-medium mt-2">
                Silahkan pilih unit pelayanan tempat Anda berada
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allPos.map((pos) => (
                <Link
                  key={pos.id}
                  href={`/${pos.kodePos}`}
                  className="group p-6 bg-slate-50 hover:bg-emerald-600 border border-slate-200 rounded-3xl transition-all"
                >
                  <span className="text-[10px] font-black text-emerald-600 group-hover:text-emerald-200 uppercase tracking-widest block mb-1">
                    Wilayah Kerja
                  </span>
                  <span className="text-lg font-bold text-slate-800 group-hover:text-white">
                    {pos.namaPos}
                  </span>
                </Link>
              ))}
            </div>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-8 w-full text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase text-xs tracking-widest"
            >
              Tutup Panel
            </button>
          </div>
        </div>
      )}

      {/* --- 4. FEATURES --- */}
      <section className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black text-slate-800 uppercase italic">
            Layanan Digital Kami
          </h2>
          <div className="w-24 h-2 bg-amber-500 mx-auto mt-4 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <FeatureCard
            icon={<BookOpen className="w-12 h-12 text-emerald-600" />}
            title="BU-TAGI"
            desc="Buku Tamu Digital pencatatan kunjungan berbasis digital untuk setiap pos pelayanan."
            onClick={() => setIsModalOpen(true)} // Buka modal pas diklik
          />
          <FeatureCard
            icon={<MonitorPlay className="w-12 h-12 text-amber-500" />}
            title="SI-DUGI"
            desc="Sitem Edukasi Digital layanan pembelajaran, pendampingan dan informasi teknis berbasis digital "
            // Buka tab baru menuju link SI_DUGI
            onClick={() => window.open("https://si-dugi.my.id/login", "_blank")}
          />
          <FeatureCard
            icon="🛠️"
            title="Inventaris"
            desc="Manajemen peralatan kerja dan APD petugas lapangan secara terukur."
            onClick={() => router.push("/admin/alat")} // Arahkan ke list alat
          />
          <FeatureCard
            icon={<BookCheck className="w-12 h-12 text-blue-600" />}
            title="SOP Digital"
            desc="Akses cepat panduan standar operasional penatausahaan hasil hutan."
          />
        </div>
      </section>

      <footer className="py-12 border-t border-slate-200 bg-white text-center">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          &copy; 2026 UPT Pelayanan Pengelolaan Hasil Hutan
        </p>
      </footer>
    </div>
  );
}

// Sub-komponen biar kode bersih
function StatCard({ emoji, val, label }: any) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-emerald-900/5 border border-white flex items-center gap-6">
      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
        {emoji}
      </div>
      <div>
        <h3 className="text-4xl font-black text-slate-800 tracking-tighter leading-none">
          {val}
        </h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
          {label}
        </p>
      </div>
    </div>
  );
}
