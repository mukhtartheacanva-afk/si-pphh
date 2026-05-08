"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function KategoriFilter({
  defaultValue,
}: {
  defaultValue: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (val) {
      params.set("cat", val);
    } else {
      params.delete("cat");
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <select
      defaultValue={defaultValue}
      onChange={(e) => onChange(e.target.value)}
      className="p-3 bg-slate-50 border border-slate-100 rounded-xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
    >
      <option value="">Semua Kategori</option>
      <option value="APD">🛡️ APD</option>
      <option value="UKUR">📏 ALAT UKUR</option>
      <option value="LAPANGAN">🌲 LAPANGAN</option>
      <option value="KANTOR">🏢 KANTOR</option>
    </select>
  );
}
