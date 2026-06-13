"use client";

import { useState, useRef, useEffect } from "react";

function CustomSelect({ label, value, onChange, options, placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
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
      <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm border-2 rounded-xl transition-all duration-200 bg-white text-left border-gray-200 hover:border-gray-300"
      >
        <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
          {value ? selected?.label : placeholder || "Select option"}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 flex-shrink-0 text-gray-400 ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-40 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-60 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-all border-b border-gray-50 last:border-b-0 min-h-[40px] flex items-center ${
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

const MOCK_TICKETS = [
  { id: "TKT-001", subject: "Computer Laboratory Unit 5 not booting", status: "Open", priority: "High", assigned: "Juan Tec", date: "2026-06-13" },
  { id: "TKT-002", subject: "Printer cartridge replacement — ICT Office", status: "In Progress", priority: "Medium", assigned: "Maria Fix", date: "2026-06-12" },
  { id: "TKT-003", subject: "WiFi access point disconnected — Room 204", status: "Open", priority: "High", assigned: "Juan Tec", date: "2026-06-12" },
  { id: "TKT-004", subject: "LCD projector bulb replacement", status: "Resolved", priority: "Low", assigned: "Carlos Tech", date: "2026-06-11" },
  { id: "TKT-005", subject: "New account creation for Grade 7 students", status: "Open", priority: "Medium", assigned: "Maria Fix", date: "2026-06-10" },
  { id: "TKT-006", subject: "Network cabinet cooling fan repair", status: "In Progress", priority: "High", assigned: "Juan Tec", date: "2026-06-09" },
  { id: "TKT-007", subject: "Software license renewal — Adobe Suite", status: "Resolved", priority: "Low", assigned: "Admin", date: "2026-06-08" },
  { id: "TKT-008", subject: "Smart TV mount installation — Room 101", status: "Open", priority: "Medium", assigned: "Carlos Tech", date: "2026-06-07" },
];

const STATUS_COLORS: Record<string, string> = {
  "Open": "bg-blue-100 text-blue-700",
  "In Progress": "bg-[#D4A017]/15 text-[#b8960e]",
  "Resolved": "bg-[#1E5631]/10 text-[#1E5631]",
  "Closed": "bg-gray-100 text-gray-500",
};

const PRIORITY_COLORS: Record<string, string> = {
  "High": "text-[#8B1010] font-bold",
  "Medium": "text-[#D4A017] font-semibold",
  "Low": "text-gray-400",
};

export default function ICTTickets() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const filtered = MOCK_TICKETS.filter(
    (t) =>
      (t.subject.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.assigned.toLowerCase().includes(search.toLowerCase())) &&
      (!statusFilter || t.status === statusFilter) &&
      (!priorityFilter || t.priority === priorityFilter)
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}} />

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Tickets</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage support tickets — {MOCK_TICKETS.length} total
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#8B1010] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#6e0d0d] transition-colors flex items-center gap-2 self-start cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            Create Ticket
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="relative mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by ticket ID, subject, or assignee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CustomSelect
            label="Status"
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="All"
            options={[
              { value: "Open", label: "Open" },
              { value: "In Progress", label: "In Progress" },
              { value: "Resolved", label: "Resolved" },
              { value: "Closed", label: "Closed" },
            ]}
          />
          <CustomSelect
            label="Priority"
            value={priorityFilter}
            onChange={setPriorityFilter}
            placeholder="All"
            options={[
              { value: "High", label: "High" },
              { value: "Medium", label: "Medium" },
              { value: "Low", label: "Low" },
            ]}
          />
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Ticket</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Subject</th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="hidden md:table-cell px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono font-medium text-[#8B1010]">{ticket.id}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-800 max-w-[200px] truncate">{ticket.subject}</td>
                  <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`inline-flex text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[ticket.status] || "bg-gray-100 text-gray-500"}`}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4">
                    <span className={`text-[11px] sm:text-xs ${PRIORITY_COLORS[ticket.priority] || "text-gray-500"}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">{ticket.assigned}</td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-400">{ticket.date}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <button className="text-[11px] sm:text-xs font-medium text-[#8B1010] hover:underline cursor-pointer">View</button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-sm text-gray-400">
                    No tickets found matching &quot;{search}&quot;
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4">
        {[
          { label: "Open", count: MOCK_TICKETS.filter((t) => t.status === "Open").length, color: "text-blue-600" },
          { label: "In Progress", count: MOCK_TICKETS.filter((t) => t.status === "In Progress").length, color: "text-[#b8960e]" },
          { label: "Resolved", count: MOCK_TICKETS.filter((t) => t.status === "Resolved").length, color: "text-[#1E5631]" },
          { label: "High Priority", count: MOCK_TICKETS.filter((t) => t.priority === "High").length, color: "text-[#8B1010]" },
        ].map((item) => (
          <div key={item.label} className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold" style={{ color: item.color.replace("text-", "#") }}>{item.count}</p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Create Ticket Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="fixed inset-0 bg-black/50" style={{ animation: "fadeIn 0.2s ease-out" }} onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ animation: "modalIn 0.2s ease-out" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Create Ticket</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Subject</label>
                <input type="text" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Description</label>
                <textarea rows={4} className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Priority</label>
                  <select className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all bg-white">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Assigned To</label>
                  <input type="text" className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all" />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer">Cancel</button>
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium bg-[#8B1010] text-white rounded-lg hover:bg-[#6e0d0d] transition-colors cursor-pointer">Create Ticket</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
