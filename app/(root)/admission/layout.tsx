import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admission - Mabolo National High School",
  description: "Information about admission requirements, enrollment process, and requirements at Mabolo National High School.",
};

export default function AdmissionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
