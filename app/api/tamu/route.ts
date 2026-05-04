import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await db.guest.findMany({ orderBy: { tanggalBerkunjung: "desc" } });
  return NextResponse.json(data);
}