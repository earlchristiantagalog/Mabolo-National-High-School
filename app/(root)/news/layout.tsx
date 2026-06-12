import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News - Mabolo National High School",
  description: "Latest news, announcements, and updates from Mabolo National High School.",
};

export default function NewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
