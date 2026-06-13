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
    <div ref={ref} className="relative z-40">
      <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-2.5 border-2 rounded-xl text-sm transition-all bg-white ${
          value ? "border-[#8B1010] bg-[#8B1010]/5 text-[#8B1010] font-medium" : "border-gray-200 text-gray-700"
        }`}
      >
        <span>{selected ? selected.label : placeholder || "Select"}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors cursor-pointer ${
                value === opt.value ? "bg-[#8B1010] text-white font-medium" : "text-gray-700 hover:bg-gray-100"
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

const TABS = ["HOME", "ABOUT", "PROGRAMS", "CONTACTS", "ADMISSION", "GLOBAL"] as const;
type Tab = typeof TABS[number];

function TextInput({ label, value, onChange, type = "text", placeholder }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all"
      />
    </div>
  );
}

function TextArea({ label, value, onChange, rows = 3 }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all resize-y"
      />
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("HOME");
  const [showSuccess, setShowSuccess] = useState(false);

  const [homeForm, setHomeForm] = useState({
    schoolName: "Mabolo National High School",
    heroHeading: "Mabolo National High School",
    heroTagline: "Teaching with Excellence for the Nation's Future...",
    mission: "To develop passionate, competent, and values-driven learners...",
    vision: "To be a center of educational excellence...",
  });

  const [aboutForm, setAboutForm] = useState({
    schoolHistory: "Mabolo National High School was established in 1975...",
    schoolHeadName: "Dr. Juan M. Dela Cruz",
    schoolHeadTitle: "Principal IV",
    schoolId: "303456",
    classification: "National High School",
    schoolType: "Public/DepEd",
    curriculum: "K-12",
    gradeLevels: "7-12",
    congressionalDistrict: "Cebu City 1st District",
    legislativeDistrict: "Legislative District 1",
  });

  const [programsForm, setProgramsForm] = useState({
    jhsHeading: "Junior High School (JHS)",
    jhsDescription: "Grades 7 to 10 program covering core subjects...",
    shsHeading: "Senior High School (SHS)",
    shsDescription: "Grades 11 to 12 program with academic and TVL tracks...",
  });

  const [contactsForm, setContactsForm] = useState({
    address: "Mabolo NHS, Mabolo Cebu City, Philippines 6000",
    phone: "(032) 123-4567",
    email: "mnhs.deped@gmail.com",
    depedHotline: "(02) 8636-1663",
    officeHours: "Mon-Fri 7AM-5PM, Sat 7AM-12PM",
    mapUrl: "https://www.google.com/maps/embed?pb=...",
  });

  const [admissionForm, setAdmissionForm] = useState({
    newStudentReqs: "PSA Birth Certificate\nForm 138\nGood Moral Certificate\n2x2 ID Picture (2 copies)",
    oldStudentReqs: "Form 138\nGood Moral Certificate\n2x2 ID Picture (1 copy)",
    transfereeReqs: "PSA Birth Certificate\nForm 137\nGood Moral Certificate\n2x2 ID Picture (2 copies)",
    balikAralReqs: "PSA Birth Certificate\nGood Moral Certificate\n2x2 ID Picture (2 copies)\nCertificate of Attendance",
  });

  const [globalForm, setGlobalForm] = useState({
    division: "Cebu City",
    region: "Region VII — Central Visayas",
    footerCopyright: "2026 Mabolo National High School",
    facebookUrl: "https://facebook.com/mnhs",
    twitterUrl: "https://twitter.com/mnhs",
  });

  function handleSave() {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Website Settings</h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage content for all public-facing pages</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-0 min-w-max">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-semibold tracking-wider transition-colors border-b-2 cursor-pointer ${
                activeTab === tab
                  ? "border-[#8B1010] text-[#8B1010]"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Success Banner */}
      {showSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-700" style={{ animation: "slideDown 0.3s ease-out" }}>
          Settings saved successfully!
        </div>
      )}

      {/* HOME Tab */}
      {activeTab === "HOME" && (
        <div className="space-y-6" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Hero Section</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="School Name" value={homeForm.schoolName} onChange={(v) => setHomeForm({ ...homeForm, schoolName: v })} />
              <TextInput label="Hero Heading" value={homeForm.heroHeading} onChange={(v) => setHomeForm({ ...homeForm, heroHeading: v })} />
            </div>
            <div className="mt-4">
              <TextArea label="Hero Tagline" value={homeForm.heroTagline} onChange={(v) => setHomeForm({ ...homeForm, heroTagline: v })} rows={2} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Mission & Vision</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextArea label="Mission" value={homeForm.mission} onChange={(v) => setHomeForm({ ...homeForm, mission: v })} />
              <TextArea label="Vision" value={homeForm.vision} onChange={(v) => setHomeForm({ ...homeForm, vision: v })} />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} className="bg-[#8B1010] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#6e0d0d] transition-colors cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ABOUT Tab */}
      {activeTab === "ABOUT" && (
        <div className="space-y-6" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">School History</h2>
            <TextArea label="History" value={aboutForm.schoolHistory} onChange={(v) => setAboutForm({ ...aboutForm, schoolHistory: v })} rows={5} />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">School Profile</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextInput label="School ID" value={aboutForm.schoolId} onChange={(v) => setAboutForm({ ...aboutForm, schoolId: v })} />
              <TextInput label="Classification" value={aboutForm.classification} onChange={(v) => setAboutForm({ ...aboutForm, classification: v })} />
              <TextInput label="School Type" value={aboutForm.schoolType} onChange={(v) => setAboutForm({ ...aboutForm, schoolType: v })} />
              <TextInput label="Curriculum" value={aboutForm.curriculum} onChange={(v) => setAboutForm({ ...aboutForm, curriculum: v })} />
              <TextInput label="Grade Levels" value={aboutForm.gradeLevels} onChange={(v) => setAboutForm({ ...aboutForm, gradeLevels: v })} />
              <TextInput label="Congressional District" value={aboutForm.congressionalDistrict} onChange={(v) => setAboutForm({ ...aboutForm, congressionalDistrict: v })} />
              <TextInput label="Legislative District" value={aboutForm.legislativeDistrict} onChange={(v) => setAboutForm({ ...aboutForm, legislativeDistrict: v })} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">School Head</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Name" value={aboutForm.schoolHeadName} onChange={(v) => setAboutForm({ ...aboutForm, schoolHeadName: v })} />
              <TextInput label="Title" value={aboutForm.schoolHeadTitle} onChange={(v) => setAboutForm({ ...aboutForm, schoolHeadTitle: v })} />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} className="bg-[#8B1010] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#6e0d0d] transition-colors cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* PROGRAMS Tab */}
      {activeTab === "PROGRAMS" && (
        <div className="space-y-6" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Junior High School (JHS)</h2>
            <div className="grid grid-cols-1 gap-4">
              <TextInput label="Section Heading" value={programsForm.jhsHeading} onChange={(v) => setProgramsForm({ ...programsForm, jhsHeading: v })} />
              <TextArea label="Description" value={programsForm.jhsDescription} onChange={(v) => setProgramsForm({ ...programsForm, jhsDescription: v })} rows={3} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Senior High School (SHS)</h2>
            <div className="grid grid-cols-1 gap-4">
              <TextInput label="Section Heading" value={programsForm.shsHeading} onChange={(v) => setProgramsForm({ ...programsForm, shsHeading: v })} />
              <TextArea label="Description" value={programsForm.shsDescription} onChange={(v) => setProgramsForm({ ...programsForm, shsDescription: v })} rows={3} />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} className="bg-[#8B1010] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#6e0d0d] transition-colors cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* CONTACTS Tab */}
      {activeTab === "CONTACTS" && (
        <div className="space-y-6" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Office Address" value={contactsForm.address} onChange={(v) => setContactsForm({ ...contactsForm, address: v })} />
              <TextInput label="Phone" value={contactsForm.phone} onChange={(v) => setContactsForm({ ...contactsForm, phone: v })} />
              <TextInput label="Email" value={contactsForm.email} onChange={(v) => setContactsForm({ ...contactsForm, email: v })} type="email" />
              <TextInput label="DepEd Hotline" value={contactsForm.depedHotline} onChange={(v) => setContactsForm({ ...contactsForm, depedHotline: v })} />
            </div>
            <div className="mt-4">
              <TextInput label="Office Hours" value={contactsForm.officeHours} onChange={(v) => setContactsForm({ ...contactsForm, officeHours: v })} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Map Embed</h2>
            <TextArea label="Google Maps Embed URL" value={contactsForm.mapUrl} onChange={(v) => setContactsForm({ ...contactsForm, mapUrl: v })} rows={2} />
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} className="bg-[#8B1010] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#6e0d0d] transition-colors cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* ADMISSION Tab */}
      {activeTab === "ADMISSION" && (
        <div className="space-y-6" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Requirements by Type</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextArea label="New Student (one per line)" value={admissionForm.newStudentReqs} onChange={(v) => setAdmissionForm({ ...admissionForm, newStudentReqs: v })} rows={5} />
              <TextArea label="Old Student (one per line)" value={admissionForm.oldStudentReqs} onChange={(v) => setAdmissionForm({ ...admissionForm, oldStudentReqs: v })} rows={5} />
              <TextArea label="Transferee (one per line)" value={admissionForm.transfereeReqs} onChange={(v) => setAdmissionForm({ ...admissionForm, transfereeReqs: v })} rows={5} />
              <TextArea label="Balik-Aral (one per line)" value={admissionForm.balikAralReqs} onChange={(v) => setAdmissionForm({ ...admissionForm, balikAralReqs: v })} rows={5} />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} className="bg-[#8B1010] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#6e0d0d] transition-colors cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* GLOBAL Tab */}
      {activeTab === "GLOBAL" && (
        <div className="space-y-6" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Header Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Division" value={globalForm.division} onChange={(v) => setGlobalForm({ ...globalForm, division: v })} />
              <TextInput label="Region" value={globalForm.region} onChange={(v) => setGlobalForm({ ...globalForm, region: v })} />
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Footer</h2>
            <TextInput label="Copyright Text" value={globalForm.footerCopyright} onChange={(v) => setGlobalForm({ ...globalForm, footerCopyright: v })} />
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Social Media</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <TextInput label="Facebook URL" value={globalForm.facebookUrl} onChange={(v) => setGlobalForm({ ...globalForm, facebookUrl: v })} />
              <TextInput label="Twitter URL" value={globalForm.twitterUrl} onChange={(v) => setGlobalForm({ ...globalForm, twitterUrl: v })} />
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSave} className="bg-[#8B1010] text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-[#6e0d0d] transition-colors cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}
