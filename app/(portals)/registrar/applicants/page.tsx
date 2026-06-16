"use client";

import { useState, useEffect, Fragment } from "react";

const REQUIREMENTS: Record<string, { item: string; required: boolean }[]> = {
  new: [
    { item: "PSA Birth Certificate", required: true },
    { item: "Form 138 (Report Card)", required: true },
    { item: "Good Moral Certificate", required: true },
    { item: "2x2 ID Picture (2 copies)", required: true },
  ],
  old: [
    { item: "Form 138 (Report Card)", required: true },
    { item: "Good Moral Certificate", required: true },
    { item: "2x2 ID Picture (1 copy)", required: true },
  ],
  transferee: [
    { item: "PSA Birth Certificate", required: true },
    { item: "Form 137 (Permanent Record)", required: true },
    { item: "Good Moral Certificate", required: true },
    { item: "2x2 ID Picture (2 copies)", required: true },
  ],
  "balik-aral": [
    { item: "PSA Birth Certificate", required: true },
    { item: "Good Moral Certificate", required: true },
    { item: "2x2 ID Picture (2 copies)", required: true },
    { item: "Certificate of Attendance / Enrollment", required: false },
  ],
};

interface Enrollment {
  id: number;
  reference_number: string;
  school_year: string;
  enrollment_type: string;
  grade_level: string;
  strand: string | null;
  tvl_specialization: string | null;
  lrn: string | null;
  psa_birth_cert: string | null;
  last_name: string;
  first_name: string;
  middle_name: string | null;
  extension_name: string | null;
  email: string | null;
  birthdate: string;
  place_of_birth_city: string;
  place_of_birth_province: string | null;
  mother_tongue: string | null;
  sex: string;
  with_lrn: string;
  returning_learner: string;
  ip_community: string;
  ip_specify: string | null;
  four_ps_beneficiary: string;
  four_ps_household_id: string | null;
  disability: string;
  disability_type: string | null;
  current_address: string | null;
  current_city: string | null;
  current_province: string | null;
  current_barangay: string | null;
  current_zip_code: string | null;
  current_country: string | null;
  same_address: string;
  permanent_address: string | null;
  permanent_city: string | null;
  permanent_province: string | null;
  permanent_barangay: string | null;
  permanent_zip_code: string | null;
  permanent_country: string | null;
  father_name: string | null;
  father_contact: string | null;
  mother_maiden_name: string | null;
  mother_contact: string | null;
  guardian_name: string | null;
  guardian_contact: string | null;
  status: string;
  checked_requirements: Record<string, boolean> | string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_OPTIONS = ["All", "Pending", "Reviewing", "Enrolled", "Rejected"];
const GRADE_OPTIONS = ["All", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const TYPE_OPTIONS = ["All", "New Student", "Old Student", "Transferee", "Balik-Aral"];

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Pending: "bg-yellow-100 text-yellow-700",
    Reviewing: "bg-blue-100 text-blue-700",
    Enrolled: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full ${colors[status] || "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusOpen, setStatusOpen] = useState(false);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Enrollment | null>(null);
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

  const fetchApplicants = async () => {
    try {
      const res = await fetch("/api/enroll/list");
      const data = await res.json();
      if (data.success) {
        setApplicants(data.applicants);
      }
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
    const interval = setInterval(fetchApplicants, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleView = (applicant: Enrollment) => {
    setSelectedApplicant(applicant);
    const cr = applicant.checked_requirements;
    const saved = cr ? (typeof cr === "string" ? JSON.parse(cr) : cr) : {};
    setCheckedRequirements(saved);
    setModalOpen(true);
  };

  const saveRequirements = async (newChecked: Record<string, boolean>, applicant: Enrollment) => {
    const reqs = (REQUIREMENTS[applicant.enrollment_type] || []).filter((r) => !r.item.includes("2x2"));
    const requiredItems = reqs.filter((r) => r.required);
    const allRequiredChecked = requiredItems.every((r) => newChecked[r.item]);
    const newStatus = allRequiredChecked ? "Enrolled" : "Reviewing";

    setSaving(true);
    try {
      await fetch("/api/enroll/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceNumber: applicant.reference_number,
          checkedRequirements: newChecked,
          status: newStatus,
        }),
      });
      setApplicants((prev) =>
        prev.map((a) =>
          a.reference_number === applicant.reference_number
            ? { ...a, checked_requirements: newChecked as unknown as string, status: newStatus }
            : a
        )
      );
      setSelectedApplicant((prev) =>
        prev && prev.reference_number === applicant.reference_number
          ? { ...prev, checked_requirements: newChecked as unknown as string, status: newStatus }
          : prev
      );
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleRequirement = (key: string) => {
    if (!selectedApplicant) return;
    const newChecked = { ...checkedRequirements, [key]: !checkedRequirements[key] };
    setCheckedRequirements(newChecked);
    saveRequirements(newChecked, selectedApplicant);
  };

  const getGradeLabel = (level: string) => {
    const labels: Record<string, string> = {
      "7": "Grade 7", "8": "Grade 8", "9": "Grade 9", "10": "Grade 10",
      "11": "Grade 11 (SHS)", "12": "Grade 12 (SHS)",
    };
    return labels[level] || `Grade ${level}`;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      new: "New Student", old: "Old Student", transferee: "Transferee", "balik-aral": "Balik-Aral",
    };
    return labels[type] || type;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  };

  const filtered = applicants.filter((a) => {
    const fullName = `${a.first_name} ${a.last_name}`.toLowerCase();
    const matchesSearch = fullName.includes(search.toLowerCase()) || a.reference_number.includes(search);
    const matchesGrade = gradeFilter === "All" || getGradeLabel(a.grade_level) === gradeFilter;
    const matchesType = typeFilter === "All" || getTypeLabel(a.enrollment_type) === typeFilter;
    return matchesSearch && matchesGrade && matchesType;
  });

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
          className={`w-full flex items-center justify-between px-3 py-2.5 border-2 rounded-xl text-sm transition-all bg-white cursor-pointer ${
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

  const requirements = selectedApplicant
    ? (REQUIREMENTS[selectedApplicant.enrollment_type] || []).filter((r) => !r.item.includes("2x2"))
    : [];

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Applicants</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage enrollment applications — {applicants.length} total
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <div className="relative mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="8" /><line x1="21" x2="16.65" y1="21" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or reference number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all"
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <CustomDropdown label="Type" value={typeFilter} onChange={setTypeFilter} options={TYPE_OPTIONS} open={typeOpen} setOpen={setTypeOpen} />
          <CustomDropdown label="Grade Level" value={gradeFilter} onChange={setGradeFilter} options={GRADE_OPTIONS} open={gradeOpen} setOpen={setGradeOpen} />
          <CustomDropdown label="Status" value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} open={statusOpen} setOpen={setStatusOpen} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        {loading ? (
          <div className="px-4 py-12 text-center text-sm text-gray-400">Loading applicants...</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Ref No.</th>
                <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Grade</th>
                <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-right px-4 py-3 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((a) => (
                <Fragment key={a.id}>
                  <tr className={`hover:bg-gray-50/50 transition-colors ${expandedRow === a.id ? "bg-gray-50/50" : ""}`}>
                    <td className="px-4 py-3 text-xs sm:text-sm font-mono text-gray-500">{a.reference_number}</td>
                    <td className="px-4 py-3 text-xs sm:text-sm font-medium text-gray-700">{a.first_name} {a.middle_name ? a.middle_name + " " : ""}{a.last_name}{a.extension_name ? ", " + a.extension_name : ""}</td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 hidden sm:table-cell">{getGradeLabel(a.grade_level)}</td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-gray-600 hidden md:table-cell">{getTypeLabel(a.enrollment_type)}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status || "Pending"} /></td>
                    <td className="px-4 py-3 text-xs sm:text-sm text-gray-500 hidden md:table-cell">{formatDate(a.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setExpandedRow(expandedRow === a.id ? null : a.id)}
                        className="text-[11px] sm:text-xs font-medium text-[#8B1010] hover:underline cursor-pointer mr-3"
                      >
                        {expandedRow === a.id ? "Hide" : "Info"}
                      </button>
                      <button onClick={() => handleView(a)} className="text-[11px] sm:text-xs font-medium text-[#8B1010] hover:underline cursor-pointer">View</button>
                    </td>
                  </tr>
                  {expandedRow === a.id && (
                    <tr key={`${a.id}-expanded`}>
                      <td colSpan={7} className="px-4 py-4 bg-gray-50 border-b border-gray-200">
                        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div><span className="text-gray-500 text-xs">Email</span><p className="font-medium text-gray-900">{a.email || "—"}</p></div>
                          <div><span className="text-gray-500 text-xs">Birthdate</span><p className="font-medium text-gray-900">{a.birthdate ? formatDate(a.birthdate) : "—"}</p></div>
                          <div><span className="text-gray-500 text-xs">Sex</span><p className="font-medium text-gray-900 uppercase">{a.sex || "—"}</p></div>
                          <div><span className="text-gray-500 text-xs">Place of Birth</span><p className="font-medium text-gray-900 uppercase">{a.place_of_birth_city || "—"}</p></div>
                          <div><span className="text-gray-500 text-xs">Mother Tongue</span><p className="font-medium text-gray-900 uppercase">{a.mother_tongue || "—"}</p></div>
                          <div><span className="text-gray-500 text-xs">LRN</span><p className="font-medium text-gray-900 uppercase">{a.lrn || "—"}</p></div>
                          <div className="sm:col-span-2 md:col-span-3"><span className="text-gray-500 text-xs">Current Address</span><p className="font-medium text-gray-900 uppercase">{[a.current_address, a.current_barangay, a.current_city, a.current_province, a.current_zip_code].filter(Boolean).join(", ") || "—"}</p></div>
                          <div><span className="text-gray-500 text-xs">Father&apos;s Name</span><p className="font-medium text-gray-900 uppercase">{a.father_name || "—"}</p></div>
                          <div><span className="text-gray-500 text-xs">Father&apos;s Contact</span><p className="font-medium text-gray-900">{a.father_contact || "—"}</p></div>
                          <div><span className="text-gray-500 text-xs">Mother&apos;s Maiden Name</span><p className="font-medium text-gray-900 uppercase">{a.mother_maiden_name || "—"}</p></div>
                          <div><span className="text-gray-500 text-xs">Mother&apos;s Contact</span><p className="font-medium text-gray-900">{a.mother_contact || "—"}</p></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-400">No applicants found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && selectedApplicant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#8B1010] text-white px-6 py-4 rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Requirements Checklist</h3>
                <p className="text-xs text-gray-200">Ref No. {selectedApplicant.reference_number} — {selectedApplicant.first_name} {selectedApplicant.last_name}</p>
              </div>
              <div className="flex items-center gap-3">
                {saving && <span className="text-xs text-gray-200">Saving...</span>}
                <StatusBadge status={selectedApplicant.status || "Pending"} />
                <button onClick={() => { setModalOpen(false); setSelectedApplicant(null); }} className="text-white/80 hover:text-white cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-2">
                {requirements.map((req, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={checkedRequirements[req.item] || false}
                      onChange={() => toggleRequirement(req.item)}
                      className="w-4 h-4 rounded border-gray-300 text-[#8B1010] focus:ring-[#8B1010] cursor-pointer"
                    />
                    <span className="text-sm text-gray-700 flex-1">{req.item}</span>
                    {req.required && <span className="text-[10px] font-bold text-[#8B1010] bg-[#8B1010]/10 px-2 py-0.5 rounded-full">Required</span>}
                    {!req.required && <span className="text-[10px] font-medium text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">Optional</span>}
                  </label>
                ))}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button onClick={() => { setModalOpen(false); setSelectedApplicant(null); }} className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: fadeIn 0.2s ease-out forwards;
        }
      `}</style>
    </>
  );
}
