// app/admin/alat/edit/[id]/page.tsx
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import FormEditAlat from "@/components/FormEditAlat";

export default async function EditAlatPage({
  params,
}: {
  params: Promise<{ id: string }>; // Definisikan sebagai Promise
}) {
  // 1. WAJIB AWAIT PARAMS DULU
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Cek apakah ID ada, jika tidak ada langsung nendang
  if (!id) return notFound();

  // 2. Cek Auth
  const session = await getAdminSession();
  if (!session) redirect(`/login?callback=/admin/alat/edit/${id}`);

  // 3. Sekarang 'id' sudah aman (bukan undefined)
  const [alat, listPos] = await Promise.all([
    db.alat.findUnique({
      where: { id: id }, // Gunakan variabel id yang sudah di-await
      include: { pos: true },
    }),
    db.pos.findMany({ orderBy: { namaPos: "asc" } }),
  ]);

  if (!alat) return notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <FormEditAlat initialData={alat} listPos={listPos} />
      </div>
    </div>
  );
}
