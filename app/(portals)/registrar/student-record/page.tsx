"use client";

import { useState } from "react";

const MOCK_RECORDS = [
  { id: "2024-001", name: "Juan Dela Cruz", grade: "Grade 10", section: "A", status: "Active", lrn: "123456789101" },
  { id: "2024-002", name: "Maria Santos", grade: "Grade 12", section: "STEM-A", status: "Active", lrn: "123456789102" },
  { id: "2024-003", name: "Pedro Reyes", grade: "Grade 8", section: "C", status: "Active", lrn: "123456789103" },
  { id: "2024-004", name: "Ana Gonzales", grade: "Grade 7", section: "A", status: "Active", lrn: "123456789104" },
  { id: "2024-005", name: "Jose Rizal Jr.", grade: "Grade 11", section: "HUMSS-A", status: "Active", lrn: "123456789105" },
  { id: "2024-006", name: "Luisa Tan", grade: "Grade 10", section: "B", status: "Inactive", lrn: "123456789106" },
  { id: "2024-007", name: "Carlos Garcia", grade: "Grade 7", section: "B", status: "Active", lrn: "123456789107" },
  { id: "2024-008", name: "Isabel Cruz", grade: "Grade 12", section: "ABM-A", status: "Transferred", lrn: "123456789108" },
];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-100 text-gray-600",
    Transferred: "bg-blue-100 text-blue-700",
    Graduated: "bg-[#1E5631]/10 text-[#1E5631]",
  };
  return (
    <span className={`inline-block text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full ${colors[status] || ""}`}>
      {status}
    </span>
  );
}

export default function StudentRecordPage() {
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeOpen, setGradeOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const GRADE_OPTIONS = ["All", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
  const STATUS_OPTIONS = ["All", "Active", "Inactive", "Transferred", "Graduated"];

  const filtered = MOCK_RECORDS.filter(
    (r) =>
      (r.name.toLowerCase().includes(search.toLowerCase()) || r.lrn.includes(search)) &&
      (gradeFilter === "All" || r.grade === gradeFilter) &&
      (statusFilter === "All" || r.status === statusFilter)
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Student Records</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              View and manage student records — {MOCK_RECORDS.length} total
            </p>
          </div>
          <button className="bg-[#8B1010] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#6e0d0d] transition-colors flex items-center gap-2 self-start cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
            </svg>
            Export Records
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
            placeholder="Search by name or LRN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CustomDropdown label="Grade Level" value={gradeFilter} onChange={setGradeFilter} options={GRADE_OPTIONS} open={gradeOpen} setOpen={setGradeOpen} />
          <CustomDropdown label="Status" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} open={statusOpen} setOpen={setStatusOpen} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</th>
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">LRN</th>
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Grade</th>
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Section</th>
              <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3 text-xs sm:text-sm font-mono text-gray-500">{r.id}</td>
                <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-700">{r.name}</td>
                <td className="px-4 py-3 text-xs sm:text-sm text-gray-500 hidden sm:table-cell">{r.lrn}</td>
                <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{r.grade}</td>
                <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 hidden md:table-cell">{r.section}</td>
                <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                <td className="px-4 py-3 text-right">
                  <button className="text-[11px] sm:text-xs font-medium text-[#8B1010] hover:underline cursor-pointer">View</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
