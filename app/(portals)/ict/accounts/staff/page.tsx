"use client";

import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";

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
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-all border-b border-gray-50 last:border-b-0 min-h-[40px] flex items-center cursor-pointer ${
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

const DEPARTMENTS = ["Library", "Registrar", "ICT", "Finance", "Guidance", "Clinic"];

type StaffAccount = {
  id: number;
  account_id: string;
  name: string;
  department: string;
  email: string;
  status: string;
};

export default function ICTStaff() {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [allStaff, setAllStaff] = useState<StaffAccount[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalFirstName, setModalFirstName] = useState("");
  const [modalLastName, setModalLastName] = useState("");
  const [modalEmail, setModalEmail] = useState("");
  const [modalDepartment, setModalDepartment] = useState("");
  const [modalPassword, setModalPassword] = useState("");
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  const [editModal, setEditModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffAccount | null>(null);
  const [editFirstName, setEditFirstName] = useState("");
  const [editLastName, setEditLastName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editDepartment, setEditDepartment] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/ict/staff-accounts");
      const data = await res.json();
      if (data.success) setAllStaff(data.staff);
    } catch { /* empty */ }
    setLoading(false);
  };

  useEffect(() => { fetchStaff(); }, []);

  useEffect(() => {
    if (showModal) {
      setModalFirstName("");
      setModalLastName("");
      setModalEmail("");
      setModalDepartment("");
      setModalPassword("");
      setModalError("");
    }
  }, [showModal]);

  const filtered = allStaff.filter(
    (a) =>
      (!search || a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.account_id.includes(search) ||
      a.email.toLowerCase().includes(search.toLowerCase())) &&
      (!departmentFilter || a.department === departmentFilter)
  );

  const handleCreate = async () => {
    if (!modalFirstName || !modalLastName || !modalEmail || !modalDepartment || !modalPassword) {
      setModalError("All fields are required");
      return;
    }
    setModalLoading(true);
    setModalError("");
    try {
      const res = await fetch("/api/ict/staff-accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: modalFirstName,
          lastName: modalLastName,
          email: modalEmail,
          department: modalDepartment,
          password: modalPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        fetchStaff();
        Swal.fire({ icon: "success", title: "Account Created", text: "Staff account has been created.", timer: 1500, showConfirmButton: false });
      } else {
        setModalError(data.error || "Failed to create account");
      }
    } catch {
      setModalError("Failed to create account");
    }
    setModalLoading(false);
  };

  const handleEdit = (staff: StaffAccount) => {
    setEditingStaff(staff);
    const nameParts = staff.name.split(" ");
    setEditFirstName(nameParts[0] || "");
    setEditLastName(nameParts.slice(1).join(" ") || "");
    setEditEmail(staff.email);
    setEditDepartment(staff.department);
    setEditPassword("");
    setEditError("");
    setEditModal(true);
  };

  const handleEditSave = async () => {
    if (!editFirstName.trim() || !editLastName.trim() || !editEmail.trim() || !editDepartment.trim()) {
      setEditError("All fields are required");
      return;
    }
    setEditLoading(true);
    setEditError("");
    try {
      const res = await fetch(`/api/ict/staff-accounts/${editingStaff!.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editFirstName.trim(),
          lastName: editLastName.trim(),
          email: editEmail.trim(),
          department: editDepartment.trim(),
          password: editPassword,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEditModal(false);
        setEditingStaff(null);
        fetchStaff();
        Swal.fire({ icon: "success", title: "Updated", text: "Staff account has been updated.", timer: 1500, showConfirmButton: false });
      } else {
        setEditError(data.error || "Failed to update");
      }
    } catch {
      setEditError("Network error");
    }
    setEditLoading(false);
  };

  const handleDelete = async (staff: StaffAccount) => {
    const result = await Swal.fire({
      title: "Delete Staff Account?",
      html: `Are you sure you want to delete <strong>${staff.name}</strong>?<br>This cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#8B1010",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`/api/ict/staff-accounts/${staff.id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchStaff();
        Swal.fire({ icon: "success", title: "Deleted", text: "Account has been deleted.", timer: 1500, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.error || "Failed to delete" });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Network error" });
    }
  };

  const handleBan = async (staff: StaffAccount) => {
    const isBanned = staff.status === "Banned";
    const action = isBanned ? "Unban" : "Ban";
    const result = await Swal.fire({
      title: `${action} Staff?`,
      html: `Are you sure you want to ${action.toLowerCase()} <strong>${staff.name}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: isBanned ? "#1E5631" : "#8B1010",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${action.toLowerCase()}`,
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`/api/ict/staff-accounts/${staff.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: isBanned ? "Active" : "Banned" }),
      });
      const data = await res.json();
      if (data.success) {
        fetchStaff();
        Swal.fire({ icon: "success", title: `${action}ned`, text: `Staff has been ${action.toLowerCase()}ned.`, timer: 1500, showConfirmButton: false });
      } else {
        Swal.fire({ icon: "error", title: "Error", text: data.error || `Failed to ${action.toLowerCase()}` });
      }
    } catch {
      Swal.fire({ icon: "error", title: "Error", text: "Network error" });
    }
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Staff</h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Manage staff accounts — {allStaff.length} total
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-[#8B1010] text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#6e0d0d] transition-colors flex items-center gap-2 self-start cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" x2="12" y1="5" y2="19" /><line x1="5" x2="19" y1="12" y2="12" />
            </svg>
            Add Staff
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
            className="w-full pl-9 pr-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all cursor-pointer"
          />
        </div>
        <div className="w-full sm:w-40">
          <CustomSelect
            label="Department"
            value={departmentFilter}
            onChange={setDepartmentFilter}
            placeholder="All"
            options={DEPARTMENTS.map(d => ({ value: d, label: d }))}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                <th className="hidden sm:table-cell px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-[11px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-400">Loading...</td></tr>
              ) : filtered.length > 0 ? filtered.map((account) => (
                <tr key={account.account_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-mono font-medium text-[#8B1010]">{account.account_id}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-800">{account.name}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-600">{account.department}</td>
                  <td className="hidden sm:table-cell px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-gray-500">{account.email}</td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <span
                      className={`inline-flex text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full ${
                        account.status === "Banned"
                          ? "bg-red-100 text-red-700"
                          : "bg-[#1E5631]/10 text-[#1E5631]"
                      }`}
                    >
                      {account.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(account)} className="text-[11px] sm:text-xs font-medium text-[#8B1010] hover:underline cursor-pointer">Edit</button>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => handleBan(account)} className={`text-[11px] sm:text-xs font-medium hover:underline cursor-pointer ${account.status === "Banned" ? "text-[#1E5631]" : "text-orange-600"}`}>
                        {account.status === "Banned" ? "Unban" : "Ban"}
                      </button>
                      <span className="text-gray-300">|</span>
                      <button onClick={() => handleDelete(account)} className="text-[11px] sm:text-xs font-medium text-red-600 hover:underline cursor-pointer">Delete</button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-400">
                    {allStaff.length === 0 && !search
                      ? "No staff accounts yet"
                      : `No staff found matching \u201c${search}\u201d`}
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
              <h2 className="text-lg font-bold text-gray-800">Add New Staff</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">First Name</label>
                  <input type="text" value={modalFirstName} onChange={(e) => setModalFirstName(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all cursor-pointer" />
                </div>
                <div>
                  <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Last Name</label>
                  <input type="text" value={modalLastName} onChange={(e) => setModalLastName(e.target.value)}
                    className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email</label>
                <input type="email" value={modalEmail} onChange={(e) => setModalEmail(e.target.value)}
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all cursor-pointer" />
              </div>
              <CustomSelect label="Department" value={modalDepartment} onChange={setModalDepartment} placeholder="Select department"
                options={DEPARTMENTS.map(d => ({ value: d, label: d }))} />
              <div>
                <label className="block text-[11px] sm:text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Password</label>
                <input type="password" value={modalPassword} onChange={(e) => setModalPassword(e.target.value)} placeholder="Minimum 6 characters"
                  className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all placeholder:text-gray-400 cursor-pointer" />
              </div>
              {modalError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-xs text-red-600">{modalError}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleCreate} disabled={modalLoading || !modalFirstName || !modalLastName || !modalEmail || !modalDepartment || !modalPassword}
                className="px-4 py-2 text-sm font-medium bg-[#8B1010] text-white rounded-lg hover:bg-[#6e0d0d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                {modalLoading ? "Creating..." : "Add Staff"}
              </button>
            </div>
          </div>
        </div>
      )}

      {editModal && editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ animation: "fadeIn 0.2s ease-out" }}>
          <div className="fixed inset-0 bg-black/50" style={{ animation: "fadeIn 0.2s ease-out" }} onClick={() => setEditModal(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto" style={{ animation: "modalIn 0.2s ease-out" }}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Edit Staff</h2>
              <button onClick={() => setEditModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="6" y1="6" y2="18" /><line x1="6" x2="18" y1="6" y2="18" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-4 space-y-4">
              {editError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">{editError}</div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">First Name</label>
                  <input type="text" value={editFirstName} onChange={(e) => setEditFirstName(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Last Name</label>
                  <input type="text" value={editLastName} onChange={(e) => setEditLastName(e.target.value)}
                    className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all cursor-pointer" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">Email</label>
                <input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all cursor-pointer" />
              </div>
              <CustomSelect label="Department" value={editDepartment} onChange={setEditDepartment} placeholder="Select department"
                options={DEPARTMENTS.map(d => ({ value: d, label: d }))} />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">New Password <span className="text-gray-400 normal-case">(leave blank to keep current)</span></label>
                <input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#8B1010] focus:ring-2 focus:ring-[#8B1010]/10 transition-all cursor-pointer" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
              <button onClick={() => setEditModal(false)} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleEditSave} disabled={editLoading}
                className="px-4 py-2 text-sm font-medium bg-[#8B1010] text-white rounded-lg hover:bg-[#6e0d0d] transition-colors disabled:opacity-50 cursor-pointer">
                {editLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
