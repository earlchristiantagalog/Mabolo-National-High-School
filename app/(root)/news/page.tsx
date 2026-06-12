"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const newsArticles = [
  {
    date: "June 10, 2026",
    category: "Enrollment",
    title: "Enrollment for School Year 2026-2027 Now Open",
    excerpt: "Mabolo National High School announces the opening of enrollment for SY 2026-2027. New, old, and transferee students are encouraged to register online or visit the campus for assistance.",
    image: "/bg.jpg",
  },
  {
    date: "May 28, 2026",
    category: "Event",
    title: "MNHS Intramurals 2026: A Celebration of Sports and Camaraderie",
    excerpt: "The annual MNHS Intramurals kicked off with a vibrant parade and opening ceremony. Students from all grade levels participated in various sporting events throughout the week.",
    image: "/bg.jpg",
  },
  {
    date: "May 15, 2026",
    category: "Academic",
    title: "Recognition Day: Honoring Academic Excellence",
    excerpt: "The school held its annual Recognition Day to honor students who demonstrated exceptional academic performance and exemplary conduct during the school year.",
    image: "/bg.jpg",
  },
  {
    date: "April 30, 2026",
    category: "Advisory",
    title: "DepEd Order No. 007: Updated Guidelines for Class Suspensions",
    excerpt: "The Department of Education releases new guidelines regarding the automatic and localized suspension of classes due to natural disasters and other emergencies.",
    image: "/bg.jpg",
  },
  {
    date: "April 12, 2026",
    category: "Community",
    title: "Brigada Eskwela 2026: Join Us in Preparing the School",
    excerpt: "The annual Brigada Eskwela campaign invites parents, alumni, and community stakeholders to participate in the school preparation activities for the upcoming school year.",
    image: "/bg.jpg",
  },
  {
    date: "March 25, 2026",
    category: "Event",
    title: "MNHS Conducts Career Guidance Forum for Grade 12 Students",
    excerpt: "Senior High School students attended a career guidance forum featuring professionals from various fields to help them make informed decisions about their future careers and college courses.",
    image: "/bg.jpg",
  },
];

const categories = [
  { label: "All Announcements", count: 6 },
  { label: "Enrollment", count: 1 },
  { label: "Events", count: 2 },
  { label: "Academic", count: 1 },
  { label: "Advisory", count: 1 },
  { label: "Community", count: 1 },
];

const quickLinks = [
  { label: "DepEd Official Website", href: "#" },
  { label: "DepEd Cebu City Division", href: "#" },
  { label: "Online Enrollment Portal", href: "/admission/enroll" },
  { label: "School Calendar", href: "#" },
  { label: "Faculty Directory", href: "#" },
  { label: "Downloads & Forms", href: "#" },
];

function IconCalendar() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
  );
}

function IconFolder() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/></svg>
  );
}

function IconArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
  );
}

function IconLink() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
  );
}

export default function NewsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 5;
  const totalPages = Math.ceil(newsArticles.length / perPage);
  const start = (page - 1) * perPage;
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
                <Link key={item.href} href={item.href} className={`px-4 py-2 text-sm font-medium transition-colors rounded ${item.href === "/news" ? "text-[#8B1010] font-bold" : "text-gray-700 hover:text-[#8B1010] hover:bg-red-50"}`}>{item.label}</Link>
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
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-3">Announcements</p>
            <h2 className="text-4xl font-bold text-white leading-tight">News & Announcements</h2>
          </div>
        </div>
      </section>

      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#8B1010] transition-colors">Home</Link><span>/</span>
            <span className="text-[#8B1010] font-medium">Announcements</span>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-2">Stay Informed</p>
            <h3 className="text-3xl font-bold text-[#8B1010]">Latest Updates</h3>
            <div className="w-16 h-1 bg-[#D4A017] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid lg:grid-cols-4 gap-10">
            <div className="lg:col-span-3 space-y-8">
              {newsArticles.slice(start, start + perPage).map((article, i) => (
                <article key={i} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="grid sm:grid-cols-4">
                    <div className="sm:col-span-1 h-48 sm:h-full relative">
                      <Image src={article.image} alt={article.title} fill className="object-cover" />
                    </div>
                    <div className="sm:col-span-3 p-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-[11px] text-white bg-[#8B1010] px-2.5 py-0.5 rounded font-medium">{article.category}</span>
                        <span className="text-[11px] text-gray-400 flex items-center gap-1"><IconCalendar />{article.date}</span>
                      </div>
                      <h4 className="text-base font-bold text-gray-800 mb-2">{article.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{article.excerpt}</p>
                      <Link href="#" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#8B1010] hover:text-[#6e0d0d] transition-colors">Read More <IconArrowRight /></Link>
                    </div>
                  </div>
                </article>
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="px-4 py-2 text-xs font-medium rounded border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 text-xs font-medium rounded transition-colors ${
                        p === page
                          ? "bg-[#8B1010] text-white"
                          : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-xs font-medium rounded border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>

            <aside className="lg:col-span-1 space-y-8">
              <div className="bg-[#f8f9fa] border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2"><IconFolder />Categories</h4>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.label}>
                      <button className="w-full flex items-center justify-between text-xs text-gray-600 hover:text-[#8B1010] transition-colors py-1.5 px-2 rounded hover:bg-white">
                        <span>{cat.label}</span>
                        <span className="bg-gray-200 text-gray-500 text-[10px] px-2 py-0.5 rounded-full">{cat.count}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#f8f9fa] border border-gray-200 rounded-lg p-6">
                <h4 className="font-bold text-gray-800 text-sm mb-4 flex items-center gap-2"><IconLink />Quick Access</h4>
                <ul className="space-y-2">
                  {quickLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="flex items-center gap-2 text-xs text-gray-600 hover:text-[#8B1010] transition-colors py-1.5 px-2 rounded hover:bg-white">
                        <IconArrowRight />{link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#8B1010] rounded-lg p-6 text-center">
                <h4 className="font-bold text-white text-sm mb-2">Enroll Now</h4>
                <p className="text-gray-200 text-xs mb-4">SY 2026-2027 enrollment is ongoing.</p>
                <Link href="/admission/enroll" className="inline-block bg-[#D4A017] hover:bg-[#c49515] text-[#8B1010] font-semibold px-6 py-2 text-xs rounded transition-colors">Enroll Here</Link>
              </div>
            </aside>
          </div>
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
