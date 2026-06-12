"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

function IconMapPin() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  );
}

function IconMail() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
  );
}

function IconClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
}

function CustomSelect({ label, value, onChange, options, required, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label} {required && <span className="text-[#8B1010]">*</span>}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm border-2 rounded-xl transition-all duration-200 bg-white text-left ${
          open
            ? "border-[#8B1010] ring-2 ring-[#8B1010]/10"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
          {value ? selected?.label : placeholder || "Select option"}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 flex-shrink-0 text-gray-400 ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-40 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm transition-all border-b border-gray-50 last:border-b-0 min-h-[44px] flex items-center ${
                opt.value === value
                  ? "bg-[#8B1010]/5 text-[#8B1010] font-semibold"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ContactPage() {
  const [subject, setSubject] = useState("");

  const subjectOptions = [
    { value: "inquiry", label: "General Inquiry" },
    { value: "admissions", label: "Admissions" },
    { value: "enrollment", label: "Enrollment Concerns" },
    { value: "records", label: "Student Records" },
    { value: "suggestion", label: "Suggestion / Feedback" },
    { value: "other", label: "Other" },
  ];

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
                <Link key={item.href} href={item.href} className={`px-4 py-2 text-sm font-medium transition-colors rounded ${item.href === "/contact" ? "text-[#8B1010] font-bold" : "text-gray-700 hover:text-[#8B1010] hover:bg-red-50"}`}>{item.label}</Link>
              ))}
              <Link href="/login" className="ml-3 px-5 py-2 text-xs lg:text-sm font-medium bg-[#8B1010] text-white hover:bg-[#6e0d0d] transition-colors rounded">Login</Link>
            </nav>
            <button className="lg:hidden text-[#8B1010] p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>

      <section className="relative h-[300px] bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/bg.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B1010]/95 via-[#8B1010]/80 to-[#1E5631]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-3">Get in Touch</p>
            <h2 className="text-4xl font-bold text-white leading-tight">Contact Information</h2>
          </div>
        </div>
      </section>

      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#8B1010] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#8B1010] font-medium">Contact</span>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-2">Reach Us</p>
            <h3 className="text-3xl font-bold text-[#8B1010]">Contact Information</h3>
            <div className="w-16 h-1 bg-[#D4A017] mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#8B1010]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#8B1010]"><IconMapPin /></span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">Office Address</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Mabolo National High School<br />Mabolo, Cebu City<br />Philippines 6000
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#1E5631]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#1E5631]"><IconMail /></span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">Phone & Email</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Tel: (032) 123-4567<br />Email: mnhs.deped@gmail.com<br />DepEd Hotline: (02) 8636-1663
                </p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[#D4A017]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-[#D4A017]"><IconClock /></span>
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">Office Hours</h4>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Monday – Friday<br />7:00 AM – 5:00 PM<br />Saturday: 7:00 AM – 12:00 PM
                </p>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-[#f8f9fa] border border-gray-200 rounded-lg p-8">
                <h4 className="text-xl font-bold text-[#8B1010] mb-6">Send Us a Message</h4>
                <form className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name <span className="text-[#8B1010]">*</span></label>
                      <input type="text" placeholder="Enter your full name" className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address <span className="text-[#8B1010]">*</span></label>
                      <input type="email" placeholder="Enter your email address" className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all bg-white" />
                    </div>
                  </div>
                  <div>
                    <CustomSelect label="Subject" value={subject} onChange={setSubject} options={subjectOptions} required placeholder="Select a subject" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Message <span className="text-[#8B1010]">*</span></label>
                    <textarea rows={5} placeholder="Type your message here..." className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all bg-white resize-y" />
                  </div>
                  <button type="submit" className="w-full bg-[#8B1010] hover:bg-[#6e0d0d] text-white font-semibold py-3 px-6 text-sm rounded-xl transition-colors">Send Message</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-2">Location</p>
            <h3 className="text-3xl font-bold text-[#8B1010]">Find Us on the Map</h3>
            <div className="w-16 h-1 bg-[#D4A017] mx-auto mt-4 rounded-full" />
          </div>
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.203599301883!2d123.89147737480958!3d10.333094889292147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a9993b0f0c0c0f%3A0x8c3c5b5a5b5c5d5e!2sMabolo%20National%20High%20School!5e0!3m2!1sen!2sph!4v1"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mabolo National High School Location"
            />
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#1E5631] text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-3">Visit Our Campus</h3>
          <p className="text-gray-200 text-sm mb-6 max-w-xl mx-auto">We welcome visitors and prospective students. Schedule a campus tour or visit our registrar&apos;s office during office hours.</p>
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="inline-block bg-[#D4A017] hover:bg-[#c49515] text-[#8B1010] font-semibold px-10 py-3 text-sm transition-colors rounded">Get Directions</a>
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
