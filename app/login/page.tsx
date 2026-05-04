// app/login/page.tsx
"use client";
import { loginAdmin } from "@/actions/auth-action";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  async function handleLogin(formData: FormData) {
    const res = await loginAdmin(formData);
    if (res.success) {
      router.push("/admin/dashboard");
    } else {
      alert(res.error);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form action={handleLogin} className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-black">Login Admin</h1>
        <div className="space-y-4">
          <input name="username" placeholder="Username" className="w-full p-3 border rounded text-black" required />
          <input name="password" type="password" placeholder="Password" className="w-full p-3 border rounded text-black" required />
          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold">Masuk</button>
        </div>
      </form>
    </div>
  );
}