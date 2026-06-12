import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Mabolo National High School",
  description: "Learn more about Mabolo National High School, its history, mission, and commitment to quality education.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
