"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useEffect, useState } from "react";

export default function SearchAlat({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [text, setText] = useState(defaultValue);

  // Fungsi ini bakal nunggu 300ms setelah lo berhenti ngetik baru nembak ke URL
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Tiap cari baru, balik ke hal 1

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    router.replace(`${pathname}?${params.toString()}`);
  }, 300);

  // Sinkronisasi state internal kalau defaultValue berubah (misal tombol reset)
  useEffect(() => {
    setText(defaultValue);
  }, [defaultValue]);

  return (
    <div className="relative w-full md:max-w-md">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        size={18}
      />
      <input
        type="text"
        value={text}
        placeholder="Cari nama alat atau barcode..."
        className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-emerald-500/20 outline-none font-medium text-slate-700 transition-all"
        onChange={(e) => {
          setText(e.target.value);
          handleSearch(e.target.value);
        }}
      />
    </div>
  );
}
