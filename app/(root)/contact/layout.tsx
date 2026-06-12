import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Mabolo National High School",
  description: "Get in touch with Mabolo National High School. Find our address, phone number, and email for inquiries.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
