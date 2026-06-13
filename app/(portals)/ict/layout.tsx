"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/ict",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="7" height="9" x="3" y="3" rx="1" />
        <rect width="7" height="5" x="14" y="3" rx="1" />
        <rect width="7" height="9" x="14" y="12" rx="1" />
        <rect width="7" height="5" x="3" y="16" rx="1" />
      </svg>
    ),
  },
  {
    label: "Accounts",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    children: [
      { label: "Students", href: "/ict/accounts/students" },
      { label: "Teachers", href: "/ict/accounts/teachers" },
      { label: "Staff", href: "/ict/accounts/staff" },
      { label: "Admin", href: "/ict/accounts/admin" },
    ],
  },
  {
    label: "Tickets",
    href: "/ict/tickets",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
        <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </svg>
    ),
  },
  {
    label: "Website Settings",
    href: "/ict/settings",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

export default function ICTLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [accountsOpen, setAccountsOpen] = useState(false);

  useEffect(() => {
    const hasActiveChild = NAV_ITEMS.some((item) =>
      item.children?.some((child) => pathname.startsWith(child.href))
    );
    if (hasActiveChild) setAccountsOpen(true);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#1a1f2e] flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center gap-3 px-5 h-16 flex-shrink-0">
          <div className="relative w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
            <Image src="/logo.png" alt="MNHS Logo" fill className="object-contain" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-tight">ICT Portal</p>
            <p className="text-[10px] text-gray-400">Mabolo NHS</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            if (item.children) {
              const isParentActive = item.children.some((child) => pathname.startsWith(child.href));
              return (
                <div key={item.label}>
                  <button
                    onClick={() => setAccountsOpen(!accountsOpen)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isParentActive
                        ? "text-white font-bold"
                        : "text-gray-300 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {item.label}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`ml-auto transition-transform duration-200 ${accountsOpen ? "rotate-180" : ""}`}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {accountsOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setSidebarOpen(false)}
                          className={`block px-3 py-2 rounded-lg text-sm transition-all ${
                            pathname.startsWith(child.href)
                              ? "bg-[#8B1010] text-white font-semibold"
                              : "text-gray-400 hover:text-white hover:bg-white/5"
                          }`}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            const isActive = pathname === item.href || (item.href !== "/ict" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? "bg-[#8B1010] text-white font-bold"
                    : "text-gray-300 hover:text-white hover:bg-white/10"
                }`}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 py-3 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
        sidebarOpen ? "lg:ml-64" : "lg:ml-0"
      }`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 h-16 flex items-center px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="text-gray-500 hover:text-[#8B1010] p-2 -ml-2 mr-3 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" />
            </svg>
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-[#8B1010] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D4A017] rounded-full" />
            </button>
            <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
              <div className="w-8 h-8 rounded-full bg-[#8B1010] flex items-center justify-center text-white text-xs font-bold">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-700 leading-tight">Admin</p>
                <p className="text-[10px] text-gray-400">ICT Department</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
