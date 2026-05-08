"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function LimitAlatSelect({
  currentLimit,
}: {
  currentLimit: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const options = [5, 10, 20, 50, 100];

  const onChange = (val: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", val);
    params.set("page", "1"); // Setiap ganti limit, reset ke halaman 1
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        Tampilkan:
      </label>
      <select
        defaultValue={currentLimit}
        onChange={(e) => onChange(e.target.value)}
        className="p-2 bg-slate-50 border border-slate-100 rounded-lg font-bold text-slate-700 outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer text-xs"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt} Data
          </option>
        ))}
      </select>
    </div>
  );
}
