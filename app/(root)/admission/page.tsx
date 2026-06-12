"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function AdmissionPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      <div className="bg-[#1E5631] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-2">
            <span className="font-medium">Republic of the Philippines</span>
            <span className="text-gray-300">|</span>
            <span className="text-gray-300">Department of Education</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-gray-300">
            <span>DepEd Division of Cebu City</span>
            <span>|</span>
            <span>Region VII — Central Visayas</span>
          </div>
        </div>
      </div>

      <header className="bg-white border-b-4 border-[#8B1010] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex items-center gap-4">
              <Image src="/logo.png" alt="MNHS Official Seal" width={64} height={64} className="rounded-full shadow-sm" priority />
              <div>
                <h1 className="text-lg font-bold text-[#8B1010] leading-tight">MABOLO NATIONAL HIGH SCHOOL</h1>
                <p className="text-[11px] text-[#4b5563] tracking-wide">Cebu City — Division of Cebu City</p>
                <p className="text-[10px] text-[#D4A017] font-semibold tracking-wider uppercase mt-0.5">DepEd &middot; Region VII</p>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {[{ label: "About", href: "/about" }, { label: "Programs", href: "/programs" }, { label: "Admission", href: "/admission" }, { label: "Announcements", href: "/news" }, { label: "Contact", href: "/contact" }].map((item) => (
                <Link key={item.href} href={item.href} className={`px-4 py-2 text-sm font-medium transition-colors rounded ${item.href === "/admission" ? "text-[#8B1010] font-bold" : "text-gray-700 hover:text-[#8B1010] hover:bg-red-50"}`}>{item.label}</Link>
              ))}
              <Link href="/login" className="ml-3 px-5 py-2 text-xs lg:text-sm font-medium bg-[#8B1010] text-white hover:bg-[#6e0d0d] transition-colors rounded">Login</Link>
            </nav>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-[#8B1010] p-2">
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="lg:hidden bg-white border-b-4 border-[#8B1010] shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 space-y-1">
            {[{ label: "About", href: "/about" }, { label: "Programs", href: "/programs" }, { label: "Admission", href: "/admission" }, { label: "Announcements", href: "/news" }, { label: "Contact", href: "/contact" }].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#8B1010] hover:bg-red-50 rounded transition-colors">{item.label}</Link>
            ))}
            <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-3 text-sm font-medium bg-[#8B1010] text-white hover:bg-[#6e0d0d] rounded transition-colors text-center">Login</Link>
          </div>
        </div>
      )}

      <section className="relative h-[300px] bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/bg.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B1010]/95 via-[#8B1010]/80 to-[#1E5631]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-3">Admissions</p>
            <h2 className="text-4xl font-bold text-white leading-tight">Admission Requirements</h2>
          </div>
        </div>
      </section>

      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#8B1010] transition-colors">Home</Link><span>/</span>
            <span className="text-[#8B1010] font-medium">Admission</span>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-2">Enrollment</p>
            <h3 className="text-3xl font-bold text-[#8B1010]">Requirements by Type</h3>
            <div className="w-16 h-1 bg-[#D4A017] mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "New Student", color: "#8B1010", items: ["PSA Birth Certificate", "Form 138 (Report Card)", "Good Moral Certificate", "2x2 ID Picture (2 copies)"] },
              { title: "Old Student", color: "#1E5631", items: ["Form 138 (Report Card)", "Good Moral Certificate", "2x2 ID Picture (1 copy)"] },
              { title: "Transferee", color: "#D4A017", items: ["PSA Birth Certificate", "Form 137 (Permanent Record)", "Good Moral Certificate", "2x2 ID Picture (2 copies)"] },
              { title: "Balik-Aral", color: "#b81c1c", items: ["PSA Birth Certificate", "Good Moral Certificate", "2x2 ID Picture (2 copies)", "Certificate of Attendance"] },
            ].map((type) => (
              <div key={type.title} className="bg-[#f8f9fa] rounded-lg p-6 border border-gray-200">
                <h4 className="font-bold text-sm mb-4" style={{ color: type.color }}>{type.title}</h4>
                <ul className="space-y-2">
                  {type.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-600"><span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: type.color }} />{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-2">Enrollment Process</p>
            <h3 className="text-3xl font-bold text-[#8B1010]">How to Enroll</h3>
            <div className="w-16 h-1 bg-[#D4A017] mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Prepare Requirements", desc: "Gather all required documents listed above based on your enrollment type.", color: "#8B1010" },
              { step: "02", title: "Fill Out Online Form", desc: "Click the 'Enroll Now' button below and complete the online enrollment form.", color: "#1E5631" },
              { step: "03", title: "Submit Requirements", desc: "Upload scanned copies of your requirements through the enrollment portal.", color: "#D4A017" },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-lg p-6 border border-gray-200 text-center shadow-sm">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: s.color + "15" }}><span className="font-bold text-base" style={{ color: s.color }}>{s.step}</span></div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">{s.title}</h4>
                <p className="text-gray-500 text-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#8B1010]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Ready to Enroll?</h3>
          <p className="text-gray-200 text-sm mb-6 max-w-xl mx-auto">Fill out the online enrollment form to apply for School Year 2026-2027.</p>
          <Link href="/admission/enroll" className="inline-block bg-[#D4A017] hover:bg-[#c49515] text-[#8B1010] font-bold px-12 py-4 text-base transition-colors rounded shadow-lg hover:shadow-xl">Enroll Now</Link>
        </div>
      </section>

      <footer className="bg-[#2d2d2d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="MNHS Logo" width={48} height={48} className="rounded-full" />
                <div><h4 className="font-bold text-sm">Mabolo National High School</h4><p className="text-gray-400 text-xs">DepEd Division of Cebu City</p></div>
              </Link>
              <p className="text-gray-400 text-xs leading-relaxed max-w-sm">Committed to delivering quality, accessible, and inclusive basic education in compliance with the Department of Education&apos;s mandates and the K-12 program.</p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-[#D4A017]">Quick Links</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/programs" className="hover:text-white transition-colors">Academic Programs</Link></li>
                <li><Link href="/news" className="hover:text-white transition-colors">News & Announcements</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Office</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-[#D4A017]">Government Links</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">DepEd Official Website</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DepEd Order Portal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DepEd Cebu City Division</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Official Gazette</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-[11px]">&copy; 2026 Mabolo National High School. All rights reserved.</p>
            <p className="text-gray-500 text-[11px]">Department of Education &middot; Republic of the Philippines</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
