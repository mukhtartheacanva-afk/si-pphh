import { db } from "@/lib/db";
import EditRiwayatForm from "@/components/EditRiwayatForm";
import { notFound } from "next/navigation";

export default async function EditRiwayatPage({
  params,
}: {
  params: Promise<{ id: string }>; // Update tipenya jadi Promise
}) {
  // --- KUNCINYA DI SINI ---
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const data = await db.checklist.findUnique({
    where: { id: id }, // Pakai ID yang sudah di-resolve
    include: { alat: true },
  });

  if (!data) notFound();

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-black uppercase mb-8">
          Edit <span className="text-emerald-600">Riwayat</span>
        </h1>
        <EditRiwayatForm initialData={data} />
      </div>
    </div>
  );
}
