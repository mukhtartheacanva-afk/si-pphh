import { db } from "@/lib/db";
import LaporanHeader from "@/components/LaporanHeader";
import LaporanTable from "@/components/LaporanTable"; // Komponen baru

export const dynamic = "force-dynamic";

export default async function LaporanPage() {
  const riwayat = await db.checklist.findMany({
    include: { alat: { include: { pos: true } } },
    orderBy: { waktuKeluar: "desc" },
  });

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      <LaporanHeader />
      <LaporanTable riwayat={riwayat} />
    </div>
  );
}
