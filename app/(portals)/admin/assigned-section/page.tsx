"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

interface SectionData {
  id: number;
  name: string;
  adviser: string;
  student_count: number;
  grade: string;
  room_no: string;
}

interface PeriodData {
  id: number;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room_no: string;
}

interface StudentData {
  id: number;
  lrn: string;
  full_name: string;
  gender: string;
}

const GRADES = ["Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "bg-[#8B1010]/10 text-[#8B1010] border-[#8B1010]/20",
  English: "bg-[#1E5631]/10 text-[#1E5631] border-[#1E5631]/20",
  Science: "bg-[#D4A017]/10 text-[#D4A017] border-[#D4A017]/20",
  Filipino: "bg-blue-50 text-blue-700 border-blue-200",
  "Araling Panlipunan": "bg-purple-50 text-purple-700 border-purple-200",
  MAPEH: "bg-orange-50 text-orange-700 border-orange-200",
  TLE: "bg-teal-50 text-teal-700 border-teal-200",
};

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
        className={`w-full flex items-center justify-between px-4 py-3 text-sm border-2 rounded-xl transition-all duration-200 bg-white text-left cursor-pointer ${
          open ? "border-[#8B1010] ring-2 ring-[#8B1010]/10" : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
          {value ? selected?.label : placeholder || "Select option"}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 flex-shrink-0 text-gray-400 ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-40 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-auto">
          {options.map((opt) => (
            <button key={opt.value} type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm transition-all border-b border-gray-50 last:border-b-0 min-h-[44px] flex items-center cursor-pointer ${
                opt.value === value ? "bg-[#8B1010]/5 text-[#8B1010] font-semibold" : "text-gray-700 hover:bg-gray-50"
              }`}
            >{opt.label}</button>
          ))}
        </div>
      )}
    </div>
  );
}

