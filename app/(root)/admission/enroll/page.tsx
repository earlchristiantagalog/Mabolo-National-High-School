"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

// Calculate Second Monday of May for School Year
function getSecondMondayOfMay(): string {
  const now = new Date();
  const year = now.getFullYear();
  let may1 = new Date(year, 4, 1);
  let dayOfWeek = may1.getDay();
  let daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7 || 7;
  let firstMonday = new Date(year, 4, 1 + daysUntilMonday);
  let secondMonday = new Date(firstMonday);
  secondMonday.setDate(firstMonday.getDate() + 7);
  const nextYear = year + 1;
  return `${year}-${nextYear}`;
}

// Custom Dropdown Component
function CustomSelect({ label, value, onChange, options, required, placeholder, hasError, disabled }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
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
        {label} {required && <span className="text-[#8B1010]">*</span>}
      </label>
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className={`w-full flex items-center justify-between px-4 py-3 text-sm border-2 rounded-xl transition-all duration-200 bg-white text-left ${
          disabled
            ? "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
            : hasError
            ? "border-red-500 ring-2 ring-red-500/20"
            : open
            ? "border-[#8B1010] ring-2 ring-[#8B1010]/10"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <span className={value ? "text-gray-900 font-medium uppercase" : "text-gray-400 normal-case"}>
          {value ? selected?.label : placeholder || "Select option"}
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 flex-shrink-0 ${disabled ? "text-gray-300" : "text-gray-400"} ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && !disabled && (
        <div className="absolute z-40 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm transition-all border-b border-gray-50 last:border-b-0 min-h-[44px] flex items-center ${
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

// Custom Date Picker Component
function CustomDatePicker({ label, value, onChange, required, hasError }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  hasError?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [displayMonth, setDisplayMonth] = useState(new Date().getMonth());
  const [displayYear, setDisplayYear] = useState(new Date().getFullYear());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const currentYear = new Date().getFullYear();
  const yearRange = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);

  useEffect(() => {
    if (value) {
      const parts = value.split("-");
      if (parts.length === 3) {
        setDisplayMonth(parseInt(parts[1]) - 1);
        setDisplayYear(parseInt(parts[0]));
      }
    }
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setShowMonthPicker(false);
        setShowYearPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayValue = value
    ? (() => { const p = value.split("-"); if (p.length !== 3) return value; return `${fullMonths[parseInt(p[1]) - 1]} ${parseInt(p[2])}, ${p[0]}`; })()
    : "";

  const getDaysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

  const handleSelectDate = (day: number) => {
    const m = (displayMonth + 1).toString().padStart(2, "0");
    const d = day.toString().padStart(2, "0");
    onChange(`${displayYear}-${m}-${d}`);
    setOpen(false);
    setShowMonthPicker(false);
    setShowYearPicker(false);
  };

  const handlePrevMonth = () => { if (displayMonth === 0) { setDisplayMonth(11); setDisplayYear(displayYear - 1); } else { setDisplayMonth(displayMonth - 1); } };
  const handleNextMonth = () => { if (displayMonth === 11) { setDisplayMonth(0); setDisplayYear(displayYear + 1); } else { setDisplayMonth(displayMonth + 1); } };

  const daysInMonth = getDaysInMonth(displayMonth, displayYear);
  const firstDayOfMonth = getFirstDayOfMonth(displayMonth, displayYear);
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const selectedDate = value ? parseInt(value.split("-")[2]) : null;
  const isCurrentMonth = displayMonth === new Date().getMonth() && displayYear === new Date().getFullYear();

  return (
    <div ref={ref} className="relative">
      <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label} {required && <span className="text-[#8B1010]">*</span>}</label>
      <button
        type="button"
        onClick={() => { setOpen(!open); setShowMonthPicker(false); setShowYearPicker(false); }}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm border-2 rounded-xl transition-all duration-200 bg-white ${
          hasError ? "border-red-500 ring-2 ring-red-500/20" : open ? "border-[#8B1010] ring-2 ring-[#8B1010]/10" : "border-gray-200 hover:border-[#8B1010]/50"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 flex-shrink-0"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
        <span className={displayValue ? "text-gray-900 font-medium uppercase" : "text-gray-400 normal-case"}>{displayValue || "Select date"}</span>
      </button>
      {open && (
        <div className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4 w-[310px]">
          <div className="flex items-center justify-between mb-4">
            <button type="button" onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="flex items-center gap-1">
              <div className="relative">
                <button type="button" onClick={() => { setShowMonthPicker(!showMonthPicker); setShowYearPicker(false); }} className="px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-lg">{shortMonths[displayMonth]}</button>
                {showMonthPicker && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-3 z-50">
                    <div className="grid grid-cols-4 gap-2 w-[200px]">
                      {shortMonths.map((m, i) => (
                        <button key={i} type="button" onClick={() => { setDisplayMonth(i); setShowMonthPicker(false); }} className={`px-2 py-2 text-xs font-medium rounded-lg transition-colors ${i === displayMonth ? "bg-[#8B1010] text-white" : "text-gray-700 hover:bg-gray-100"}`}>{m}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <button type="button" onClick={() => { setShowYearPicker(!showYearPicker); setShowMonthPicker(false); }} className="px-3 py-1.5 text-sm font-semibold text-gray-900 hover:bg-gray-100 rounded-lg">{displayYear}</button>
                {showYearPicker && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50">
                    <div className="p-2 max-h-[200px] overflow-y-auto w-[100px]">
                      {yearRange.map((y) => (
                        <button key={y} type="button" onClick={() => { setDisplayYear(y); setShowYearPicker(false); }} className={`w-full px-3 py-1.5 text-xs font-medium text-left rounded-lg transition-colors ${y === displayYear ? "bg-[#8B1010] text-white" : "text-gray-700 hover:bg-gray-100"}`}>{y}</button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <button type="button" onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (<div key={day} className="text-center text-[10px] font-bold text-gray-400 py-1 uppercase">{day}</div>))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <button key={index} type="button" onClick={() => day && handleSelectDate(day)} disabled={!day}
                className={`w-9 h-9 text-xs font-medium rounded-lg transition-colors flex items-center justify-center ${
                  !day ? "text-gray-200 cursor-default" : day === selectedDate ? "bg-[#8B1010] text-white font-bold" : isCurrentMonth && day === new Date().getDate() ? "bg-[#8B1010]/10 text-[#8B1010] border border-[#8B1010]/30" : "text-gray-700 hover:bg-gray-100"
                }`}>{day}</button>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-gray-100">
            <button type="button" onClick={() => { setOpen(false); setShowMonthPicker(false); setShowYearPicker(false); }} className="w-full px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom Radio Group Component
function CustomRadioGroup({ label, name, value, onChange, options, required, hasError, inline }: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; desc?: string }[];
  required?: boolean;
  hasError?: boolean;
  inline?: boolean;
}) {
  return (
    <div>
      <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-2.5 uppercase tracking-wide">{label} {required && <span className="text-[#8B1010]">*</span>}</label>
      <div className={`flex ${inline ? "flex-row gap-4" : "flex-col gap-2.5"}`}>
        {options.map((opt) => (
          <label key={opt.value} className={`relative flex items-center justify-center px-6 py-3 border-2 rounded-xl cursor-pointer transition-all text-center ${value === opt.value ? "border-[#8B1010] bg-[#8B1010]/5 font-bold text-[#8B1010]" : "border-gray-200 hover:border-gray-300 bg-white text-gray-700 font-medium"}`}>
            <input type="radio" name={name} value={opt.value} checked={value === opt.value} onChange={() => onChange(opt.value)} className="sr-only" />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
      {hasError && <p className="text-red-500 text-xs mt-1.5">This field is required</p>}
    </div>
  );
}

// Custom Text Input Component
function TextInput({ label, name, value, onChange, required, hasError, placeholder, readOnly, type = "text" }: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  hasError?: boolean;
  placeholder?: string;
  readOnly?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label} {required && <span className="text-[#8B1010]">*</span>}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full px-4 py-3 text-sm border-2 rounded-xl transition-all uppercase bg-white ${
          hasError ? "border-red-500 ring-2 ring-red-500/20" : readOnly ? "border-gray-200 bg-gray-50 text-gray-700 cursor-not-allowed" : "border-gray-200 focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 hover:border-gray-300"
        }`}
      />
    </div>
  );
}

