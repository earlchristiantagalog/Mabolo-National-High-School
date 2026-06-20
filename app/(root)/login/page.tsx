"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrId: emailOrId.trim(), password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        const type = data.user.type;
        if (type === "admin") router.push("/admin");
        else if (type === "teacher") router.push("/teacher");
        else if (type === "staff") router.push("/ict");
        else if (type === "student") router.push("/student");
        else router.push("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B1010] via-[#6e0d0d] to-[#5a0b0b] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[520px]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          <div className="flex items-center gap-4 mb-6">
            <Image src="/logo.png" alt="MNHS Logo" width={64} height={64} className="rounded-full shadow-sm flex-shrink-0" />
            <div className="text-left">
              <h1 className="text-lg font-bold text-[#8B1010] leading-tight">MABOLO NATIONAL HIGH SCHOOL</h1>
              <p className="text-[11px] text-[#4b5563]">Cebu City — Division of Cebu City</p>
            </div>
          </div>

          <hr className="border-t-2 border-gray-300 mb-6" />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email or Account ID <span className="text-[#8B1010]">*</span></label>
              <input
                type="text"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                placeholder="Enter your email or account ID"
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all bg-white cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password <span className="text-[#8B1010]">*</span></label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all bg-white cursor-pointer"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#8B1010] hover:bg-[#6e0d0d] text-white font-semibold py-3 px-6 text-sm rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
              <svg className="animate-spin mx-auto" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : "Sign In"}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <Link href="/" className="text-white/80 hover:text-white transition-colors cursor-pointer">Back to Homepage</Link>
          <span className="text-white/40">|</span>
          <Link href="/admission/enroll" className="text-white/80 hover:text-white transition-colors cursor-pointer">Enroll</Link>
          <span className="text-white/40">|</span>
          <Link href="/forgot-password" className="text-white/80 hover:text-white transition-colors cursor-pointer">Forgot Password</Link>
        </div>
      </div>
    </div>
  );
}
