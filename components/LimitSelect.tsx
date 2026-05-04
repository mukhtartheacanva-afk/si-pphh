"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function LimitSelect({ currentLimit }: { currentLimit: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleLimitChange = (newLimit: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", "1");
    params.set("limit", newLimit);
    
    router.push(`/admin/dashboard?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
      {/* <label className="text-xs font-bold text-slate-500 uppercase">Tampilkan:</label> */}
      <select 
        value={currentLimit}
        onChange={(e) => handleLimitChange(e.target.value)}
        className="text-sm font-bold text-slate-700 focus:outline-none bg-transparent cursor-pointer"
      >
        {[5, 10, 20, 50, 100].map((val) => (
          <option key={val} value={val.toString()}>{val}</option>
        ))}
      </select>
    </div>
  );
}