"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type Section = { id: number; name: string; grade: string };

type TeacherAccount = {
  teacher_name: string;
  email: string;
  account_id: string;
  created_at: string;
  sections: { name: string; grade: string }[] | null;
};

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
      <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm border-2 rounded-xl transition-all duration-200 bg-white text-left border-gray-200 hover:border-gray-200"
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

export default function ICTTeachers() {
  const [sections, setSections] = useState<Section[]>([]);
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");
  const [search, setSearch] = useState("");
  const [allTeachers, setAllTeachers] = useState<TeacherAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalGrade, setModalGrade] = useState("");
  const [modalSections, setModalSections] = useState<Section[]>([]);
  const [modalSectionId, setModalSectionId] = useState("");
  const [modalTeachers, setModalTeachers] = useState<string[]>([]);
  const [modalTeacher, setModalTeacher] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const uniqueGrades = [...new Set(sections.map((s) => s.grade))].sort();
  const gradeSections = gradeFilter
    ? sections.filter((s) => s.grade === gradeFilter)
    : sections;

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sections");
      const data = await res.json();
      if (data.success) setSections(data.sections);
    } catch { /* empty */ }
  }, []);

  const fetchAllTeachers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ict/teacher-accounts");
      const data = await res.json();
      if (data.success) setAllTeachers(data.teachers);
      else setAllTeachers([]);
    } catch { setAllTeachers([]); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSections(); }, [fetchSections]);
  useEffect(() => { fetchAllTeachers(); }, [fetchAllTeachers]);

  useEffect(() => {
    if (!modalSectionId) { setModalTeachers([]); return; }
    fetch(`/api/ict/teacher-accounts/teachers?sectionId=${modalSectionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setModalTeachers(data.teachers);
        else setModalTeachers([]);
      })
      .catch(() => setModalTeachers([]));
  }, [modalSectionId]);

  useEffect(() => {
    if (!modalTeacher) { setModalEmail(""); return; }
    const existing = allTeachers.find((t) => t.teacher_name === modalTeacher);
    if (existing) {
      setModalEmail(existing.email || "");
    } else {
      const slug = modalTeacher.toLowerCase().replace(/[^a-z0-9]+/g, ".");
      setModalEmail(`${slug}@mnhs.edu.ph`);
    }
  }, [modalTeacher, allTeachers]);

  useEffect(() => {
    if (!modalGrade) { setModalSections([]); return; }
    setModalSections(sections.filter((s) => s.grade === modalGrade));
  }, [modalGrade, sections]);

  useEffect(() => {
    if (showModal) {
      setModalGrade("");
      setModalSectionId("");
      setModalTeacher("");
      setModalEmail("");
      setModalPassword("");
      setModalError("");
    }
  }, [showModal]);

  const filtered = allTeachers.filter((t) => {
    const sectionsMatch = !gradeFilter || (t.sections || []).some((s) => s.grade === gradeFilter);
    const sectionMatch = !sectionFilter || (t.sections || []).some((s) => String(s.grade) === gradeFilter && s.name === sections.find((sec) => String(sec.id) === sectionFilter)?.name);
    const searchMatch = !search ||
      t.teacher_name.toLowerCase().includes(search.toLowerCase()) ||
      t.email.toLowerCase().includes(search.toLowerCase()) ||
      t.account_id.includes(search);
    return sectionsMatch && sectionMatch && searchMatch;
  });

  const handleCreate = async () => {
    if (!modalTeacher || !modalEmail || !modalPassword) {
      setModalError("All fields are required");
      return;
    }
    setModalLoading(true);
    setModalError("");
    try {
      const res = await fetch("/api/ict/teacher-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherName: modalTeacher,
          email: modalEmail,
          password: modalPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchAllTeachers();
      } else {
        setModalError(data.error || "Failed to create account");
      }
    } catch {
      setModalError("Failed to create account");
    }
    setModalLoading(false);
  };

  const getSectionsDisplay = (t: TeacherAccount) => {
    if (!t.sections || t.sections.length === 0) return "—";
    const unique = t.sections.filter(
      (s, i, arr) => arr.findIndex((x) => x.name === s.name && x.grade === s.grade) === i
    );
    return unique.map((s) => `${s.grade} ${s.name}`).join(", ");
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}} />
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Teachers</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage teacher accounts — {allTeachers.length} total
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#8B1010] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#6e0d0d] transition-colors flex items-center gap-2 self-start cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            Add Teacher
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
            placeholder="Search by name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all"
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="w-full sm:w-40">
            <CustomSelect
              label="Grade"
              value={gradeFilter}
              onChange={(v) => { setGradeFilter(v); setSectionFilter(""); }}
              placeholder="All Grades"
              options={uniqueGrades.map((g) => ({ value: g, label: g }))}
            />
          </div>
          <div className="w-full sm:w-44">
            <CustomSelect
              label="Section"
              value={sectionFilter}
              onChange={setSectionFilter}
              placeholder="All Sections"
              options={gradeSections.map((s) => ({ value: String(s.id), label: s.name }))}
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Teacher ID</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Sections</th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-sm text-gray-400">Loading...</td></tr>
              ) : filtered.length > 0 ? filtered.map((account) => (
                <tr key={account.teacher_name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono font-medium text-[#8B1010]">{account.account_id || "—"}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-800">{account.teacher_name}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">{getSectionsDisplay(account)}</td>
                  <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">{account.email || "—"}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span
                      className={`inline-flex text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
                        account.account_id
                          ? "bg-[#1E5631]/10 text-[#1E5631]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {account.account_id ? "Active" : "No Account"}
                    </span>
                  </td>
                </tr>
              )              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                    {allTeachers.length === 0 && !search
                      ? "No teacher accounts yet"
                      : `No teachers found matching \u201c${search}\u201d`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="fixed inset-0 bg-black/50" style={{ animation: "fadeIn 0.2s ease-out" }} onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ animation: "modalIn 0.2s ease-out" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Add New Teacher</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <CustomSelect
                  label="Grade"
                  value={modalGrade}
                  onChange={(v) => { setModalGrade(v); setModalSectionId(""); setModalTeacher(""); }}
                  placeholder="Select grade"
                  options={uniqueGrades.map((g) => ({ value: g, label: g }))}
                />
                <CustomSelect
                  label="Section"
                  value={modalSectionId}
                  onChange={(v) => { setModalSectionId(v); setModalTeacher(""); }}
                  placeholder={modalGrade ? "Select section" : "Select grade first"}
                  options={modalSections.map((s) => ({ value: String(s.id), label: s.name }))}
                />
              </div>

              <CustomSelect
                label="Teacher"
                value={modalTeacher}
                onChange={setModalTeacher}
                placeholder={modalSectionId ? "Select teacher" : "Select section first"}
                options={modalTeachers.map((t) => ({ value: t, label: t }))}
              />

              {modalTeacher && (
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200" style={{ animation: "fadeIn 0.2s ease-out" }}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E5631]/10 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1E5631" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{modalTeacher}</p>
                      <p className="text-xs text-gray-500">Grade {modalGrade} — {modalSections.find((s) => String(s.id) === modalSectionId)?.name}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  value={modalEmail}
                  onChange={(e) => setModalEmail(e.target.value)}
                  placeholder="teacher@mnhs.edu.ph"
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all placeholder:text-gray-400"
                />
              </div>

              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                <input
                  type="password"
                  value={modalPassword}
                  onChange={(e) => setModalPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all placeholder:text-gray-400"
                />
              </div>

              {modalError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs text-red-600">{modalError}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={modalLoading || !modalTeacher || !modalEmail || !modalPassword}
                className="px-4 py-2 text-sm font-medium bg-[#8B1010] text-white rounded-lg hover:bg-[#6e0d0d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {modalLoading ? "Creating..." : "Add Teacher"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
