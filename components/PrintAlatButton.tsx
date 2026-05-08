"use client";

import { Printer } from "lucide-react";

export default function PrintAlatButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-slate-800 hover:bg-black text-white px-5 py-3 rounded-2xl font-bold shadow-sm transition-all active:scale-95"
    >
      <Printer size={18} />
      PRINT PDF
    </button>
  );
}
