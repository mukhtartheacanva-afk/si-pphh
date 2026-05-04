"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function FilterPeriode() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const bulanSekarang = searchParams.get("bulan") || "";
  const tahunSekarang = searchParams.get("tahun") || "";

  const handleFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Reset ke halaman 1 saat filter berubah
    router.push(`?${params.toString()}`);
  };

  const daftarBulan = [
    { v: "1", n: "Januari" }, { v: "2", n: "Februari" }, { v: "3", n: "Maret" },
    { v: "4", n: "April" }, { v: "5", n: "Mei" }, { v: "6", n: "Juni" },
    { v: "7", n: "Juli" }, { v: "8", n: "Agustus" }, { v: "9", n: "September" },
    { v: "10", n: "Oktober" }, { v: "11", n: "November" }, { v: "12", n: "Desember" },
  ];

  return (
    <div className="flex gap-2 no-print">
      <select 
        value={bulanSekarang}
        onChange={(e) => handleFilter("bulan", e.target.value)}
        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Bulan</option>
        {daftarBulan.map((b) => (
          <option key={b.v} value={b.v}>{b.n}</option>
        ))}
      </select>

      <select 
        value={tahunSekarang}
        onChange={(e) => handleFilter("tahun", e.target.value)}
        className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Tahun</option>
        {["2024", "2025", "2026"].map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
}