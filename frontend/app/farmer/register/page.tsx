"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function FarmerRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", location: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/farmer/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setDone(true);
    } else {
      setError(data.error ?? "Registration failed.");
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#EDF0ED] px-4">
        <div className="w-full max-w-sm rounded-2xl border border-[#c8cdd3] bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-extrabold text-[#1a1f3d]">Registration Submitted!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your account is pending approval by the AgriGet admin. You will be able to log in once approved.
          </p>
          <Link
            href="/farmer/login"
            className="mt-6 inline-block rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition"
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#EDF0ED] px-4 py-12">
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
          <p className="text-sm text-gray-500">Farmer Registration</p>
        </div>

        <div className="rounded-2xl border border-[#c8cdd3] bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-center text-xl font-bold text-[#1a1f3d]">Create Farmer Account</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { label: "Full Name", key: "name", type: "text", placeholder: "Gurpreet Singh" },
              { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
              { label: "Password", key: "password", type: "password", placeholder: "Min. 6 characters" },
              { label: "Phone Number", key: "phone", type: "tel", placeholder: "+91 98765 43210" },
              { label: "Location / Village", key: "location", type: "text", placeholder: "Ludhiana, Punjab" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {label}
                </label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required
                  className="w-full rounded-lg border border-[#c8cdd3] px-3 py-2.5 text-sm focus:border-green-500 focus:outline-none"
                />
              </div>
            ))}

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-green-600 py-2.5 font-semibold text-white transition hover:bg-green-700 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Register as Farmer"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/farmer/login" className="font-semibold text-green-700 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
