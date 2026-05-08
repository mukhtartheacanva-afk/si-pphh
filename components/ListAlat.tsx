// components/ListAlat.tsx
"use client";
import React from 'react';

interface Alat {
  id: string;
  namaAlat: string;
  barcode: string;
  kategori: string;
  status: string;
}

export default function ListAlat({ data }: { data: Alat[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-stone-800 text-white uppercase text-xs tracking-wider">
          <tr>
            <th className="px-6 py-4">Nama Alat</th>
            <th className="px-6 py-4">Kategori</th>
            <th className="px-6 py-4">Barcode</th>
            <th className="px-6 py-4 text-center">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100 bg-white">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-emerald-50/30 transition-colors">
              <td className="px-6 py-4 font-bold text-stone-700">{item.namaAlat}</td>
              <td className="px-6 py-4 text-stone-500">
                <span className="px-2 py-1 bg-stone-100 rounded-md text-[10px] font-bold">
                  {item.kategori}
                </span>
              </td>
              <td className="px-6 py-4 font-mono text-xs text-emerald-600">{item.barcode}</td>
              <td className="px-6 py-4 text-center">
                <span className={`px-3 py-1 rounded-full text-[11px] font-black shadow-sm ${
                  item.status === "TERSEDIA" 
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                  : "bg-amber-100 text-amber-700 border border-amber-200"
                }`}>
                  {item.status}
                </span>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={4} className="px-6 py-10 text-center text-stone-400 italic">
                Belum ada data inventaris di pos ini.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}