function Modal({ open, onClose, title, children }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 animate-[fadeIn_0.2s_ease-out] cursor-pointer" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md animate-[slideUp_0.3s_ease-out]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-800">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Spinner({ size = 14 }: { size?: number }) {
  return (
    <svg className="animate-spin" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function AssignedSectionPage() {
  const [sections, setSections] = useState<SectionData[]>([]);
  const [selected, setSelected] = useState<SectionData | null>(null);
  const [activeTab, setActiveTab] = useState<"schedule" | "students">("schedule");
  const [periods, setPeriods] = useState<PeriodData[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [search, setSearch] = useState("");
  const [expandedGrades, setExpandedGrades] = useState<string[]>(["Grade 7"]);
  const [loading, setLoading] = useState(true);
  const [loadingPeriods, setLoadingPeriods] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [savingSection, setSavingSection] = useState(false);
  const [deletingSectionId, setDeletingSectionId] = useState<number | null>(null);
  const [savingPeriod, setSavingPeriod] = useState(false);
  const [deletingPeriodId, setDeletingPeriodId] = useState<number | null>(null);
  const [savingStudent, setSavingStudent] = useState(false);
  const [deletingStudentId, setDeletingStudentId] = useState<number | null>(null);
  const [searchingStudent, setSearchingStudent] = useState(false);

  // Section modal
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionData | null>(null);
  const [sectionForm, setSectionForm] = useState({ grade: "Grade 7", name: "", adviser: "", roomNo: "" });

  // Period modal
  const [showPeriodModal, setShowPeriodModal] = useState(false);
  const [editingPeriod, setEditingPeriod] = useState<{ id: number } | null>(null);
  const [periodForm, setPeriodForm] = useState({ day: "Monday", time: "", subject: "", teacher: "", roomNo: "" });

  // Student modal
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<number | null>(null);
  const [studentForm, setStudentForm] = useState({ lrn: "", name: "", gender: "" });
  const [studentTab, setStudentTab] = useState<"online" | "walkin">("online");
  const [studentSearchQuery, setStudentSearchQuery] = useState("");
  const [studentSearchResult, setStudentSearchResult] = useState<{ lrn: string; name: string; gender: string; grade: string; email: string } | null>(null);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const fetchSections = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/sections");
      const data = await res.json();
      if (data.success) setSections(data.sections);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  const fetchPeriods = useCallback(async (sectionId: number) => {
    setLoadingPeriods(true);
    try {
      const res = await fetch(`/api/admin/periods?sectionId=${sectionId}`);
      const data = await res.json();
      if (data.success) setPeriods(data.periods);
    } catch { /* empty */ }
    setLoadingPeriods(false);
  }, []);

  const fetchStudents = useCallback(async (sectionId: number) => {
    setLoadingStudents(true);
    try {
      const res = await fetch(`/api/admin/students?sectionId=${sectionId}`);
      const data = await res.json();
      if (data.success) setStudents(data.students);
    } catch { /* empty */ }
    setLoadingStudents(false);
  }, []);

  useEffect(() => { fetchSections(); }, [fetchSections]);

  useEffect(() => {
    if (selected) {
      fetchPeriods(selected.id);
      fetchStudents(selected.id);
    }
  }, [selected, fetchPeriods, fetchStudents]);

  const grouped = GRADES.reduce((acc, grade) => {
    acc[grade] = sections.filter((s) => s.grade === grade);
    return acc;
  }, {} as Record<string, SectionData[]>);

  const filteredGrades = GRADES.filter((g) => g.toLowerCase().includes(search.toLowerCase()));

  const toggleGrade = (grade: string) => {
    setExpandedGrades((prev) => prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]);
  };

  const buildSchedule = (): Record<string, PeriodData[]> => {
    const schedule: Record<string, PeriodData[]> = {};
    DAYS.forEach((d) => { schedule[d] = []; });
    periods.forEach((p) => {
      if (schedule[p.day]) schedule[p.day].push(p);
    });
    return schedule;
  };

  const schedule = buildSchedule();

  // Section handlers
  const openAddSection = () => {
    setEditingSection(null);
    setSectionForm({ grade: "Grade 7", name: "", adviser: "", roomNo: "" });
    setShowSectionModal(true);
  };

  const openEditSection = (section: SectionData) => {
    setEditingSection(section);
    setSectionForm({ grade: section.grade, name: section.name, adviser: section.adviser, roomNo: section.room_no });
    setShowSectionModal(true);
  };

  const handleSaveSection = async () => {
    if (!sectionForm.name || !sectionForm.adviser) return;
    setSavingSection(true);
    try {
      if (editingSection) {
        await fetch(`/api/admin/sections/${editingSection.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: sectionForm.name, grade: sectionForm.grade, adviser: sectionForm.adviser, roomNo: sectionForm.roomNo }),
        });
      } else {
        await fetch("/api/admin/sections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: sectionForm.name, grade: sectionForm.grade, adviser: sectionForm.adviser, roomNo: sectionForm.roomNo }),
        });
      }
      await fetchSections();
    } catch { /* empty */ }
    setSavingSection(false);
    setShowSectionModal(false);
  };

  const handleDeleteSection = (section: SectionData) => {
    Swal.fire({
      title: "Delete Section?",
      text: `Are you sure you want to delete "${section.grade} - ${section.name}"? This action cannot be undone.`,
      icon: "warning", showCancelButton: true, confirmButtonColor: "#8B1010", cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!", cancelButtonText: "Cancel",
      customClass: { confirmButton: "cursor-pointer", cancelButton: "cursor-pointer" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingSectionId(section.id);
        await fetch(`/api/admin/sections/${section.id}`, { method: "DELETE" });
        await fetchSections();
        if (selected?.id === section.id) { setSelected(null); setPeriods([]); setStudents([]); }
        setDeletingSectionId(null);
        Swal.fire({ title: "Deleted!", text: "Section has been deleted.", icon: "success", confirmButtonColor: "#8B1010", customClass: { confirmButton: "cursor-pointer" } });
      }
    });
  };

  // Period handlers
  const openAddPeriod = () => {
    setEditingPeriod(null);
    setPeriodForm({ day: "Monday", time: "", subject: "", teacher: "", roomNo: "" });
    setShowPeriodModal(true);
  };

  const openEditPeriod = (period: PeriodData) => {
    setEditingPeriod(period);
    setPeriodForm({ day: period.day, time: period.time, subject: period.subject, teacher: period.teacher, roomNo: period.room_no });
    setShowPeriodModal(true);
  };

  const handleSavePeriod = async () => {
    if (!periodForm.time || !periodForm.subject || !selected) return;
    setSavingPeriod(true);
    try {
      if (editingPeriod) {
        await fetch(`/api/admin/periods/${editingPeriod.id}`, {
          method: "DELETE",
        });
      }
      await fetch("/api/admin/periods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId: selected.id, day: periodForm.day, time: periodForm.time, subject: periodForm.subject, teacher: periodForm.teacher, roomNo: periodForm.roomNo }),
      });
      await fetchPeriods(selected.id);
    } catch { /* empty */ }
    setSavingPeriod(false);
    setShowPeriodModal(false);
  };

  const handleDeletePeriod = (period: PeriodData) => {
    Swal.fire({
      title: "Delete Period?", text: "Are you sure you want to remove this period from the schedule?",
      icon: "warning", showCancelButton: true, confirmButtonColor: "#8B1010", cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!", cancelButtonText: "Cancel",
      customClass: { confirmButton: "cursor-pointer", cancelButton: "cursor-pointer" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingPeriodId(period.id);
        await fetch(`/api/admin/periods/${period.id}`, { method: "DELETE" });
        if (selected) await fetchPeriods(selected.id);
        setDeletingPeriodId(null);
        Swal.fire({ title: "Deleted!", text: "Period has been removed.", icon: "success", confirmButtonColor: "#8B1010", customClass: { confirmButton: "cursor-pointer" } });
      }
    });
  };

  // Student handlers
  const openAddStudent = () => {
    setEditingStudent(null);
    setStudentForm({ lrn: "", name: "", gender: "" });
    setStudentTab("online");
    setStudentSearchQuery("");
    setStudentSearchResult(null);
    setSearchAttempted(false);
    setShowStudentModal(true);
  };

  const openEditStudent = (student: StudentData) => {
    setEditingStudent(student.id);
    setStudentForm({ lrn: student.lrn || "", name: student.full_name, gender: student.gender || "" });
    setShowStudentModal(true);
  };

  const handleSearchStudent = async () => {
    if (!studentSearchQuery.trim()) return;
    setSearchAttempted(true);
    setStudentSearchResult(null);
    setSearchingStudent(true);
    try {
      const res = await fetch(`/api/enroll/search?q=${encodeURIComponent(studentSearchQuery)}`);
      const data = await res.json();
      if (data.success) setStudentSearchResult(data.student);
    } catch { /* empty */ }
    setSearchingStudent(false);
  };

  const handleSaveStudent = async () => {
    if (!selected) return;
    setSavingStudent(true);
    try {
      if (editingStudent) {
        await fetch(`/api/admin/students/${editingStudent}`, {
          method: "DELETE",
        });
        await fetch("/api/admin/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionId: selected.id, lrn: studentForm.lrn, fullName: studentForm.name, gender: studentForm.gender }),
        });
      } else if (studentTab === "online" && studentSearchResult) {
        await fetch("/api/admin/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionId: selected.id, lrn: studentSearchResult.lrn, fullName: studentSearchResult.name, gender: studentSearchResult.gender }),
        });
      } else {
        if (!studentForm.name) { setSavingStudent(false); return; }
        await fetch("/api/admin/students", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sectionId: selected.id, lrn: studentForm.lrn, fullName: studentForm.name, gender: studentForm.gender }),
        });
      }
      await fetchStudents(selected.id);
      await fetchSections();
    } catch { /* empty */ }
    setSavingStudent(false);
    setShowStudentModal(false);
  };

  const handleDeleteStudent = (student: StudentData) => {
    Swal.fire({
      title: "Delete Student?", text: `Are you sure you want to remove "${student.full_name}" from this section?`,
      icon: "warning", showCancelButton: true, confirmButtonColor: "#8B1010", cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!", cancelButtonText: "Cancel",
      customClass: { confirmButton: "cursor-pointer", cancelButton: "cursor-pointer" },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeletingStudentId(student.id);
        await fetch(`/api/admin/students/${student.id}`, { method: "DELETE" });
        if (selected) {
          await fetchStudents(selected.id);
          await fetchSections();
        }
        setDeletingStudentId(null);
        Swal.fire({ title: "Deleted!", text: "Student has been removed.", icon: "success", confirmButtonColor: "#8B1010", customClass: { confirmButton: "cursor-pointer" } });
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#8B1010] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading sections...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        .swal2-popup { border-radius: 1rem !important; }
        .swal2-html-container { font-size: 0.875rem !important; }
      `}} />

      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Assigned Sections</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage sections, schedules, and student assignments.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6" style={{ height: "calc(100vh - 200px)" }}>
        {/* Left Sidebar */}
        <div className="w-full lg:w-72 flex-shrink-0 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800">All Sections</h3>
              <button onClick={openAddSection} disabled={savingSection} className="flex items-center gap-1 px-2.5 py-1.5 bg-[#8B1010] text-white text-[11px] font-semibold rounded-lg hover:bg-[#6d0d0d] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {savingSection ? <Spinner size={12} /> : <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>}
                Add
              </button>
            </div>
            <div className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
              </svg>
              <input type="text" placeholder="Search sections..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8B1010]/20 focus:border-[#8B1010]"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {filteredGrades.map((grade) => {
              const isExpanded = expandedGrades.includes(grade);
              const gradeSections = grouped[grade] || [];
              return (
                <div key={grade}>
                  <button onClick={() => toggleGrade(grade)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors sticky top-0 z-10 cursor-pointer"
                  >
                    <p className="text-[11px] font-bold text-gray-600 uppercase tracking-wider">{grade}</p>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isExpanded && gradeSections.map((section) => (
                    <div key={section.id} onClick={() => setSelected(section)}
                      className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors cursor-pointer ${
                        selected?.id === section.id ? "bg-[#8B1010]/5 border-l-2 border-l-[#8B1010]" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`text-sm font-semibold ${selected?.id === section.id ? "text-[#8B1010]" : "text-gray-800"}`}>{section.name}</p>
                          <p className="text-[11px] text-gray-500 mt-0.5">{section.adviser}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-semibold text-gray-400 mr-1">{section.student_count}</span>
                          <button onClick={(e) => { e.stopPropagation(); openEditSection(section); }} disabled={deletingSectionId === section.id} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-[#8B1010] cursor-pointer disabled:opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); handleDeleteSection(section); }} disabled={deletingSectionId === section.id} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-red-500 cursor-pointer disabled:opacity-50">
                            {deletingSectionId === section.id ? <Spinner size={12} /> : <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
          {selected ? (
            <>
              <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-800">{selected.grade} - {selected.name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">Adviser: {selected.adviser} · Room {selected.room_no} · {selected.student_count} students</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEditSection(selected)} disabled={deletingSectionId === selected.id} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#8B1010] transition-colors cursor-pointer disabled:opacity-50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                    </button>
                    <button onClick={() => handleDeleteSection(selected)} disabled={deletingSectionId === selected.id} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50">
                      {deletingSectionId === selected.id ? <Spinner size={16} /> : <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex border-b border-gray-100 flex-shrink-0">
                <button onClick={() => setActiveTab("schedule")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === "schedule" ? "border-[#8B1010] text-[#8B1010]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
                  Period & Schedule
                </button>
                <button onClick={() => setActiveTab("students")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${activeTab === "students" ? "border-[#8B1010] text-[#8B1010]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                  Students
                </button>
              </div>

              <div className="flex-1 overflow-auto p-4 sm:p-6">
                {activeTab === "schedule" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-800">Weekly Schedule</h3>
                      <button onClick={openAddPeriod} disabled={savingPeriod} className="flex items-center gap-1.5 px-3 py-2 bg-[#1E5631] text-white text-xs font-semibold rounded-lg hover:bg-[#164427] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        {savingPeriod ? <Spinner size={14} /> : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>}
                        Add Period
                      </button>
                    </div>
                    {loadingPeriods ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                          <div className="w-7 h-7 border-2 border-[#1E5631] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Loading schedule...</p>
                        </div>
                      </div>
                    ) : (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="grid grid-cols-[100px_repeat(5,1fr)] bg-gray-50 border-b border-gray-200">
                        <div className="px-2 py-2.5 border-r border-gray-200"><p className="text-[10px] font-bold text-gray-400 uppercase">Time</p></div>
                        {DAYS.map((day) => (
                          <div key={day} className="px-2 py-2.5 text-center border-r border-gray-200 last:border-r-0">
                            <p className="text-[10px] font-bold text-gray-600 uppercase">{day.slice(0, 3)}</p>
                          </div>
                        ))}
                      </div>
                      {Array.from(new Set(periods.map((p) => p.time))).sort((a, b) => a.localeCompare(b)).map((time) => (
                        <div key={time} className="grid grid-cols-[100px_repeat(5,1fr)] border-b border-gray-100 last:border-b-0">
                          <div className="px-2 py-2 border-r border-gray-200 flex items-center justify-center">
                            <p className="text-[10px] font-semibold text-gray-500 text-center leading-tight">{time}</p>
                          </div>
                          {DAYS.map((day) => {
                            const slot = schedule[day]?.find((s) => s.time === time);
                            return (
                              <div key={`${day}-${time}`} className="px-1.5 py-1.5 border-r border-gray-100 last:border-r-0 min-h-[72px] flex items-center justify-center group relative">
                                {slot ? (
                                  <div className={`w-full px-1.5 py-1.5 rounded-lg border text-center cursor-pointer ${SUBJECT_COLORS[slot.subject] || "bg-gray-50 text-gray-600 border-gray-200"}`}
                                    onClick={() => openEditPeriod(slot)}
                                  >
                                    <p className="text-[10px] font-bold leading-tight truncate">{slot.subject}</p>
                                    <p className="text-[9px] opacity-70 leading-tight truncate">{slot.teacher}</p>
                                    <p className="text-[9px] opacity-70 leading-tight truncate">Rm {slot.room_no}</p>
                                  </div>
                                ) : (
                                  <button onClick={() => { setPeriodForm({ day, time, subject: "", teacher: "", roomNo: "" }); setEditingPeriod(null); setShowPeriodModal(true); }}
                                    className="w-full h-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                  </button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    )}
                  </div>
                )}

                {activeTab === "students" && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-bold text-gray-800">Student List</h3>
                      <button onClick={openAddStudent} disabled={savingStudent} className="flex items-center gap-1.5 px-3 py-2 bg-[#1E5631] text-white text-xs font-semibold rounded-lg hover:bg-[#164427] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                        {savingStudent ? <Spinner size={14} /> : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>}
                        Add Student
                      </button>
                    </div>
                    {loadingStudents ? (
                      <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                          <div className="w-7 h-7 border-2 border-[#1E5631] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                          <p className="text-xs text-gray-500">Loading students...</p>
                        </div>
                      </div>
                    ) : (
                    <table className="w-full">
                      <thead>
                        <tr className="text-[11px] text-gray-500 uppercase tracking-wider border-b border-gray-100">
                          <th className="text-left px-3 py-2.5 font-medium">LRN</th>
                          <th className="text-left px-3 py-2.5 font-medium">Name</th>
                          <th className="text-left px-3 py-2.5 font-medium">Gender</th>
                          <th className="text-right px-3 py-2.5 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 text-xs font-mono text-gray-600">{student.lrn}</td>
                            <td className="px-3 py-3 text-sm font-semibold text-gray-800">{student.full_name}</td>
                            <td className="px-3 py-3 text-xs text-gray-500">{student.gender}</td>
                            <td className="px-3 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button onClick={() => openEditStudent(student)} disabled={deletingStudentId === student.id} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-[#8B1010] transition-colors cursor-pointer disabled:opacity-50">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                                </button>
                                <button onClick={() => handleDeleteStudent(student)} disabled={deletingStudentId === student.id} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-50">
                                  {deletingStudentId === student.id ? <Spinner size={14} /> : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-gray-300 mb-3">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <p className="text-sm font-medium text-gray-500">Select a section to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section Modal */}
      <Modal open={showSectionModal} onClose={() => setShowSectionModal(false)} title={editingSection ? "Edit Section" : "Add Section"}>
        <div className="p-6 space-y-4">
          <CustomSelect label="Grade Level" value={sectionForm.grade} onChange={(v) => setSectionForm({ ...sectionForm, grade: v })} options={GRADES.map((g) => ({ value: g, label: g }))} />
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Section Name</label>
            <input type="text" value={sectionForm.name} onChange={(e) => setSectionForm({ ...sectionForm, name: e.target.value })} placeholder="e.g. Diamond"
              className="w-full px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
          </div>
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Adviser</label>
            <input type="text" value={sectionForm.adviser} onChange={(e) => setSectionForm({ ...sectionForm, adviser: e.target.value })} placeholder="e.g. Ms. Cruz"
              className="w-full px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
          </div>
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Room No.</label>
            <input type="text" value={sectionForm.roomNo} onChange={(e) => setSectionForm({ ...sectionForm, roomNo: e.target.value })} placeholder="e.g. 101"
              className="w-full px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={() => setShowSectionModal(false)} disabled={savingSection} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50">Cancel</button>
          <button onClick={handleSaveSection} disabled={savingSection} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#8B1010] rounded-lg hover:bg-[#6d0d0d] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {savingSection && <Spinner size={14} />}
            {editingSection ? "Save Changes" : "Add Section"}
          </button>
        </div>
      </Modal>

      {/* Period Modal */}
      <Modal open={showPeriodModal} onClose={() => setShowPeriodModal(false)} title={editingPeriod ? "Edit Period" : "Add Period"}>
        <div className="p-6 space-y-4">
          <CustomSelect label="Day" value={periodForm.day} onChange={(v) => setPeriodForm({ ...periodForm, day: v })} options={DAYS.map((d) => ({ value: d, label: d }))} />
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Time</label>
            <input type="text" value={periodForm.time} onChange={(e) => setPeriodForm({ ...periodForm, time: e.target.value })} placeholder="e.g. 7:30 AM - 8:30 AM"
              className="w-full px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
          </div>
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Subject</label>
            <input type="text" value={periodForm.subject} onChange={(e) => setPeriodForm({ ...periodForm, subject: e.target.value })} placeholder="e.g. Mathematics"
              className="w-full px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
          </div>
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Assigned Teacher</label>
            <input type="text" value={periodForm.teacher} onChange={(e) => setPeriodForm({ ...periodForm, teacher: e.target.value })} placeholder="e.g. Ms. Cruz"
              className="w-full px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
          </div>
          <div>
            <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Room No.</label>
            <input type="text" value={periodForm.roomNo} onChange={(e) => setPeriodForm({ ...periodForm, roomNo: e.target.value })} placeholder="e.g. 101"
              className="w-full px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={() => setShowPeriodModal(false)} disabled={savingPeriod} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50">Cancel</button>
          <button onClick={handleSavePeriod} disabled={savingPeriod} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#8B1010] rounded-lg hover:bg-[#6d0d0d] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {savingPeriod && <Spinner size={14} />}
            {editingPeriod ? "Save Changes" : "Add Period"}
          </button>
        </div>
      </Modal>

      {/* Student Modal */}
      <Modal open={showStudentModal} onClose={() => setShowStudentModal(false)} title={editingStudent ? "Edit Student" : "Add Student"}>
        {!editingStudent ? (
          <>
            <div className="flex border-b border-gray-100">
              <button onClick={() => setStudentTab("online")} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${studentTab === "online" ? "border-[#8B1010] text-[#8B1010]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" /><path d="M8.5 8.5v.01" /><path d="M16 15.5v.01" /><path d="M12 12v.01" /><path d="M11 17v.01" /><path d="M7 14v.01" /></svg>
                Online
              </button>
              <button onClick={() => setStudentTab("walkin")} className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer ${studentTab === "walkin" ? "border-[#8B1010] text-[#8B1010]" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                Walk-in
              </button>
            </div>

            {studentTab === "online" && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Reference No. or LRN</label>
                  <div className="flex gap-2">
                    <input type="text" value={studentSearchQuery} onChange={(e) => setStudentSearchQuery(e.target.value)} placeholder="Enter reference number or LRN"
                      className="flex-1 px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
                    <button onClick={handleSearchStudent} disabled={searchingStudent} className="px-4 py-3 bg-[#8B1010] text-white rounded-xl hover:bg-[#6d0d0d] transition-colors cursor-pointer disabled:opacity-50">
                      {searchingStudent ? <Spinner size={18} /> : <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>}
                    </button>
                  </div>
                </div>
                {searchingStudent && (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="w-6 h-6 border-2 border-[#8B1010] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs text-gray-500">Searching student...</p>
                    </div>
                  </div>
                )}
                {!searchingStudent && studentSearchResult && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[#1E5631] flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <p className="text-xs font-semibold text-[#1E5631]">Student Found</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><p className="text-[10px] text-gray-400 uppercase">Name</p><p className="text-sm font-semibold text-gray-800">{studentSearchResult.name}</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase">LRN</p><p className="text-sm font-semibold text-gray-800">{studentSearchResult.lrn}</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase">Grade Level</p><p className="text-sm font-semibold text-gray-800">{studentSearchResult.grade}</p></div>
                      <div><p className="text-[10px] text-gray-400 uppercase">Gender</p><p className="text-sm font-semibold text-gray-800">{studentSearchResult.gender}</p></div>
                    </div>
                  </div>
                )}
                {!searchingStudent && studentSearchQuery && !studentSearchResult && searchAttempted && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                    <p className="text-sm text-red-600 font-medium">No student found with that reference or LRN.</p>
                  </div>
                )}
              </div>
            )}

            {studentTab === "walkin" && (
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">LRN</label>
                  <input type="text" value={studentForm.lrn} onChange={(e) => setStudentForm({ ...studentForm, lrn: e.target.value })} placeholder="12-digit LRN"
                    className="w-full px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
                  <input type="text" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} placeholder="Last Name, First Name"
                    className="w-full px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
                </div>
                <CustomSelect label="Gender" value={studentForm.gender} onChange={(v) => setStudentForm({ ...studentForm, gender: v })} placeholder="Select gender"
                  options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} />
              </div>
            )}
          </>
        ) : (
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">LRN</label>
              <input type="text" value={studentForm.lrn} onChange={(e) => setStudentForm({ ...studentForm, lrn: e.target.value })} placeholder="12-digit LRN"
                className="w-full px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
            </div>
            <div>
              <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
              <input type="text" value={studentForm.name} onChange={(e) => setStudentForm({ ...studentForm, name: e.target.value })} placeholder="Last Name, First Name"
                className="w-full px-4 py-3 text-sm border-2 rounded-xl transition-all border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300" />
            </div>
            <CustomSelect label="Gender" value={studentForm.gender} onChange={(v) => setStudentForm({ ...studentForm, gender: v })} placeholder="Select gender"
              options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} />
          </div>
        )}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={() => setShowStudentModal(false)} disabled={savingStudent} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50">Cancel</button>
          <button onClick={handleSaveStudent} disabled={savingStudent} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#8B1010] rounded-lg hover:bg-[#6d0d0d] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
            {savingStudent ? (
              <>
                <Spinner size={14} />
                {editingStudent ? "Saving..." : "Adding..."}
              </>
            ) : (
              editingStudent ? "Save Changes" : "Add Student"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
}
