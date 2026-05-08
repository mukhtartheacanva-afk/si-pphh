// app/admin/alat/tambah/page.tsx
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import FormTambahAlat from "@/components/FormTambahAlat"; // Kita pindah formnya ke komponen terpisah

export default async function TambahAlatPage() {
  // 1. Cek Auth di Server
  const session = await getAdminSession();
  if (!session) redirect("/login?callback=/admin/alat/tambah");

  // 2. Ambil data POS otomatis dari database
  const listPos = await db.pos.findMany({
    orderBy: { namaPos: "asc" },
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        {/* Masukkan listPos ke dalam komponen form */}
        <FormTambahAlat listPos={listPos} />
      </div>
    </div>
  );
}
