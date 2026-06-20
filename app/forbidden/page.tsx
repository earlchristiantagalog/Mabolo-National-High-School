"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ForbiddenPage() {
  const [user, setUser] = useState<{ name: string; email: string; type: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B1010] via-[#6e0d0d] to-[#5a0b0b] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[480px]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 text-center">
          <div className="flex justify-center mb-6">
            <Image src="/logo.png" alt="MNHS Logo" width={80} height={80} className="rounded-full shadow-sm" />
          </div>

          <div className="bg-[#8B1010]/10 text-[#8B1010] text-xs font-bold px-3 py-1.5 rounded-full inline-block mb-4">
            403 FORBIDDEN
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500 mb-6">
            You do not have permission to access this page.
          </p>

          {user && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-6 text-left text-sm">
              <div className="flex items-center gap-2 text-gray-500 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
                <span className="font-medium">Logged in as</span>
              </div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-gray-400 text-xs mt-0.5">
                Role: <span className="uppercase font-medium text-[#8B1010]">{user.type}</span>
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8B1010] hover:bg-[#6e0d0d] text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Go to Homepage
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-200 hover:border-[#8B1010] hover:text-[#8B1010] text-gray-600 text-sm font-semibold rounded-xl transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-white/60 mt-6">
          &copy; {new Date().getFullYear()} Mabolo National High School. All rights reserved.
        </p>
      </div>
    </div>
  );
}
