"use client";

const STATS = [
  { label: "Total Students", value: "1,284", change: "+12 this month", color: "#8B1010" },
  { label: "Enrolled Today", value: "23", change: "5 pending review", color: "#1E5631" },
  { label: "Active Sections", value: "42", change: "6 grade levels", color: "#D4A017" },
  { label: "Announcements", value: "8", change: "2 new this week", color: "#8B1010" },
];

const RECENT_ENROLLEES = [
  { name: "Juan Dela Cruz", grade: "Grade 7 - Diamond", time: "2 mins ago" },
  { name: "Maria Santos", grade: "Grade 11 - STEM", time: "15 mins ago" },
  { name: "Pedro Reyes", grade: "Grade 9 - Gold", time: "1 hr ago" },
  { name: "Ana Garcia", grade: "Grade 7 - Ruby", time: "2 hrs ago" },
  { name: "Luis Mendoza", grade: "Grade 12 - ABM", time: "3 hrs ago" },
];

const SECTION_SUMMARY = [
  { section: "Grade 7 - Diamond", adviser: "Ms. Cruz", students: 45 },
  { section: "Grade 8 - Emerald", adviser: "Mr. Santos", students: 42 },
  { section: "Grade 9 - Gold", adviser: "Ms. Reyes", students: 40 },
  { section: "Grade 10 - Silver", adviser: "Mr. Garcia", students: 38 },
];

export default function AdminDashboard() {
  return (
    <>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Welcome back, Admin. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-md transition-shadow"
          >
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
        {/* Recent Enrollees */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm sm:text-base font-bold text-gray-800">Recent Enrollees</h3>
            <button className="text-[11px] sm:text-xs text-[#8B1010] font-semibold hover:underline">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_ENROLLEES.map((item, i) => (
              <div key={i} className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#8B1010]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-[#8B1010]">
                    {item.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-gray-700">
                    <span className="font-semibold">{item.name}</span>{" "}
                    <span className="text-gray-500">enrolled in</span>{" "}
                    <span className="font-medium text-[#1E5631]">{item.grade}</span>
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section Summary */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm sm:text-base font-bold text-gray-800">Section Summary</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {SECTION_SUMMARY.map((section, i) => (
              <div key={i} className="px-4 sm:px-6 py-3 sm:py-3.5">
                <p className="text-xs sm:text-sm font-semibold text-gray-800">{section.section}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-[11px] text-gray-500">Adviser: {section.adviser}</p>
                  <p className="text-[11px] font-medium text-[#1E5631]">{section.students} students</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
