"use client";

import { useState } from "react";

const MOCK_APPLICANTS = [
  { id: "APP-20260001", name: "Juan Dela Cruz", grade: "Grade 7", type: "New Student", status: "Pending", date: "2026-06-10" },
  { id: "APP-20260002", name: "Maria Santos", grade: "Grade 11", type: "Transferee", status: "Reviewing", date: "2026-06-09" },
  { id: "APP-20260003", name: "Pedro Reyes", grade: "Grade 8", type: "Old Student", status: "Approved", date: "2026-06-09" },
  { id: "APP-20260004", name: "Ana Gonzales", grade: "Grade 7", type: "New Student", status: "Pending", date: "2026-06-08" },
  { id: "APP-20260005", name: "Jose Rizal Jr.", grade: "Grade 11", type: "Balik-Aral", status: "Reviewing", date: "2026-06-08" },
  { id: "APP-20260006", name: "Luisa Tan", grade: "Grade 10", type: "Old Student", status: "Approved", date: "2026-06-07" },
  { id: "APP-20260007", name: "Carlos Garcia", grade: "Grade 7", type: "New Student", status: "Pending", date: "2026-06-07" },
  { id: "APP-20260008", name: "Isabel Cruz", grade: "Grade 12", type: "Transferee", status: "Rejected", date: "2026-06-06" },
];

const STATUS_OPTIONS = ["All", "Pending", "Reviewing", "Approved", "Rejected"];
const GRADE_OPTIONS = ["All", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Reviewing: "bg-blue-100 text-blue-700",
    Approved: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full ${colors[status] || ""}`}>
      {status}
    </span>
  );
}

export default function ApplicantsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");

  const [statusOpen, setStatusOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);

  const filtered = MOCK_APPLICANTS.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "All" || a.status === statusFilter) &&
      (gradeFilter === "All" || a.grade === gradeFilter)
  );

  function CustomDropdown({ label, value, onChange, options, open, setOpen }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
    open: boolean;
    setOpen: (v: boolean) => void;
  }) {
    return (
      <div className="relative z-40">
        <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full flex items-center justify-between px-3 py-2.5 border-2 rounded-xl text-sm transition-all bg-white ${
            value !== "All" ? "border-[#8B1010] bg-[#8B1010]/5 text-[#8B1010] font-medium" : "border-gray-200 text-gray-700"
          }`}
        >
          <span>{value}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`}>
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        {open && (
          <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { onChange(opt); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                  value === opt ? "bg-[#8B1010] text-white font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Applicants</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage enrollment applications — {MOCK_APPLICANTS.length} total
            </p>
          </div>
          <button className="bg-[#8B1010] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#6e0d0d] transition-colors flex items-center gap-2 self-start cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            New Applicant
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="relative mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by applicant name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CustomDropdown label="Status" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} open={statusOpen} setOpen={setStatusOpen} />
          <CustomDropdown label="Grade Level" value={gradeFilter} onChange={setGradeFilter} options={GRADE_OPTIONS} open={gradeOpen} setOpen={setGradeOpen} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Grade</th>
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date</th>
              <th className="text-right px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-xs sm:text-sm font-mono text-gray-500">{a.id}</td>
                <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-700">{a.name}</td>
                <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{a.grade}</td>
                <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 hidden md:table-cell">{a.type}</td>
                <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                <td className="px-4 py-3 text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{a.date}</td>
                <td className="px-4 py-3 text-right">
                  <button className="text-[11px] sm:text-xs font-medium text-[#8B1010] hover:underline cursor-pointer">View</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No applicants found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
