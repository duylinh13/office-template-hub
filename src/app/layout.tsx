import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Office Template Hub | Recruitment Take-Home MVP",
  description: "Enterprise Document & Presentation Template Library with built-in editors and real file export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>Office Template Hub &copy; 2026 &mdash; Take-home recruitment evaluation MVP.</p>
            <p className="text-slate-400">Next.js App Router &bull; SQLite &bull; Tiptap &bull; docx &bull; pptxgenjs</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
