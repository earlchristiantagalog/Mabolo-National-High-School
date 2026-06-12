"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [method, setMethod] = useState<"email" | "ict">("email");
  const [email, setEmail] = useState("");
  const [schoolId, setSchoolId] = useState("");

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

          <div className="flex border-2 border-gray-200 rounded-xl overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setMethod("email")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                method === "email"
                  ? "bg-[#8B1010] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setMethod("ict")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                method === "ict"
                  ? "bg-[#8B1010] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              Request to ICT
            </button>
          </div>

          <form className="space-y-5">
            {method === "email" ? (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address <span className="text-[#8B1010]">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all bg-white"
                />
                <p className="text-[11px] text-gray-500 mt-2">We&apos;ll send a password reset link to your email.</p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">School ID <span className="text-[#8B1010]">*</span></label>
                <input
                  type="text"
                  value={schoolId}
                  onChange={(e) => setSchoolId(e.target.value)}
                  placeholder="Enter your School ID"
                  className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all bg-white"
                />
                <p className="text-[11px] text-gray-500 mt-2">Your request will be forwarded to the ICT department.</p>
              </div>
            )}
            <button type="submit" className="w-full bg-[#8B1010] hover:bg-[#6e0d0d] text-white font-semibold py-3 px-6 text-sm rounded-xl transition-colors">
              {method === "email" ? "Send Reset Link" : "Submit Request"}
            </button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <Link href="/login" className="text-white/80 hover:text-white transition-colors">Back to Login</Link>
          <span className="text-white/40">|</span>
          <Link href="/" className="text-white/80 hover:text-white transition-colors">Back to Homepage</Link>
        </div>
      </div>
    </div>
  );
}
