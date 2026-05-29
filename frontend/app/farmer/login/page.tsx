"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FarmerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/farmer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/farmer/dashboard");
      router.refresh();
    } else {
      setError(data.error ?? "Login failed.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDF0ED] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <Image
            src="/agriget-logo.png"
            width={64}
            height={64}
            alt="AgriGet Logo"
            className="h-16 w-16 object-contain"
            style={{ mixBlendMode: "multiply" }}
          />
          <p className="text-2xl font-extrabold text-green-700">AgriGet</p>
          <p className="text-sm text-gray-500">Farmer Portal</p>
        </div>

        <div className="rounded-2xl border border-[#c8cdd3] bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-center text-xl font-bold text-[#1a1f3d]">Farmer Sign In</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Email</label>
              <input
                type="email"
                className="w-full rounded-lg border border-[#c8cdd3] px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">Password</label>
              <input
                type="password"
                className="w-full rounded-lg border border-[#c8cdd3] px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-green-600 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            New farmer?{" "}
            <Link href="/farmer/register" className="font-semibold text-green-700 hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
