// app/login/page.tsx
"use client";
import { loginAdmin } from "@/actions/auth-action";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Tambahkan import Link

export default function LoginPage() {
  const router = useRouter();

  async function handleLogin(formData: FormData) {
    const res = await loginAdmin(formData);
    if (res.success) {
      router.push("/admin/dashboard");
    } else {
      alert(res.error);
    }
  }

  return (
    // Sesuaikan background agar lebih serasi dengan stone theme (di image_993fbb.png)
    <div className="min-h-screen bg-emerald-200 bg-[url('/motif-kayu.png')] bg-no-repeat bg-contain py-10 px-4 flex items-center justify-center">
      
      {/* Container Utama */}
      <form action={handleLogin} className="bg-white p-10 rounded-3xl shadow-xl w-[400px] border border-stone-100">
        
        {/* Header Tema Buku Tamu */}
        <h1 className="text-3xl font-extrabold mb-2 text-center text-stone-900">BU-TAGI</h1>
        <p className="text-center text-stone-600 mb-8 font-medium">Akses Portal Admin Monitoring</p>
        
        {/* Area Input */}
        <div className="space-y-5">
          <input 
            name="username" 
            placeholder="Username Admin" 
            className="w-full p-4 border border-stone-200 rounded-xl text-black bg-stone-50 focus:ring-2 focus:ring-stone-400 focus:border-stone-400" 
            required 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 border border-stone-200 rounded-xl text-black bg-stone-50 focus:ring-2 focus:ring-stone-400 focus:border-stone-400" 
            required 
          />
          
          {/* Tombol Masuk - Sesuaikan warna dengan tema stone/hitam PPHH */}
          <button 
            type="submit" 
            className="w-full bg-stone-900 hover:bg-black text-white p-4 rounded-xl font-bold text-lg transition-all duration-200 shadow-md"
          >
            Masuk Portal
          </button>
        </div>
        {/* Tombol Kembali ke Halaman Form Tamu (Halaman Utama) */}
      <div className="mt-8 text-center">
        <Link 
          href="/" 
          className="text-stone-600 hover:text-stone-900 font-medium flex items-center gap-2 transition-colors"
        >
          {/* Icon Panah Kiri */}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Pengisian Buku Tamu
        </Link>
      </div>
      </form>

      

    </div>
  );
}