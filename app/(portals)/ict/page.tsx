"use client";

const STATS = [
  { label: "Total Students", value: "1,284", change: "+12 this month", color: "#8B1010" },
  { label: "Active Accounts", value: "847", change: "62% of total", color: "#1E5631" },
  { label: "Open Tickets", value: "18", change: "5 urgent", color: "#D4A017" },
  { label: "Pending Requests", value: "34", change: "8 new today", color: "#8B1010" },
];

const RECENT_ACTIVITY = [
  { user: "Juan Dela Cruz", action: "submitted Grade 7 enrollment", time: "2 mins ago" },
  { user: "Maria Santos", action: "updated account details", time: "15 mins ago" },
  { user: "Admin", action: "approved enrollment #20260042", time: "1 hr ago" },
  { user: "Pedro Reyes", action: "submitted Grade 11 enrollment", time: "2 hrs ago" },
  { user: "Admin", action: "resolved ticket #104", time: "3 hrs ago" },
];

const QUICK_LINKS = [
  { label: "Manage Accounts", count: "847 active" },
  { label: "View All Tickets", count: "18 open" },
  { label: "System Logs", count: "Last 24 hrs" },
  { label: "Audit Trail", count: "View history" },
];

export default function ICTDashboard() {
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
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm sm:text-base font-bold text-gray-800">Recent Activity</h3>
            <button className="text-[11px] sm:text-xs text-[#8B1010] font-semibold hover:underline">
              View All
            </button>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="px-4 sm:px-6 py-3 sm:py-3.5 flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-[#8B1010]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-[#8B1010]">
                    {item.user.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
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

        {/* Quick Links */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm sm:text-base font-bold text-gray-800">Quick Access</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {QUICK_LINKS.map((link, i) => (
              <button
                key={i}
                className="w-full px-4 sm:px-6 py-3 sm:py-3.5 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
              >
                <span className="text-xs sm:text-sm font-medium text-gray-700 hover:text-[#8B1010] transition-colors">
                  {link.label}
                </span>
                <span className="text-[10px] sm:text-[11px] text-gray-400 flex-shrink-0">{link.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
