import { db } from "@/lib/db";
import HomeClient from "@/components/HomeClient"; // Sesuaikan pathnya

export default async function HomePage() {
  // Ambil data dari Database
  const [countTamu, countPos, allPos] = await Promise.all([
    db.guest.count(),
    db.pos.count(),
    db.pos.findMany({
      orderBy: { namaPos: "asc" },
    }),
  ]);

  // Lempar ke Komponen Client
  return (
    <HomeClient countTamu={countTamu} countPos={countPos} allPos={allPos} />
  );
}
