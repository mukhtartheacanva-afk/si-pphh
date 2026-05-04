import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Kita panggil koneksi yang sudah ada, kalau belum ada baru buat satu.
export const db = globalForPrisma.prisma || new PrismaClient();

// Di tahap pengembangan, kita simpan koneksinya di memori global.
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;