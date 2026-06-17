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

function CustomSelect({ label, value, onChange, options, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; placeholder?: string;
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
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-2.5 text-sm border-2 rounded-xl transition-all duration-200 bg-white text-left border-gray-200 hover:border-gray-200 cursor-pointer"
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
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [gradeFilter, setGradeFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const filteredSections = gradeFilter
    ? sections.filter((s) => s.grade === gradeFilter)
    : sections;

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sections");
      const data = await res.json();
      if (data.success) setSections(data.sections);
    } catch { /* empty */ }
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      if (sectionFilter) {
        const res = await fetch(`/api/ict/student-accounts?sectionId=${sectionFilter}`);
        const data = await res.json();
        if (data.success) setStudents(data.students);
        else setStudents([]);
      } else {
        setStudents([]);
      }
    } catch { /* empty */ }
    setLoading(false);
  }, [sectionFilter]);

  useEffect(() => { fetchSections(); }, [fetchSections]);
  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const formatName = (s: StudentData) => {
    const last = (s.last_name || "").toUpperCase();
    const first = (s.first_name || "").toUpperCase();
    const mi = s.middle_name ? ` ${s.middle_name.charAt(0).toUpperCase()}.` : "";
    if (last || first) return `${last}, ${first}${mi}`;
    return s.full_name;
  };

  const handleOpenModal = (student: StudentData) => {
    setSelectedStudent(student);
    setEmail(student.email || "");
    setPassword("");
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
    if (!selectedStudent) return;
    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    if (!emailValid || !passwordValid) return;

    setSaving(true);
    try {
      const res = await fetch("/api/ict/student-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent.id, email, password }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchStudents();
        Swal.fire({
          title: "Account Created!",
          html: `<p>Account for <strong>${formatName(selectedStudent)}</strong> has been created.</p><p style="margin-top:8px;font-size:13px;color:#666;">Student ID: <strong style="color:#8B1010;">${data.accountId}</strong></p><p style="font-size:13px;color:#666;">A confirmation email has been sent to <strong>${email}</strong>.</p>`,
          icon: "success", confirmButtonColor: "#8B1010",
          customClass: { confirmButton: "cursor-pointer" },
        });
        setShowModal(false);
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}} />
      <div className="mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Student Accounts</h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Select a grade and section to manage student accounts.</p>
        </div>
      </div>

      {/* Grade + Section Filter */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-3">
          <CustomSelect
            label="Grade"
            value={gradeFilter}
            onChange={(v) => { setGradeFilter(v); setSectionFilter(""); }}
            placeholder="All Grades"
            options={GRADES.map((g) => ({ value: g, label: g }))}
          />
          <CustomSelect
            label="Section"
            value={sectionFilter}
            onChange={setSectionFilter}
            placeholder="Select section"
            options={filteredSections.map((s) => ({ value: String(s.id), label: `${s.grade} - ${s.name}` }))}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {!sectionFilter ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-3">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <p className="text-sm font-medium text-gray-500">Select a grade and section to view students</p>
              </div>
            </div>
          ) : loading ? (
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
                  <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">LRN</th>
                  <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Gender</th>
                  <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Account</th>
                  <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-800">{formatName(student)}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono text-gray-600">{student.lrn || "—"}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">{student.gender || "—"}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      {student.student_id ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold text-[#1E5631] bg-[#1E5631]/10 px-2 py-0.5 rounded-full w-fit">
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                            Has Account
                          </span>
                          <span className="text-[10px] sm:text-xs font-mono text-gray-500">ID: {student.student_id}</span>
                        </div>
                      ) : (
                        <span className="inline-flex text-[10px] sm:text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                          No Account
                        </span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      {student.student_id ? (
                        <span className="text-[11px] sm:text-xs text-gray-400">{student.account_email}</span>
                      ) : (
                        <button onClick={() => handleOpenModal(student)}
                          className="text-[11px] sm:text-xs font-medium text-[#8B1010] hover:underline cursor-pointer">
                          Add Account
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                      No students in this section
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Create Account Modal */}
      {showModal && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 animate-[fadeIn_0.2s_ease-out] cursor-pointer" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-[slideUp_0.3s_ease-out]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h3 className="text-base font-bold text-gray-800">Create Account</h3>
                <p className="text-xs text-gray-500 mt-0.5">{formatName(selectedStudent)}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Section Assignment</p>
                <p className="text-sm font-semibold text-gray-800">{selectedStudent.grade} — {selectedStudent.section_name}</p>
              </div>
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
                  onBlur={() => validateEmail(email)}
                  placeholder="student@mnhs.edu.ph"
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl transition-all ${emailError ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300"}`} />
                {emailError && <p className="text-[11px] text-red-500 mt-1">{emailError}</p>}
              </div>
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                <input type="password" value={password} onChange={(e) => { setPassword(e.target.value); if (passwordError) validatePassword(e.target.value); }}
                  onBlur={() => validatePassword(password)}
                  placeholder="Minimum 6 characters"
                  className={`w-full px-4 py-3 text-sm border-2 rounded-xl transition-all ${passwordError ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100" : "border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300"}`} />
                {passwordError && <p className="text-[11px] text-red-500 mt-1">{passwordError}</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={() => setShowModal(false)} disabled={saving}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50">
                Cancel
              </button>
              <button onClick={handleCreateAccount} disabled={saving || !email || !password}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#8B1010] rounded-lg hover:bg-[#6d0d0d] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {saving && (
                  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                )}
                {saving ? "Creating..." : "Create Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
