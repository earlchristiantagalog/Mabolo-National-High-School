"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

interface SectionData {
  id: number;
  name: string;
  grade: string;
}

interface StudentData {
  id: number;
  lrn: string | null;
  full_name: string;
  gender: string | null;
  section_id: number;
  section_name: string;
  grade: string;
  last_name: string | null;
  first_name: string | null;
  middle_name: string | null;
  email: string | null;
  student_id: string | null;
  account_email: string | null;
}

function CustomSelect({ label, value, onChange, options, placeholder, disabled }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder?: string; disabled?: boolean;
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
      <button type="button" onClick={() => !disabled && setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm border-2 rounded-xl transition-all duration-200 bg-white text-left cursor-pointer ${
          disabled ? "border-gray-100 bg-gray-50 opacity-60" : "border-gray-200 hover:border-gray-200"
        }`}
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
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400 text-center">No options available</div>
          ) : options.map((opt) => (
            <button key={opt.value} type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-all border-b border-gray-50 last:border-b-0 min-h-[40px] flex items-center cursor-pointer ${
                opt.value === value ? "bg-[#8B1010]/5 text-[#8B1010] font-semibold" : "text-gray-700 hover:bg-gray-50"
              }`}
            >{opt.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

const GRADES = ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

export default function ICTStudents() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [allStudents, setAllStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  // Add Account modal
  const [showModal, setShowModal] = useState(false);
  const [modalGrade, setModalGrade] = useState("");
  const [modalSectionId, setModalSectionId] = useState("");
  const [modalStudentId, setModalStudentId] = useState("");
  const [modalStudents, setModalStudents] = useState<StudentData[]>([]);
  const [modalEmail, setModalEmail] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loadingModalStudents, setLoadingModalStudents] = useState(false);

  const filteredSections = gradeFilter
    ? sections.filter((s) => s.grade === gradeFilter)
    : sections;

  const modalFilteredSections = modalGrade
    ? sections.filter((s) => s.grade === modalGrade)
    : sections;

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sections");
      const data = await res.json();
      if (data.success) setSections(data.sections);
    } catch { /* empty */ }
  }, []);

  const fetchAllStudents = useCallback(async () => {
    setLoading(true);
    try {
      const allStudentsList: StudentData[] = [];
      for (const section of sections) {
        const res = await fetch(`/api/ict/student-accounts?sectionId=${section.id}`);
        const data = await res.json();
        if (data.success) allStudentsList.push(...data.students);
      }
      setAllStudents(allStudentsList);
    } catch { /* empty */ }
    setLoading(false);
  }, [sections]);

  useEffect(() => { fetchSections(); }, [fetchSections]);
  useEffect(() => { if (sections.length > 0) fetchAllStudents(); }, [sections, fetchAllStudents]);

  // Fetch students for modal section
  useEffect(() => {
    if (!modalSectionId) { setModalStudents([]); return; }
    setLoadingModalStudents(true);
    fetch(`/api/admin/students?sectionId=${modalSectionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          // Filter out students who already have accounts
          const accountStudentIds = new Set(allStudents.map((s) => s.id));
          setModalStudents(data.students.filter((s: StudentData) => !accountStudentIds.has(s.id)));
        } else setModalStudents([]);
      })
      .catch(() => setModalStudents([]))
      .finally(() => setLoadingModalStudents(false));
  }, [modalSectionId, allStudents]);

  // Auto-fill email when student is selected
  useEffect(() => {
    if (!modalStudentId) { setModalEmail(""); return; }
    const student = modalStudents.find((s) => s.id === parseInt(modalStudentId));
    if (student) {
      // Fetch enrollment email
      fetch(`/api/ict/student-accounts?sectionId=${modalSectionId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            const match = data.students.find((s: StudentData) => s.id === student.id);
            setModalEmail(match?.email || "");
          }
        })
        .catch(() => setModalEmail(""));
    }
  }, [modalStudentId, modalStudents, modalSectionId]);

  const formatName = (s: StudentData) => {
    const last = (s.last_name || "").toUpperCase();
    const first = (s.first_name || "").toUpperCase();
    const mi = s.middle_name ? ` ${s.middle_name.charAt(0).toUpperCase()}.` : "";
    if (last || first) return `${last}, ${first}${mi}`;
    return s.full_name;
  };

  const filtered = allStudents.filter((s) =>
    (!gradeFilter || s.grade === gradeFilter) &&
    (!sectionFilter || String(s.section_id) === sectionFilter) &&
    (!search || formatName(s).toLowerCase().includes(search.toLowerCase()) ||
    (s.lrn && s.lrn.includes(search)) ||
    (s.student_id && s.student_id.includes(search)))
  );

  const handleOpenModal = () => {
    setModalGrade("");
    setModalSectionId("");
    setModalStudentId("");
    setModalStudents([]);
    setModalEmail("");
    setModalPassword("");
    setEmailError("");
    setPasswordError("");
    setShowModal(true);
  };

  const validateEmail = (val: string) => {
    if (!val) { setEmailError("Email is required"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setEmailError("Invalid email format"); return false; }
    setEmailError("");
    return true;
  };

  const validatePassword = (val: string) => {
    if (!val) { setPasswordError("Password is required"); return false; }
    if (val.length < 6) { setPasswordError("Must be at least 6 characters"); return false; }
    setPasswordError("");
    return true;
  };

  const handleCreateAccount = async () => {
    if (!modalStudentId || !modalEmail || !modalPassword) return;
    const emailValid = validateEmail(modalEmail);
    const passwordValid = validatePassword(modalPassword);
    if (!emailValid || !passwordValid) return;

    setSaving(true);
    try {
      const res = await fetch("/api/ict/student-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: parseInt(modalStudentId), email: modalEmail, password: modalPassword }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchAllStudents();
        setShowModal(false);
        Swal.fire({
          title: "Account Created!",
          html: `<p>Student ID: <strong style="color:#8B1010;">${data.accountId}</strong></p><p style="margin-top:4px;font-size:13px;color:#666;">Confirmation email sent to <strong>${modalEmail}</strong></p>`,
          icon: "success", confirmButtonColor: "#8B1010",
          customClass: { confirmButton: "cursor-pointer" },
        });
      } else {
        Swal.fire({
          title: "Error", text: data.error || "Failed to create account.",
          icon: "error", confirmButtonColor: "#8B1010",
          customClass: { confirmButton: "cursor-pointer" },
        });
      }
    } catch {
      Swal.fire({
        title: "Error", text: "Failed to create account.",
        icon: "error", confirmButtonColor: "#8B1010",
        customClass: { confirmButton: "cursor-pointer" },
      });
    }
    setSaving(false);
  };

  const selectedModalStudent = modalStudents.find((s) => s.id === parseInt(modalStudentId));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes modalIn { from { opacity: 0; transform: scale(0.95) translateY(10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
      `}} />
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Students</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage student accounts — {allStudents.length} total
            </p>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-[#8B1010] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#6e0d0d] transition-colors flex items-center gap-2 self-start cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            Add Student
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
            placeholder="Search by name, LRN, or Student ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <CustomSelect
            label="Grade"
            value={gradeFilter}
            onChange={(v) => { setGradeFilter(v); setSectionFilter(""); }}
            placeholder="All"
            options={GRADES.map((g) => ({ value: g, label: g }))}
          />
          <CustomSelect
            label="Section"
            value={sectionFilter}
            onChange={setSectionFilter}
            placeholder={gradeFilter ? "All sections" : "Select grade first"}
            options={filteredSections.map((s) => ({ value: String(s.id), label: s.name }))}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-7 h-7 border-2 border-[#8B1010] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-gray-500">Loading students...</p>
              </div>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</th>
                  <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">LRN</th>
                  <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Section</th>
                  <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono font-medium text-[#8B1010]">
                      {student.student_id || "—"}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-800">{formatName(student)}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono text-gray-600">{student.lrn || "—"}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">{student.grade} {student.section_name}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span className={`inline-flex text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
                        student.student_id
                          ? "bg-[#1E5631]/10 text-[#1E5631]"
                          : "bg-gray-100 text-gray-500"
                      }`}>
                        {student.student_id ? "Active" : "No Account"}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      {student.student_id ? (
                        <span className="text-[11px] sm:text-xs text-gray-400">{student.account_email}</span>
                      ) : (
                        <span className="text-[11px] sm:text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                      {search ? "No students found" : "No student accounts yet"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="fixed inset-0 bg-black/50" style={{ animation: "fadeIn 0.2s ease-out" }} onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ animation: "modalIn 0.2s ease-out" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Add Student Account</h2>
              <button onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
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
                  onChange={(v) => { setModalGrade(v); setModalSectionId(""); setModalStudentId(""); setModalEmail(""); }}
                  placeholder="Select grade"
                  options={GRADES.map((g) => ({ value: g, label: g }))}
                />
                <CustomSelect
                  label="Section"
                  value={modalSectionId}
                  onChange={(v) => { setModalSectionId(v); setModalStudentId(""); setModalEmail(""); }}
                  placeholder={modalGrade ? "Select section" : "Select grade first"}
                  disabled={!modalGrade}
                  options={modalFilteredSections.map((s) => ({ value: String(s.id), label: s.name }))}
                />
              </div>
              <CustomSelect
                label="Student"
                value={modalStudentId}
                onChange={(v) => setModalStudentId(v)}
                placeholder={!modalSectionId ? "Select section first" : loadingModalStudents ? "Loading..." : "Select student"}
                disabled={!modalSectionId || loadingModalStudents}
                options={modalStudents.map((s) => ({ value: String(s.id), label: formatName(s) }))}
              />
              {selectedModalStudent && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                  {selectedModalStudent.lrn && (
                    <div><span className="text-gray-400">LRN: </span><span className="font-mono font-semibold text-gray-700">{selectedModalStudent.lrn}</span></div>
                  )}
                  {selectedModalStudent.gender && (
                    <div><span className="text-gray-400">Gender: </span><span className="font-semibold text-gray-700">{selectedModalStudent.gender}</span></div>
                  )}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email</label>
                <input type="email" value={modalEmail} onChange={(e) => { setModalEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
                  onBlur={() => validateEmail(modalEmail)}
                  placeholder="Auto-filled from enrollment"
                  className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none transition-all ${emailError ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10"}`} />
                {emailError && <p className="text-[11px] text-red-500 mt-1">{emailError}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Password</label>
                <input type="password" value={modalPassword} onChange={(e) => { setModalPassword(e.target.value); if (passwordError) validatePassword(e.target.value); }}
                  onBlur={() => validatePassword(modalPassword)}
                  placeholder="Minimum 6 characters"
                  className={`w-full px-3 py-2 border-2 rounded-xl text-sm focus:outline-none transition-all ${passwordError ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10"}`} />
                {passwordError && <p className="text-[11px] text-red-500 mt-1">{passwordError}</p>}
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} disabled={saving}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleCreateAccount} disabled={saving || !modalStudentId || !modalEmail || !modalPassword}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#8B1010] text-white rounded-lg hover:bg-[#6e0d0d] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {saving && (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {saving ? "Adding..." : "Add Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