export default function EnrollPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;
  const schoolYear = getSecondMondayOfMay();
  const pathname = usePathname();


  const [formData, setFormData] = useState<any>({
    enrollmentType: "",
    gradeLevel: "",
    strand: "",
    tvlSpecialization: "",
    lrn: "",
    psaBirthCert: "",
    lastName: "",
    firstName: "",
    middleName: "",
    extensionName: "",
    birthdate: "",
    placeOfBirthCity: "",
    placeOfBirthProvince: "",
    motherTongue: "",
    sex: "",
    withLRN: "Yes",
    returningLearner: "No",
    ipCommunity: "No",
    ipSpecify: "",
    fourPsBeneficiary: "No",
    fourPsHouseholdId: "",
    disability: "No",
    disabilityType: [] as string[],

    currentAddress: "",
    currentCity: "Cebu City",
    currentProvince: "Cebu",
    currentBarangay: "",
    currentZipCode: "6000",
    currentCountry: "Philippines",
    sameAddress: "Yes",
    permanentAddress: "",
    permanentCity: "",
    permanentProvince: "",
    permanentBarangay: "",
    permanentZipCode: "",
    permanentCountry: "",

    fatherName: "",
    fatherContact: "",
    motherMaidenName: "",
    motherContact: "",
    guardianName: "",
    guardianContact: "",

    declaration: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Set<string>>(new Set());

  const steps = [
    { num: 1, label: "Enrollment Type", icon: "📋" },
    { num: 2, label: "Learner Info", icon: "👤" },
    { num: 3, label: "Address", icon: "📍" },
    { num: 4, label: "Guardian Info", icon: "👨‍👩‍👧" },
    { num: 5, label: "Review & Submit", icon: "✅" },
  ];

  const enrollmentTypes = [
    { value: "new", label: "New Student", desc: "First time enrolling in any school" },
    { value: "old", label: "Old Student", desc: "Currently enrolled / returning student" },
    { value: "transferee", label: "Transferee", desc: "Coming from another school" },
    { value: "balik-aral", label: "Balik-Aral", desc: "Returning to formal education" },
  ];

  const requirementsByType: Record<string, { item: string; required: boolean }[]> = {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checkbox = e.target as HTMLInputElement;
      if (name === "declaration") {
        setFormData((prev: any) => ({ ...prev, declaration: checkbox.checked }));
      }
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
    setFieldErrors((prev) => { const n = new Set(prev); n.delete(name); return n; });
  };

  const getStepFields = (step: number): string[] => {
    switch (step) {
      case 1: return ["enrollmentType", "gradeLevel", ...(isSHS ? ["strand"] : []), ...(isSHS && formData.strand === "TVL" ? ["tvlSpecialization"] : [])];
      case 2: return ["lastName", "firstName", "birthdate", "sex", "placeOfBirthCity"];
      case 3: return ["currentAddress", "currentBarangay", "currentCity", "currentProvince", "currentZipCode"];
      case 4: return [];
      case 5: return formData.declaration ? [] : ["declaration"];
      default: return [];
    }
  };

  const validateStep = (step: number): boolean => {
    const fields = getStepFields(step);
    const errors = new Set<string>();
    for (const field of fields) {
      const val = (formData as any)[field];
      if (!val || val.toString().trim() === "") errors.add(field);
    }
    if (errors.size > 0) { setFieldErrors(errors); return false; }
    setFieldErrors(new Set());
    return true;
  };

  const goToStep = (step: number) => {
    if (step > currentStep) {
      if (validateStep(currentStep)) { setCurrentStep(step); window.scrollTo({ top: 0, behavior: "smooth" }); }
    } else {
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNext = () => { if (currentStep < totalSteps) goToStep(currentStep + 1); };
  const goPrev = () => { if (currentStep > 1) { setCurrentStep(currentStep - 1); window.scrollTo({ top: 0, behavior: "smooth" }); } };

  const handleSubmit = () => {
    if (validateStep(5)) { setSubmitted(true); window.scrollTo({ top: 0, behavior: "smooth" }); }
  };

  const isSHS = formData.gradeLevel === "11" || formData.gradeLevel === "12";
  const currentRequirements = requirementsByType[formData.enrollmentType] || [];

  // Grade level options based on student type
  const gradeLevelOptions = (() => {
    switch (formData.enrollmentType) {
      case "new":
        return [{ value: "7", label: "Grade 7" }];
      case "old":
        return [
          { value: "8", label: "Grade 8" }, { value: "9", label: "Grade 9" },
          { value: "10", label: "Grade 10" }, { value: "11", label: "Grade 11 (SHS)" }, { value: "12", label: "Grade 12 (SHS)" },
        ];
      case "transferee":
      case "balik-aral":
        return [
          { value: "7", label: "Grade 7" }, { value: "8", label: "Grade 8" }, { value: "9", label: "Grade 9" },
          { value: "10", label: "Grade 10" }, { value: "11", label: "Grade 11 (SHS)" }, { value: "12", label: "Grade 12 (SHS)" },
        ];
      default:
        return [];
    }
  })();

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-[#1E5631] text-white text-xs"><div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9"><span className="font-medium">Republic of the Philippines</span><span className="text-gray-300"> | Department of Education</span></div></div>
        <header className="bg-white border-b-4 border-[#8B1010] shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div className="flex items-center h-24">
            <Link href="/" className="flex items-center gap-4">
              <Image src="/logo.png" alt="MNHS" width={56} height={56} className="rounded-full shadow-sm" priority />
              <div><h1 className="text-lg font-bold text-[#8B1010] leading-tight">MABOLO NATIONAL HIGH SCHOOL</h1><p className="text-[11px] text-[#4b5563]">Cebu City — Division of Cebu City</p></div>
            </Link>
          </div></div>
        </header>
        <div className="max-w-lg mx-auto py-20 px-4 text-center">
          <div className="w-20 h-20 bg-[#1E5631]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#1E5631" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 className="text-2xl font-bold text-[#8B1010] mb-3">Enrollment Submitted!</h2>
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            Thank you, <strong>{formData.firstName} {formData.lastName}</strong>. Your enrollment application has been received. The registrar will review your submission and contact you within 3–5 working days.
          </p>
          <Link href="/" className="inline-block bg-[#8B1010] hover:bg-[#b81c1c] text-white font-semibold px-8 py-3 text-sm rounded-xl transition-colors">Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#1a1a1a]">
      <div className="bg-[#1E5631] text-white text-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-9">
          <div className="flex items-center gap-2"><span className="font-medium">Republic of the Philippines</span><span className="text-gray-300">|</span><span className="text-gray-300">Department of Education</span></div>
          <div className="hidden sm:flex items-center gap-4 text-gray-300"><span>DepEd Division of Cebu City</span><span>|</span><span>Region VII — Central Visayas</span></div>
        </div>
      </div>

      <header className="bg-white border-b-4 border-[#8B1010] shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <Link href="/" className="flex items-center gap-4">
              <Image src="/logo.png" alt="MNHS Official Seal" width={64} height={64} className="rounded-full shadow-sm" priority />
              <div>
                <h1 className="text-lg font-bold text-[#8B1010] leading-tight">MABOLO NATIONAL HIGH SCHOOL</h1>
                <p className="text-[11px] text-[#4b5563] tracking-wide">Cebu City — Division of Cebu City</p>
                <p className="text-[10px] text-[#D4A017] font-semibold tracking-wider uppercase mt-0.5">DepEd &middot; Region VII</p>
              </div>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              {[{ label: "About", href: "/about" }, { label: "Programs", href: "/programs" }, { label: "Admission", href: "/admission" }, { label: "Announcements", href: "/news" }, { label: "Contact", href: "/contact" }].map((item) => (
                <Link key={item.href} href={item.href} className={`px-4 py-2 text-sm font-medium transition-colors rounded ${pathname.startsWith(item.href) ? "bg-[#8B1010] text-white" : "text-gray-700 hover:text-[#8B1010] hover:bg-red-50"}`}>{item.label}</Link>
              ))}
              <Link href="/login" className="ml-3 px-5 py-2 text-xs lg:text-sm font-medium bg-[#8B1010] text-white hover:bg-[#6e0d0d] transition-colors rounded">Login</Link>
            </nav>
            <button className="lg:hidden text-[#8B1010] p-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
          </div>
        </div>
      </header>

      <section className="relative h-[200px] sm:h-[250px] bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/bg.jpg')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-[#8B1010]/95 via-[#8B1010]/80 to-[#1E5631]/85" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <p className="text-[#D4A017] font-semibold text-xs tracking-[0.2em] uppercase mb-3">SY {schoolYear}</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">Basic Education Enrollment Form</h2>
          </div>
        </div>
      </section>

      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Link href="/" className="hover:text-[#8B1010] transition-colors">Home</Link><span>/</span>
            <Link href="/admission" className="hover:text-[#8B1010] transition-colors">Admission</Link><span>/</span>
            <span className="text-[#8B1010] font-medium">Enroll</span>
          </div>
        </div>
      </div>

      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-5 mb-8">
            <h4 className="font-bold text-sm text-blue-900 mb-2">INSTRUCTIONS:</h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>&#10003; Print legibly all information required in CAPITAL LETTERS</li>
              <li>&#10003; Submit accomplished form to the Person-in-Charge/Registrar/Class Adviser</li>
              <li>&#10003; Use black or blue pen only</li>
              <li>&#10003; This form is NOT FOR SALE</li>
            </ul>
          </div>

          {/* Step Progress */}
          <div className="mb-8">
            <div className="grid grid-cols-5 gap-0">
              {steps.map((step, idx) => (
                <div key={step.num} className="flex flex-col items-center relative">
                  <div className="flex items-center w-full justify-center">
                    {idx > 0 && <div className={`absolute top-5 sm:top-6 right-1/2 w-full h-0.5 transition-colors ${step.num <= currentStep ? "bg-[#1E5631]" : "bg-gray-300"}`} />}
                    <button onClick={() => goToStep(step.num)} className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all border-2 ${step.num === currentStep ? "bg-[#8B1010] text-white border-[#8B1010] shadow-lg" : step.num < currentStep ? "bg-[#1E5631] text-white border-[#1E5631]" : "bg-white text-gray-400 border-gray-300"}`}>
                        {step.num < currentStep ? <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> : step.num}
                    </button>
                  </div>
                  <span className="hidden sm:block text-[10px] sm:text-[11px] font-semibold text-gray-600 text-center leading-tight mt-2">{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="bg-[#8B1010] text-white px-6 sm:px-8 py-4">
              <h3 className="text-lg font-bold">Step {currentStep} of {totalSteps}</h3>
              <p className="text-xs text-gray-200 mt-0.5">{steps[currentStep - 1].label}</p>
            </div>

            <div className="p-6 sm:p-8">

              {/* ==================== STEP 1: Enrollment Type ==================== */}
              {currentStep === 1 && (
                <div>
                  <h4 className="font-bold text-gray-800 text-base mb-2">ENROLLMENT TYPE</h4>
                  <p className="text-xs text-gray-500 mb-6">Select the student type to view requirements.</p>

                  <div className="mb-6">
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wide">Student Type <span className="text-[#8B1010]">*</span></label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {enrollmentTypes.map((type) => (
                        <button
                          key={type.value}
                          type="button"
                          onClick={() => setFormData((prev: any) => ({ ...prev, enrollmentType: type.value }))}
                          className={`relative text-left p-5 border-2 rounded-xl transition-all ${
                            formData.enrollmentType === type.value
                              ? "border-[#8B1010] bg-[#8B1010]/5 shadow-md ring-2 ring-[#8B1010]/10"
                              : "border-gray-200 hover:border-gray-300 bg-white hover:shadow-sm"
                          }`}
                        >
                          {formData.enrollmentType === type.value && (
                            <div className="absolute top-3 right-3 w-6 h-6 bg-[#8B1010] rounded-full flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white"><polyline points="20 6 9 17 4 12"/></svg>
                            </div>
                          )}
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              formData.enrollmentType === type.value ? "bg-[#8B1010] text-white" : "bg-gray-100 text-gray-500"
                            }`}>
                              {type.value === "new" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>}
                              {type.value === "old" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                              {type.value === "transferee" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>}
                              {type.value === "balik-aral" && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-gray-900">{type.label}</p>
                              <p className="text-[11px] text-gray-500 mt-0.5">{type.desc}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    {fieldErrors.has("enrollmentType") && <p className="text-red-500 text-xs mt-2">Please select a student type</p>}
                  </div>

                  <div className="mb-8">
                    <CustomSelect
                      label="Grade Level to Enroll"
                      value={formData.gradeLevel}
                      onChange={(v) => setFormData((prev: any) => ({ ...prev, gradeLevel: v, strand: "" }))}
                      required
                      hasError={fieldErrors.has("gradeLevel")}
                      placeholder={formData.enrollmentType ? "Select grade level" : "Select student type first"}
                      disabled={!formData.enrollmentType}
                      options={gradeLevelOptions}
                    />
                  </div>

                  {isSHS && (
                    <div className="mb-8">
                      <CustomSelect
                        label="Strand / Track"
                        value={formData.strand}
                        onChange={(v) => setFormData((prev: any) => ({ ...prev, strand: v, tvlSpecialization: "" }))}
                        required
                        hasError={fieldErrors.has("strand")}
                        placeholder="Select strand"
                        options={[
                          { value: "STEM", label: "STEM - Science, Technology, Engineering & Mathematics" },
                          { value: "ABM", label: "ABM - Accountancy, Business & Management" },
                          { value: "HUMSS", label: "HUMSS - Humanities & Social Sciences" },
                          { value: "TVL", label: "TVL - Technical-Vocational-Livelihood" },
                          { value: "GAS", label: "GAS - General Academic Strand" },
                          { value: "Sports", label: "Sports Track" },
                          { value: "Arts", label: "Arts & Design Track" },
                        ]}
                      />
                    </div>
                  )}

                  {isSHS && formData.strand === "TVL" && (
                    <div className="mb-8">
                      <CustomSelect
                        label="TVL Specialization"
                        value={formData.tvlSpecialization}
                        onChange={(v) => setFormData((prev: any) => ({ ...prev, tvlSpecialization: v }))}
                        required
                        hasError={fieldErrors.has("tvlSpecialization")}
                        placeholder="Select specialization"
                        options={[
                          { value: "CSS", label: "CSS - Computer Systems Servicing" },
                          { value: "TD", label: "TD - Technical Drafting" },
                          { value: "HD", label: "HD - Home Economics / Household Services" },
                          { value: "COOKERY", label: "Cookery" },
                        ]}
                      />
                    </div>
                  )}

                  {formData.enrollmentType && formData.gradeLevel && (isSHS ? formData.strand && (formData.strand !== "TVL" || formData.tvlSpecialization) : true) && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                      <h5 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#8B1010]"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                        Requirements for {enrollmentTypes.find(e => e.value === formData.enrollmentType)?.label}
                      </h5>
                      <div className="space-y-2.5">
                        {currentRequirements.map((req, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${req.required ? "bg-[#8B1010]/10 text-[#8B1010]" : "bg-gray-100 text-gray-400"}`}>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900 flex-1">{req.item}</span>
                            {req.required && <span className="text-[10px] font-bold text-[#8B1010] bg-[#8B1010]/10 px-2 py-0.5 rounded-full">Required</span>}
                            {!req.required && <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Optional</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== STEP 2: Learner Info ==================== */}
              {currentStep === 2 && (
                <div>
                  <h4 className="font-bold text-gray-800 text-base mb-6">LEARNER INFORMATION</h4>

                  <div className="bg-gray-50 rounded-xl p-4 mb-6">
                    <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">School Year</label>
                    <div className="flex items-center gap-3">
                      <input value={schoolYear.split("-")[0]} readOnly className="w-full px-4 py-3 text-sm border-2 rounded-xl bg-white text-gray-700 cursor-not-allowed text-center font-bold border-gray-200 uppercase" />
                      <span className="text-xl font-bold text-gray-400">—</span>
                      <input value={schoolYear.split("-")[1]} readOnly className="w-full px-4 py-3 text-sm border-2 rounded-xl bg-white text-gray-700 cursor-not-allowed text-center font-bold border-gray-200 uppercase" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <CustomRadioGroup label="With LRN?" name="withLRN" value={formData.withLRN} onChange={(v) => setFormData((prev: any) => ({ ...prev, withLRN: v }))} options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} inline />
                    <CustomRadioGroup label="IP Community?" name="ipCommunity" value={formData.ipCommunity} onChange={(v) => setFormData((prev: any) => ({ ...prev, ipCommunity: v }))} options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} inline />
                    <CustomRadioGroup label="Learner with Disability?" name="disability" value={formData.disability} onChange={(v) => setFormData((prev: any) => ({ ...prev, disability: v }))} options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} inline />
                    <CustomRadioGroup label="4Ps Beneficiary?" name="fourPsBeneficiary" value={formData.fourPsBeneficiary} onChange={(v) => setFormData((prev: any) => ({ ...prev, fourPsBeneficiary: v }))} options={[{ value: "Yes", label: "Yes" }, { value: "No", label: "No" }]} inline />
                  </div>

                  {formData.ipCommunity === "Yes" && (
                    <div className="mb-5"><TextInput label="Specify IP Community" name="ipSpecify" value={formData.ipSpecify} onChange={handleChange} /></div>
                  )}

                  {formData.withLRN === "Yes" && (
                    <div className="grid sm:grid-cols-2 gap-4 mb-5">
                      <TextInput label="Learner Reference No. (LRN)" name="lrn" value={formData.lrn} onChange={handleChange} placeholder="e.g. 123456789012" />
                      <TextInput label="PSA Birth Certificate No." name="psaBirthCert" value={formData.psaBirthCert} onChange={handleChange} placeholder="e.g. 12345678" />
                    </div>
                  )}

                  {formData.withLRN === "No" && (
                    <div className="mb-5">
                      <TextInput label="PSA Birth Certificate No." name="psaBirthCert" value={formData.psaBirthCert} onChange={handleChange} placeholder="e.g. 12345678" />
                    </div>
                  )}

                  {formData.disability === "Yes" && (
                    <div className="mb-5">
                      <CustomSelect
                        label="Type of Disability"
                        value={formData.disabilityType}
                        onChange={(v) => setFormData((prev: any) => ({ ...prev, disabilityType: v }))}
                        placeholder="Select disability type"
                        options={[
                          { value: "Visual Impairment", label: "Visual Impairment" },
                          { value: "Hearing Impairment", label: "Hearing Impairment" },
                          { value: "Speech/Language Impairment", label: "Speech / Language Impairment" },
                          { value: "Orthopedic/Physical Disability", label: "Orthopedic / Physical Disability" },
                          { value: "Intellectual Disability", label: "Intellectual Disability" },
                          { value: "Learning Disability", label: "Learning Disability" },
                          { value: "Autism Spectrum Disorder", label: "Autism Spectrum Disorder" },
                          { value: "Multiple Disabilities", label: "Multiple Disabilities" },
                        ]}
                      />
                    </div>
                  )}

                  {formData.fourPsBeneficiary === "Yes" && (
                    <div className="mb-5"><TextInput label="4Ps Household ID Number" name="fourPsHouseholdId" value={formData.fourPsHouseholdId} onChange={handleChange} /></div>
                  )}

                  <div className="grid sm:grid-cols-5 gap-3 mb-5">
                    <div className="sm:col-span-2">
                      <TextInput label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} required hasError={fieldErrors.has("lastName")} />
                    </div>
                    <div className="sm:col-span-2">
                      <TextInput label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} required hasError={fieldErrors.has("firstName")} />
                    </div>
                    <div>
                      <TextInput label="Extension" name="extensionName" value={formData.extensionName} onChange={handleChange} placeholder="Jr., Sr." />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <TextInput label="Middle Name" name="middleName" value={formData.middleName} onChange={handleChange} />
                    <TextInput label="Mother Tongue" name="motherTongue" value={formData.motherTongue} onChange={handleChange} placeholder="e.g. Cebuano" />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <CustomDatePicker label="Birthdate" value={formData.birthdate} onChange={(v) => setFormData((prev: any) => ({ ...prev, birthdate: v }))} required hasError={fieldErrors.has("birthdate")} />
                    <CustomSelect label="Sex" value={formData.sex} onChange={(v) => setFormData((prev: any) => ({ ...prev, sex: v }))} required hasError={fieldErrors.has("sex")} placeholder="Select sex" options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <TextInput label="Place of Birth (Municipality/City)" name="placeOfBirthCity" value={formData.placeOfBirthCity} onChange={handleChange} required hasError={fieldErrors.has("placeOfBirthCity")} />
                    <TextInput label="Province" name="placeOfBirthProvince" value={formData.placeOfBirthProvince} onChange={handleChange} />
                  </div>
                </div>
              )}

              {/* ==================== STEP 3: Address ==================== */}
              {currentStep === 3 && (
                <div>
                  <h4 className="font-bold text-gray-800 text-base mb-6">ADDRESS INFORMATION</h4>
                  <div className="mb-6">
                    <h5 className="font-semibold text-sm text-[#8B1010] mb-4 uppercase tracking-wide">Current Address</h5>
                    <div className="space-y-4">
                      <TextInput label="House No. / Street Name" name="currentAddress" value={formData.currentAddress} onChange={handleChange} required hasError={fieldErrors.has("currentAddress")} />
                      <div className="grid sm:grid-cols-2 gap-4">
                        <TextInput label="Barangay" name="currentBarangay" value={formData.currentBarangay} onChange={handleChange} required hasError={fieldErrors.has("currentBarangay")} />
                        <TextInput label="Municipality / City" name="currentCity" value={formData.currentCity} onChange={handleChange} required hasError={fieldErrors.has("currentCity")} />
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <TextInput label="Province" name="currentProvince" value={formData.currentProvince} onChange={handleChange} required hasError={fieldErrors.has("currentProvince")} />
                        <TextInput label="ZIP Code" name="currentZipCode" value={formData.currentZipCode} onChange={handleChange} required hasError={fieldErrors.has("currentZipCode")} />
                        <TextInput label="Country" name="currentCountry" value={formData.currentCountry} onChange={handleChange} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h5 className="font-semibold text-sm text-[#8B1010] mb-4 uppercase tracking-wide">Permanent Address</h5>
                    <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 cursor-pointer">
                      <input type="checkbox" checked={formData.sameAddress === "Yes"} onChange={(e) => setFormData((prev: any) => ({ ...prev, sameAddress: e.target.checked ? "Yes" : "No" }))} className="w-4 h-4 rounded border-gray-300 text-[#8B1010] focus:ring-[#8B1010]" />
                      <span className="text-sm font-medium text-gray-700">Same as Current Address</span>
                    </label>
                    {formData.sameAddress === "No" && (
                      <div className="space-y-4">
                        <TextInput label="House No. / Street Name" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} />
                        <div className="grid sm:grid-cols-2 gap-4">
                          <TextInput label="Barangay" name="permanentBarangay" value={formData.permanentBarangay} onChange={handleChange} />
                          <TextInput label="Municipality / City" name="permanentCity" value={formData.permanentCity} onChange={handleChange} />
                        </div>
                        <div className="grid sm:grid-cols-3 gap-4">
                          <TextInput label="Province" name="permanentProvince" value={formData.permanentProvince} onChange={handleChange} />
                          <TextInput label="ZIP Code" name="permanentZipCode" value={formData.permanentZipCode} onChange={handleChange} />
                          <TextInput label="Country" name="permanentCountry" value={formData.permanentCountry} onChange={handleChange} />
                        </div>
                      </div>
                    )}
                    {formData.sameAddress === "Yes" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4"><p className="text-sm text-blue-800">Permanent address is set to the same as your current address.</p></div>
                    )}
                  </div>
                </div>
              )}

              {/* ==================== STEP 4: Guardian Info ==================== */}
              {currentStep === 4 && (
                <div>
                  <h4 className="font-bold text-gray-800 text-base mb-6">PARENT&apos;S / GUARDIAN&apos;S INFORMATION</h4>
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h5 className="font-semibold text-sm text-gray-700 mb-4">Father&apos;s Information</h5>
                      <div className="space-y-4">
                        <TextInput label="Father&apos;s Full Name" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="LAST NAME, FIRST NAME" />
                        <TextInput label="Father&apos;s Contact Number" name="fatherContact" value={formData.fatherContact} onChange={handleChange} type="tel" placeholder="09XX-XXX-XXXX" />
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h5 className="font-semibold text-sm text-gray-700 mb-4">Mother&apos;s Information</h5>
                      <div className="space-y-4">
                        <TextInput label="Mother&apos;s Maiden Name" name="motherMaidenName" value={formData.motherMaidenName} onChange={handleChange} placeholder="LAST NAME, FIRST NAME" />
                        <TextInput label="Mother&apos;s Contact Number" name="motherContact" value={formData.motherContact} onChange={handleChange} type="tel" placeholder="09XX-XXX-XXXX" />
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-5">
                      <h5 className="font-semibold text-sm text-gray-700 mb-4">Legal Guardian (if applicable)</h5>
                      <div className="space-y-4">
                        <TextInput label="Guardian&apos;s Full Name" name="guardianName" value={formData.guardianName} onChange={handleChange} placeholder="LAST NAME, FIRST NAME" />
                        <TextInput label="Guardian&apos;s Contact Number" name="guardianContact" value={formData.guardianContact} onChange={handleChange} type="tel" placeholder="09XX-XXX-XXXX" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== STEP 5: Review & Submit ==================== */}
              {currentStep === 5 && (
                <div>
                  <h4 className="font-bold text-gray-800 text-base mb-6">REVIEW & SUBMIT</h4>

                  {/* Requirements Upload */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-sm text-[#8B1010] mb-3 uppercase tracking-wide flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      Upload Requirements
                    </h5>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {currentRequirements.map((req, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${req.required ? "bg-[#8B1010]/10 text-[#8B1010]" : "bg-gray-100 text-gray-400"}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-gray-900 block truncate">{req.item}</span>
                            <span className={`text-[10px] ${req.required ? "text-[#8B1010] font-semibold" : "text-gray-400"}`}>{req.required ? "Required" : "Optional"}</span>
                          </div>
                          <button type="button" className="px-3 py-1.5 text-[11px] font-medium text-[#8B1010] border border-[#8B1010]/30 rounded-lg hover:bg-[#8B1010]/5 transition-colors flex-shrink-0">Upload</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Review Info */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-sm text-[#8B1010] mb-3 uppercase tracking-wide flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      Review Information
                    </h5>
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500 text-xs">Enrollment Type</span><p className="font-medium text-gray-900 uppercase">{enrollmentTypes.find(e => e.value === formData.enrollmentType)?.label || "—"}</p></div>
                        <div><span className="text-gray-500 text-xs">Grade Level</span><p className="font-medium text-gray-900 uppercase">{formData.gradeLevel ? `Grade ${formData.gradeLevel}` : "—"}</p></div>
                        <div><span className="text-gray-500 text-xs">School Year</span><p className="font-medium text-gray-900">{schoolYear}</p></div>
                        <div><span className="text-gray-500 text-xs">LRN</span><p className="font-medium text-gray-900 uppercase">{formData.lrn || "—"}</p></div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <div><span className="text-gray-500 text-xs">Full Name</span><p className="font-medium text-gray-900 uppercase">{[formData.lastName, formData.firstName, formData.middleName, formData.extensionName].filter(Boolean).join(", ") || "—"}</p></div>
                      </div>
                      <div className="grid sm:grid-cols-3 gap-4 text-sm border-t border-gray-200 pt-4">
                        <div><span className="text-gray-500 text-xs">Birthdate</span><p className="font-medium text-gray-900 uppercase">{formData.birthdate || "—"}</p></div>
                        <div><span className="text-gray-500 text-xs">Sex</span><p className="font-medium text-gray-900 uppercase">{formData.sex || "—"}</p></div>
                        <div><span className="text-gray-500 text-xs">Place of Birth</span><p className="font-medium text-gray-900 uppercase">{formData.placeOfBirthCity || "—"}</p></div>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <span className="text-gray-500 text-xs">Current Address</span>
                        <p className="font-medium text-gray-900 text-sm uppercase">{[formData.currentAddress, formData.currentBarangay, formData.currentCity, formData.currentProvince, formData.currentZipCode, formData.currentCountry].filter(Boolean).join(", ") || "—"}</p>
                      </div>
                      <div className="border-t border-gray-200 pt-4">
                        <span className="text-gray-500 text-xs">Father&apos;s Name</span>
                        <p className="font-medium text-gray-900 text-sm uppercase">{formData.fatherName || "—"}</p>
                      </div>
                      <div>
                        <span className="text-gray-500 text-xs">Mother&apos;s Maiden Name</span>
                        <p className="font-medium text-gray-900 text-sm uppercase">{formData.motherMaidenName || "—"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Declaration */}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <h5 className="font-semibold text-sm text-gray-700 mb-3">DECLARATION</h5>
                    <p className="text-xs text-gray-600 leading-relaxed mb-4">
                      I hereby certify that the above information given are true and correct to the best of my knowledge and I allow the Department of Education to use my child&apos;s details to create and/or update his/her learner profile in the Learner Information System. The information herein shall be treated as confidential in compliance with the Data Privacy Act of 2012.
                    </p>
                    <label className="flex items-start gap-3 p-4 bg-white border-2 rounded-xl cursor-pointer transition-all hover:border-[#8B1010]/30">
                      <input type="checkbox" name="declaration" checked={formData.declaration} onChange={handleChange} className="mt-0.5 w-4 h-4 rounded border-gray-300 text-[#8B1010] focus:ring-[#8B1010]" />
                      <span className="text-sm font-medium text-gray-900">I have read and agree to the above declaration. <span className="text-[#8B1010]">*</span></span>
                    </label>
                    {fieldErrors.has("declaration") && <p className="text-red-500 text-xs mt-2">You must agree to the declaration before submitting.</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4 px-6 sm:px-8 py-5 border-t border-gray-200 bg-gray-50">
              <button type="button" onClick={goPrev} disabled={currentStep === 1} className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 border-2 border-gray-200 rounded-xl hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
                Previous
              </button>
              <div className="text-xs font-medium text-gray-400">Step {currentStep} of {totalSteps}</div>
              {currentStep < totalSteps ? (
                <button type="button" onClick={goNext} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#8B1010] hover:bg-[#b81c1c] rounded-xl transition-all shadow-sm hover:shadow-md">
                  Next
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={!formData.declaration} className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-[#1E5631] hover:bg-green-800 rounded-xl transition-all shadow-sm hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Submit Enrollment
                </button>
              )}
            </div>
          </form>
        </div>
      </section>

      <footer className="bg-[#2d2d2d] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-3 mb-4">
                <Image src="/logo.png" alt="MNHS Logo" width={48} height={48} className="rounded-full" />
                <div>
                  <h4 className="font-bold text-sm">Mabolo National High School</h4>
                  <p className="text-gray-400 text-xs">DepEd Division of Cebu City</p>
                </div>
              </Link>
              <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
                Committed to delivering quality, accessible, and inclusive basic
                education in compliance with the Department of Education&apos;s
                mandates and the K-12 program.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-[#D4A017]">Quick Links</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/programs" className="hover:text-white transition-colors">Academic Programs</Link></li>
                <li><Link href="/news" className="hover:text-white transition-colors">News & Announcements</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Office</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4 text-[#D4A017]">Government Links</h4>
              <ul className="space-y-2 text-xs text-gray-400">
                <li><a href="https://www.deped.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">DepEd Official Website</a></li>
                <li><a href="https://www.depedcebu.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">DepEd Cebu City Division</a></li>
                <li><a href="https://www.officialgazette.gov.ph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Official Gazette</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-[11px]">&copy; 2026 Mabolo National High School. All rights reserved.</p>
            <p className="text-gray-500 text-[11px]">Department of Education &middot; Republic of the Philippines</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
