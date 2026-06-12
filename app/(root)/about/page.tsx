import Image from "next/image";
import Link from "next/link";

function IconTarget() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  );
}

function IconEye() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}

function IconUsers() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
  );
}

function IconFlag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/></svg>
  );
}

export default function AboutPage() {
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
                <Link key={item.href} href={item.href} className={`px-4 py-2 text-sm font-medium transition-colors rounded ${item.href === "/about" ? "bg-[#8B1010] text-white" : "text-gray-700 hover:text-[#8B1010] hover:bg-red-50"}`}>{item.label}</Link>
              ))}
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
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-3">About the School</p>
            <h2 className="text-4xl font-bold text-white leading-tight">About Mabolo National High School</h2>
          </div>
        </div>
      </section>

      <div className="bg-gray-100 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#8B1010] transition-colors">Home</Link><span>/</span>
            <span className="text-[#8B1010] font-medium">About</span>
          </div>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-2">Our Story</p>
              <h3 className="text-3xl font-bold text-[#8B1010] mb-6">School History</h3>
              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>Mabolo National High School (MNHS) was established in 1975 through the concerted efforts of community leaders, parents, and the Department of Education to provide accessible secondary education to the youth of Mabolo, Cebu City.</p>
                <p>What started as a small barangay high school with only three classrooms and a handful of teachers has grown into one of the most respected public secondary institutions in the Division of Cebu City. Over the decades, the school has expanded its facilities, programs, and faculty to accommodate the growing number of learners.</p>
                <p>Today, MNHS serves over 1,500 students from Grades 7 to 12, offering both Junior High School and Senior High School programs under the K-12 curriculum. The school is recognized for its academic excellence, strong values formation, and active community engagement.</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-white rounded-lg border border-gray-100"><p className="text-3xl font-bold text-[#D4A017]">1975</p><p className="text-xs text-gray-500 mt-1">Year Established</p></div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-100"><p className="text-3xl font-bold text-[#D4A017]">1,500+</p><p className="text-xs text-gray-500 mt-1">Current Enrollment</p></div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-100"><p className="text-3xl font-bold text-[#D4A017]">80+</p><p className="text-xs text-gray-500 mt-1">Faculty Members</p></div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-100"><p className="text-3xl font-bold text-[#D4A017]">49</p><p className="text-xs text-gray-500 mt-1">Years of Service</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-2">Guiding Principles</p>
            <h3 className="text-3xl font-bold text-[#8B1010]">Mission & Vision</h3>
            <div className="w-16 h-1 bg-[#D4A017] mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#8B1010]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#8B1010]"><IconTarget /></span>
                </div>
                <h4 className="font-bold text-[#8B1010] text-lg">Our Mission</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">Mabolo National High School is committed to providing accessible, inclusive, and quality basic education that develops critical thinking, moral values, and national pride. We strive to produce well-rounded Filipino learners equipped with 21st-century skills who are prepared for higher education, livelihood, and active citizenship.</p>
            </div>
            <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#1E5631]/10 rounded-full flex items-center justify-center">
                  <span className="text-[#1E5631]"><IconEye /></span>
                </div>
                <h4 className="font-bold text-[#1E5631] text-lg">Our Vision</h4>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">A leading public high school in the Division of Cebu City, recognized for academic excellence, holistic learner development, community service, and innovation — producing globally competitive Filipinos who uphold the values of integrity, compassion, and dedication to nation-building.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-2">DepEd Core Values</p>
            <h3 className="text-3xl font-bold text-[#8B1010]">Core Values</h3>
            <div className="w-16 h-1 bg-[#D4A017] mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Maka-Diyos", desc: "God-fearing and spiritually grounded in all actions and decisions.", color: "#D4A017" },
              { label: "Maka-Tao", desc: "Compassionate, respectful, and committed to the well-being of others.", color: "#8B1010" },
              { label: "Makakalikasan", desc: "Environmentally conscious and responsible stewards of nature.", color: "#1E5631" },
              { label: "Makabansa", desc: "Patriotic and dedicated to the service of the Filipino people and the nation.", color: "#b81c1c" },
            ].map((val, i) => (
              <div key={i} className="bg-[#f8f9fa] rounded-lg p-6 border border-gray-200 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: val.color + "15" }}>
                  <span style={{ color: val.color }}><IconFlag /></span>
                </div>
                <h4 className="font-bold text-gray-800 mb-2" style={{ color: val.color }}>{val.label}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#1E5631] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-2">School Data</p>
            <h3 className="text-3xl font-bold">School Profile</h3>
            <div className="w-16 h-1 bg-[#D4A017] mx-auto mt-4 rounded-full" />
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
              <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-5"><p className="text-[#D4A017] text-xs font-medium mb-1">{item.label}</p><p className="text-white text-sm font-semibold">{item.value}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-2">School Organization</p>
            <h3 className="text-3xl font-bold text-[#8B1010]">Organizational Structure</h3>
            <div className="w-16 h-1 bg-[#D4A017] mx-auto mt-4 rounded-full" />
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-block bg-[#8B1010] text-white px-10 py-4 rounded-lg shadow-md">
                <p className="text-xs uppercase tracking-wider text-[#D4A017] font-semibold">School Head</p>
                <p className="font-bold text-lg">Dr. Juan M. Dela Cruz</p>
                <p className="text-xs text-gray-200">Principal IV</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <div className="bg-white border border-gray-200 rounded-lg p-5 text-center shadow-sm">
                <div className="w-10 h-10 bg-[#D4A017]/15 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-[#D4A017] font-bold text-lg">A</span></div>
                <h4 className="font-bold text-gray-800 text-sm">Academic Affairs</h4>
                <p className="text-xs text-gray-500 mt-1">Curriculum, Instruction & Assessment</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5 text-center shadow-sm">
                <div className="w-10 h-10 bg-[#1E5631]/15 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-[#1E5631] font-bold text-lg">S</span></div>
                <h4 className="font-bold text-gray-800 text-sm">Student Services</h4>
                <p className="text-xs text-gray-500 mt-1">Guidance, Discipline & Welfare</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-5 text-center shadow-sm">
                <div className="w-10 h-10 bg-[#8B1010]/15 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-[#8B1010] font-bold text-lg">A</span></div>
                <h4 className="font-bold text-gray-800 text-sm">Administration</h4>
                <p className="text-xs text-gray-500 mt-1">Finance, HR & Facilities</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-[#8B1010]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">Visit Us Today</h3>
          <p className="text-gray-200 text-sm mb-6 max-w-xl mx-auto">Learn more about what Mabolo National High School has to offer. Schedule a campus tour or contact our admissions office.</p>
          <Link href="/contact" className="inline-block bg-[#D4A017] hover:bg-[#c49515] text-[#8B1010] font-semibold px-10 py-3 text-sm transition-colors rounded">Contact Us</Link>
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
