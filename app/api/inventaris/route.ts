// app/api/inventaris/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const posId = searchParams.get("posId");

  try {
    // Mengambil daftar alat berdasarkan Pos tertentu
    const alats = await db.alat.findMany({
      where: posId ? { posId } : {},
      include: {
        checklists: {
          orderBy: { waktuKeluar: 'desc' },
          take: 1
        }
      }
    });
    return NextResponse.json(alats);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data inventaris" }, { status: 500 });
  }
}