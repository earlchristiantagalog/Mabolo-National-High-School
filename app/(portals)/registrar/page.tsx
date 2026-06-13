"use client";

const STATS = [
  { label: "Total Enrolled", value: "1,284", change: "+48 this school year", color: "#8B1010" },
  { label: "Pending Applicants", value: "67", change: "12 for review", color: "#D4A017" },
  { label: "Verified Records", value: "1,210", change: "94% completion rate", color: "#1E5631" },
  { label: "Grade Sections", value: "42", change: "7 per grade level", color: "#8B1010" },
];

const RECENT_ACTIVITY = [
  { user: "Juan Dela Cruz", action: "enrolled in Grade 7 — Section A", time: "2 mins ago" },
  { user: "Maria Santos", action: "submitted Grade 10 requirements", time: "15 mins ago" },
  { user: "Registrar", action: "verified documents for #20260042", time: "1 hr ago" },
  { user: "Pedro Reyes", action: "transferred to Grade 11 — STEM", time: "2 hrs ago" },
  { user: "Registrar", action: "updated student records for batch 2024", time: "3 hrs ago" },
];

export default function RegistrarDashboard() {
  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Welcome back, Registrar. Here&apos;s the enrollment summary.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow">
            <p className="text-[11px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
              {stat.label}
            </p>
            <p className="text-2xl sm:text-3xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm sm:text-base font-bold text-gray-800">Recent Activity</h3>
            <button className="text-[11px] sm:text-xs text-[#8B1010] font-semibold hover:underline cursor-pointer">View All</button>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#8B1010]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-[#8B1010]">
                    {item.user.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-700">
                    <span className="font-semibold">{item.user}</span>{" "}
                    <span className="text-gray-500">{item.action}</span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm sm:text-base font-bold text-gray-800">Enrollment Overview</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { label: "Grade 7", count: "320" },
              { label: "Grade 8", count: "285" },
              { label: "Grade 9", count: "264" },
              { label: "Grade 10", count: "241" },
              { label: "Grade 11", count: "98" },
              { label: "Grade 12", count: "76" },
            ].map((g, i) => (
              <div key={i} className="px-4 sm:px-6 py-3 flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-gray-700">{g.label}</span>
                <span className="text-xs sm:text-sm font-semibold text-[#8B1010]">{g.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
