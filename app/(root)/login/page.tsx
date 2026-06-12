import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B1010] via-[#6e0d0d] to-[#5a0b0b] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[520px]">
        <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
          <div className="flex items-center gap-4 mb-6">
            <Image src="/logo.png" alt="MNHS Logo" width={64} height={64} className="rounded-full shadow-sm flex-shrink-0" />
            <div>
              <h1 className="text-lg font-bold text-[#8B1010] leading-tight">MABOLO NATIONAL HIGH SCHOOL</h1>
              <p className="text-[11px] text-[#4b5563]">Cebu City — Division of Cebu City</p>
              <p className="text-[10px] text-[#D4A017] font-semibold tracking-wider uppercase mt-0.5">DepEd &middot; Region VII</p>
            </div>
          </div>

          <hr className="border-gray-200 mb-6" />

          <h2 className="text-base font-bold text-gray-800 mb-6">Sign In</h2>

          <form className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email or Student ID <span className="text-[#8B1010]">*</span></label>
              <input
                type="text"
                placeholder="Enter your email or student ID"
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password <span className="text-[#8B1010]">*</span></label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 text-sm border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all bg-white"
              />
            </div>
            <button type="submit" className="w-full bg-[#8B1010] hover:bg-[#6e0d0d] text-white font-semibold py-3 px-6 text-sm rounded-xl transition-colors">Sign In</button>
          </form>
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">Back to Homepage</Link>
          <span className="text-white/40">|</span>
          <Link href="/admission/enroll" className="text-white/80 hover:text-white transition-colors">Enroll</Link>
          <span className="text-white/40">|</span>
          <a href="#" className="text-white/80 hover:text-white transition-colors">Forgot Password</a>
        </div>
      </div>
    </div>
  );
}
