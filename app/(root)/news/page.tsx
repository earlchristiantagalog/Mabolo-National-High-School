import Image from "next/image";
import Link from "next/link";

export default function NewsPage() {
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
                <Link key={item.href} href={item.href} className={`px-4 py-2 text-sm font-medium transition-colors rounded ${item.href === "/news" ? "bg-[#8B1010] text-white" : "text-gray-700 hover:text-[#8B1010] hover:bg-red-50"}`}>{item.label}</Link>
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
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No announcements yet.</p>
            <p className="text-sm mt-2">Check back soon for updates and announcements.</p>
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
