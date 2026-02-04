import "./globals.css";
import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "PostPal",
  description: "Turn viral videos into repeatable blueprints.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        <Header />
        <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
