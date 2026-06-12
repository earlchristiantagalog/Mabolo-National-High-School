import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enroll - Mabolo National High School",
  description: "Online enrollment for Mabolo National High School. Complete the Basic Education Enrollment Form for SY 2026-2027.",
};

export default function EnrollLayout({ children }: { children: React.ReactNode }) {
  return children;
}
