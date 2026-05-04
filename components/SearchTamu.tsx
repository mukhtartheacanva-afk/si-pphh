"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

export default function SearchTamu() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const queryDariUrl = searchParams.get("query")?.toString() || "";
  const limitDariUrl = searchParams.get("limit")?.toString() || "10";
  const [text, setText] = useState(queryDariUrl);

  // Sync state input jika URL berubah (misal tombol back)
  useEffect(() => {
    setText(queryDariUrl);
  }, [queryDariUrl]);

  useEffect(() => {
    if (text === queryDariUrl) return;

    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      params.set("page", "1"); // Reset ke halaman 1 saat cari baru
      params.set("limit", limitDariUrl); // Jaga settingan jumlah data

      if (text) {
        params.set("query", text);
      } else {
        params.delete("query");
      }

      startTransition(() => {
        router.push(`/admin/dashboard?${params.toString()}`);
      });
    }, 500);

    return () => clearTimeout(delayDebounceFn);
    
  }, [text, router, queryDariUrl, limitDariUrl, searchParams]); 

  return (
    <div className="relative w-full max-w-sm group">
      <input
        type="text"
        placeholder="Cari nama atau perusahaan..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-1xl p-2.5 pl-10 border border-slate-200 rounded-xl text-black focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-sm"
      />
      <div className="absolute left-3 top-3 text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      {isPending && (
        <div className="absolute right-3 top-3">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}