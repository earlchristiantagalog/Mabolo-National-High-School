import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Programs - Mabolo National High School",
  description: "Academic programs offered at Mabolo National High School including K-12 curriculum and Senior High School tracks.",
};

export default function ProgramsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
