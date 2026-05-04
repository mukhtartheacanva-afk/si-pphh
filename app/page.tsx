import FormTamu from "@/components/FormTamu";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-emerald-200 bg-[url('/motif-kayu.png')] bg-no-repeat bg-contain py-10 px-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-[2.5rem] shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-white/20 overflow-hidden transform hover:scale-[1.01] transition-transform duration-300">
        {/* Header Visual - Motif Serat Kayu Nyata */}
          <div 
            className="p-10 text-center text-white relative overflow-hidden bg-[#5d4037]"
            style={{ 
              backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')",
              backgroundColor: "#6d4c41" // Warna dasar kayu jati yang lebih terang agar motif terlihat
            }}
          >
            {/* Efek Gradasi agar teks lebih terbaca */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

            {/* Ikon Daun Dekoratif */}
            <div className="absolute -top-6 -right-6 text-emerald-400 opacity-30 transform rotate-12">
              <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,11 17,8 17,8Z" />
              </svg>
            </div>

            <div className="relative z-10">
              <h1 className="text-4xl font-black tracking-[0.2em] drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">BU-TAGI</h1>
              <div className="h-1 w-20 bg-emerald-400 mx-auto my-3 rounded-full shadow-sm"></div>
              <h2 className="text-xl font-bold text-stone-100 tracking-wide">BUKU TAMU DIGITAL</h2>
              <p className="mt-2 text-emerald-50 italic text-sm font-medium">Silakan isi formulir kunjungan di bawah ini</p>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8 md:p-12 bg-white/50 backdrop-blur-sm">
            <FormTamu />
          </div>

          {/* Footer */}
          <div className="p-6 bg-stone-100 border-t border-stone-200 text-center text-stone-500 text-xs font-bold uppercase tracking-widest">
            &copy; 2026 PPHH-Surabaya - BU-TAGI
          </div>        
      </div>
    </main>
  );
}