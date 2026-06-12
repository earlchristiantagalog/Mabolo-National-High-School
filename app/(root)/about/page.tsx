import Image from "next/image";
import Link from "next/link";

function IconTarget() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  );
}

function IconEye() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}

function IconUsers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}

function IconBook() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
  );
}

function IconClock() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  );
}

function IconFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
  );
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-[#1a1a1a]">
      {/* Top Government Bar */}
      <div className="bg-[#1E5631] text-white text-xs lg:text-sm">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 sm:h-9 py-2 sm:py-0">
          <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 text-center sm:text-left">
            <span className="font-medium text-xs sm:text-sm">Republic of the Philippines</span>
            <span className="text-gray-300 hidden sm:inline">|</span>
            <span className="text-gray-300 text-xs sm:text-sm">Department of Education</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 lg:gap-4 text-gray-300 text-xs">
            <span className="hidden lg:inline">DepEd Division of Cebu City</span>
            <span className="hidden lg:inline">|</span>
            <span>Region VII — Central Visayas</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="bg-white border-b-4 border-[#8B1010] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 lg:gap-4 min-w-0 flex-1 sm:flex-initial">
              <Image src="/logo.png" alt="MNHS Official Seal" width={48} height={48} className="rounded-full shadow-sm w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex-shrink-0" priority />
              <div className="min-w-0 flex-1 sm:flex-initial">
                <h1 className="text-xs sm:text-sm lg:text-lg font-bold text-[#8B1010] leading-tight line-clamp-2">MABOLO NATIONAL HIGH SCHOOL</h1>
                <p className="text-[9px] sm:text-[10px] lg:text-[11px] text-[#4b5563] tracking-wide hidden sm:block">Cebu City — Division of Cebu City</p>
                <p className="text-[8px] sm:text-[9px] lg:text-[10px] text-[#D4A017] font-semibold tracking-wider uppercase mt-0.5 hidden sm:block">DepEd &middot; Region VII</p>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-0.5 ml-auto">
              {[
                { label: "About", href: "/about" },
                { label: "Programs", href: "/programs" },
                { label: "Admission", href: "/admission" },
                { label: "Announcements", href: "/news" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <Link key={item.href} href={item.href} className={`px-3 lg:px-4 py-2 text-xs lg:text-sm font-medium transition-colors rounded ${item.href === "/about" ? "bg-[#8B1010] text-white" : "text-gray-700 hover:text-[#8B1010] hover:bg-red-50"}`}>{item.label}</Link>
              ))}
            </nav>
            <button className="lg:hidden text-[#8B1010] p-2 ml-auto" aria-label="Toggle menu">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Page Hero */}
      <section className="relative min-h-[250px] sm:min-h-[300px] md:min-h-[350px] lg:min-h-[400px] bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/bg.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B1010]/95 via-[#8B1010]/80 to-[#1E5631]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 w-full py-6 sm:py-8 lg:py-0">
          <div className="max-w-2xl">
            <p className="text-[#D4A017] font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2 sm:mb-3">About the School</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">About Mabolo National High School</h2>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-2 sm:py-3">
          <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500">
            <Link href="/" className="hover:text-[#8B1010] transition-colors">Home</Link><span>/</span>
            <span className="text-[#8B1010] font-medium">About</span>
          </div>
        </div>
      </div>

      {/* School History */}
      <section className="py-8 sm:py-12 md:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-[#D4A017] font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2">Our Story</p>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#8B1010] mb-4 sm:mb-6">School History</h3>
              <div className="space-y-3 sm:space-y-4 text-gray-600 text-xs sm:text-sm leading-relaxed">
                <p>Mabolo National High School (MNHS) was established in 1975 through the concerted efforts of community leaders, parents, and the Department of Education to provide accessible secondary education to the youth of Mabolo, Cebu City.</p>
                <p>What started as a small barangay high school with only three classrooms and a handful of teachers has grown into one of the most respected public secondary institutions in the Division of Cebu City. Over the decades, the school has expanded its facilities, programs, and faculty to accommodate the growing number of learners.</p>
                <p>Today, MNHS serves over 1,500 students from Grades 7 to 12, offering both Junior High School and Senior High School programs under the K-12 curriculum. The school is recognized for its academic excellence, strong values formation, and active community engagement.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                <div className="text-center p-3 sm:p-4 bg-white rounded-lg border border-gray-100"><p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D4A017]">1975</p><p className="text-[10px] sm:text-xs text-gray-500 mt-1">Year Established</p></div>
                <div className="text-center p-3 sm:p-4 bg-white rounded-lg border border-gray-100"><p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D4A017]">1,500+</p><p className="text-[10px] sm:text-xs text-gray-500 mt-1">Current Enrollment</p></div>
                <div className="text-center p-3 sm:p-4 bg-white rounded-lg border border-gray-100"><p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D4A017]">80+</p><p className="text-[10px] sm:text-xs text-gray-500 mt-1">Faculty Members</p></div>
                <div className="text-center p-3 sm:p-4 bg-white rounded-lg border border-gray-100"><p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#D4A017]">49</p><p className="text-[10px] sm:text-xs text-gray-500 mt-1">Years of Service</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-8 sm:py-12 md:py-14 lg:py-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-14">
            <p className="text-[#D4A017] font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2">Guiding Principles</p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#8B1010]">Mission & Vision</h3>
            <div className="w-12 sm:w-16 h-1 bg-[#D4A017] mx-auto mt-3 sm:mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
            <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#8B1010]/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-[#8B1010]"><IconTarget /></span></div>
                <h4 className="font-bold text-[#8B1010] text-base sm:text-lg">Our Mission</h4>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">Mabolo National High School is committed to providing accessible, inclusive, and quality basic education that develops critical thinking, moral values, and national pride. We strive to produce well-rounded Filipino learners equipped with 21st-century skills who are prepared for higher education, livelihood, and active citizenship.</p>
            </div>
            <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#1E5631]/10 rounded-full flex items-center justify-center flex-shrink-0"><span className="text-[#1E5631]"><IconEye /></span></div>
                <h4 className="font-bold text-[#1E5631] text-base sm:text-lg">Our Vision</h4>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">A leading public high school in the Division of Cebu City, recognized for academic excellence, holistic learner development, community service, and innovation — producing globally competitive Filipinos who uphold the values of integrity, compassion, and dedication to nation-building.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-8 sm:py-12 md:py-14 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-14">
            <p className="text-[#D4A017] font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2">DepEd Core Values</p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#8B1010]">Core Values</h3>
            <div className="w-12 sm:w-16 h-1 bg-[#D4A017] mx-auto mt-3 sm:mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
            {[
              { label: "Maka-Diyos", desc: "God-fearing and spiritually grounded in all actions and decisions.", color: "#D4A017", icon: <IconFlag /> },
              { label: "Maka-Tao", desc: "Compassionate, respectful, and committed to the well-being of others.", color: "#8B1010", icon: <IconUsers /> },
              { label: "Makakalikasan", desc: "Environmentally conscious and responsible stewards of nature.", color: "#1E5631", icon: <IconFlag /> },
              { label: "Makabansa", desc: "Patriotic and dedicated to the service of the Filipino people and the nation.", color: "#b81c1c", icon: <IconFlag /> },
            ].map((val, i) => (
              <div key={i} className="bg-[#f8f9fa] rounded-lg p-4 sm:p-5 lg:p-6 border border-gray-200 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: val.color + "15" }}><span className="text-sm sm:text-base" style={{ color: val.color }}>{val.icon}</span></div>
                <h4 className="font-bold text-gray-800 text-sm sm:text-base mb-1.5 sm:mb-2" style={{ color: val.color }}>{val.label}</h4>
                <p className="text-gray-500 text-[10px] sm:text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School Profile */}
      <section className="py-8 sm:py-12 md:py-14 lg:py-16 bg-[#1E5631] text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-14">
            <p className="text-[#D4A017] font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2">School Data</p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold">School Profile</h3>
            <div className="w-12 sm:w-16 h-1 bg-[#D4A017] mx-auto mt-3 sm:mt-4 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {[
              { label: "School ID", value: "303456" },
              { label: "Classification", value: "National High School" },
              { label: "School Type", value: "Public (DepEd)" },
              { label: "Curriculum", value: "K-12 Basic Education" },
              { label: "Grade Levels", value: "7 to 12" },
              { label: "School Head", value: "Dr. Juan M. Dela Cruz" },
              { label: "Congressional District", value: "Lone District of Cebu City" },
              { label: "Legislative District", value: "VII — Central Visayas" },
            ].map((item, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 sm:p-5"><p className="text-[#D4A017] text-[10px] sm:text-xs font-medium mb-1">{item.label}</p><p className="text-white text-xs sm:text-sm font-semibold">{item.value}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="py-8 sm:py-12 md:py-14 lg:py-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-8 sm:mb-10 lg:mb-14">
            <p className="text-[#D4A017] font-semibold text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-2">School Organization</p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#8B1010]">Organizational Structure</h3>
            <div className="w-12 sm:w-16 h-1 bg-[#D4A017] mx-auto mt-3 sm:mt-4 rounded-full" />
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-block bg-[#8B1010] text-white px-6 sm:px-10 py-3 sm:py-4 rounded-lg shadow-md">
                <p className="text-[9px] sm:text-xs uppercase tracking-wider text-[#D4A017] font-semibold">School Head</p>
                <p className="font-bold text-sm sm:text-lg">Dr. Juan M. Dela Cruz</p>
                <p className="text-[10px] sm:text-xs text-gray-200">Principal IV</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-5">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 text-center shadow-sm">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#D4A017]/15 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3"><span className="text-[#D4A017] font-bold text-base sm:text-lg">A</span></div>
                <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Academic Affairs</h4>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Curriculum, Instruction & Assessment</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 text-center shadow-sm">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#1E5631]/15 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3"><span className="text-[#1E5631] font-bold text-base sm:text-lg">S</span></div>
                <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Student Services</h4>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Guidance, Discipline & Welfare</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 text-center shadow-sm">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#8B1010]/15 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3"><span className="text-[#8B1010] font-bold text-base sm:text-lg">A</span></div>
                <h4 className="font-bold text-gray-800 text-xs sm:text-sm">Administration</h4>
                <p className="text-[10px] sm:text-xs text-gray-500 mt-1">Finance, HR & Facilities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-6 sm:py-10 lg:py-14 bg-[#8B1010]">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">Visit Us Today</h3>
          <p className="text-xs sm:text-sm md:text-base text-gray-200 mb-4 sm:mb-6 max-w-xl mx-auto px-2">Learn more about what Mabolo National High School has to offer. Schedule a campus tour or contact our admissions office.</p>
          <Link href="/contact" className="inline-block bg-[#D4A017] hover:bg-[#c49515] text-[#8B1010] font-semibold px-6 sm:px-10 py-2 sm:py-3 text-xs sm:text-sm transition-colors rounded">Contact Us</Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2d2d2d] text-white">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                <Image src="/logo.png" alt="MNHS Logo" width={40} height={40} className="rounded-full w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0" />
                <div><h4 className="font-bold text-xs sm:text-sm">Mabolo National High School</h4><p className="text-gray-400 text-[10px] sm:text-xs">DepEd Division of Cebu City</p></div>
              </Link>
              <p className="text-gray-400 text-[10px] sm:text-xs leading-relaxed max-w-sm">Committed to delivering quality, accessible, and inclusive basic education in compliance with the Department of Education&apos;s mandates and the K-12 program.</p>
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm mb-3 sm:mb-4 text-[#D4A017]">Quick Links</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/programs" className="hover:text-white transition-colors">Academic Programs</Link></li>
                <li><Link href="/news" className="hover:text-white transition-colors">News & Announcements</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Office</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm mb-3 sm:mb-4 text-[#D4A017]">Government Links</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">DepEd Official Website</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DepEd Order Portal</a></li>
                <li><a href="#" className="hover:text-white transition-colors">DepEd Cebu City Division</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Official Gazette</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-6 sm:mt-8 lg:mt-10 pt-4 sm:pt-6 flex flex-col gap-2 sm:gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-gray-500 text-[10px] sm:text-[11px] order-2 lg:order-1">&copy; 2026 Mabolo National High School. All rights reserved.</p>
            <p className="text-gray-500 text-[10px] sm:text-[11px] order-1 lg:order-2">Department of Education &middot; Republic of the Philippines</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
