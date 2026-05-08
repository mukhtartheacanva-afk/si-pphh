"use client";

import { loginAdmin } from "@/actions/auth-action";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import { Suspense } from "react";

// --- 1. KOMPONEN FORM (Yang pakai useSearchParams) ---
function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const callback = searchParams.get("callback");

  // --- LOGIKA JUDUL DINAMIS ---
  const isInventaris = callback?.includes("alat");
  const pageTitle = isInventaris ? "INVENTARIS" : "BU-TAGI";
  const subTitle = isInventaris
    ? "Manajemen Peralatan & APD"
    : "Portal Administrasi Digital";

  async function handleLogin(formData: FormData) {
    const res = await loginAdmin(formData);

    if (res.success) {
      await Swal.fire({
        title: "Berhasil Login!",
        text: `Selamat datang di Sistem ${pageTitle}`,
        icon: "success",
        confirmButtonColor: "#1c1917",
      });

      const destination = callback || "/admin/dashboard";
      window.location.href = destination;
    } else {
      Swal.fire({
        title: "Login Gagal",
        text: res.error,
        icon: "error",
        confirmButtonColor: "#44403c",
      });
    }
  }

  return (
    <form
      action={handleLogin}
      className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl w-full max-w-[400px] border border-stone-200 relative z-10"
    >
      {/* Header Dinamis */}
      <div className="text-center mb-8">
        <h1
          className={`text-4xl font-black mb-1 tracking-tighter ${
            isInventaris ? "text-emerald-800" : "text-stone-900"
          }`}
        >
          {pageTitle}
        </h1>
        <div
          className={`h-1 w-12 mx-auto mb-4 ${
            isInventaris ? "bg-emerald-800" : "bg-stone-900"
          }`}
        ></div>
        <p className="text-stone-500 font-medium italic">{subTitle}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase ml-1 mb-1">
            Username Admin
          </label>
          <input
            name="username"
            type="text"
            placeholder="Masukkan username"
            className="w-full p-4 border border-stone-200 rounded-xl text-black bg-stone-50 focus:ring-2 focus:ring-stone-900 outline-none transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase ml-1 mb-1">
            Password
          </label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full p-4 border border-stone-200 rounded-xl text-black bg-stone-50 focus:ring-2 focus:ring-stone-900 outline-none transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full p-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl mt-4 text-white ${
            isInventaris
              ? "bg-emerald-900 hover:bg-emerald-950"
              : "bg-stone-900 hover:bg-black"
          }`}
        >
          Masuk {isInventaris ? "Sistem" : "Portal"}
        </button>
      </div>

      <div className="mt-10 pt-6 border-t border-stone-100 text-center">
        <Link
          href="/"
          className="text-stone-500 hover:text-stone-900 font-semibold flex items-center justify-center gap-2 transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
            className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Halaman Utama
        </Link>
      </div>
    </form>
  );
}

// --- 2. KOMPONEN UTAMA (Wrapper Suspense) ---
export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-bl from-lime-950 via-lime-700 to-amber-300 bg-center py-10 px-4 flex items-center justify-center relative overflow-hidden">
      {/* Background Decor Tetap OK */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/motif-daun.png')",
          backgroundSize: "500px",
          backgroundRepeat: "no-repeat",
          width: "900px",
          height: "900px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          backgroundImage: "url('/bg-kayu.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: "0.4",
          filter: "blur(0px) brightness(0.8)",
          width: "100%",
          height: "100%",
        }}
      />

      {/* Suspense ini yang bikin Build VPS Lancar */}
      <Suspense
        fallback={
          <div className="bg-white/90 p-10 rounded-3xl shadow-2xl text-center font-bold text-stone-900">
            Memuat Sistem...
          </div>
        }
      >
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
