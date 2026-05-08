import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";

// Gunakan secret key dari .env atau default untuk development
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "pphh-surabaya-secret-key-2026"
);

interface AdminPayload {
  id: string;
  username: string;
  role: string;
  posId?: string | null;
}

/**
 * Fungsi untuk memverifikasi token JWT
 * Digunakan di Server Components (seperti Dashboard) dan Middleware
 */
export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as AdminPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Fungsi untuk membuat token baru saat login
 * Biasanya dipanggil di auth-action.ts
 */
export async function createToken(payload: AdminPayload) {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h") // Token hangus dalam 24 jam
    .sign(SECRET_KEY);
}

/**
 * Helper untuk mengambil session admin langsung dari cookies
 */
export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;
  
  if (!token) return null;
  
  return await verifyToken(token);
}