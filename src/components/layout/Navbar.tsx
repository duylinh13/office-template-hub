"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, Presentation, Sparkles, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Documents",
    href: "/documents",
    icon: FileText,
    badge: "DOCX",
  },
  {
    name: "Presentations",
    href: "/presentations",
    icon: Presentation,
    badge: "PPTX",
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Desktop Nav */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="flex items-center gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1"
              aria-label="Office Template Hub Home"
            >
              <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                <Sparkles className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <span className="font-bold text-base text-slate-900 tracking-tight block leading-tight">
                  Office Template Hub
                </span>
                <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase block">
                  Enterprise MVP
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-slate-100 text-slate-900 font-semibold shadow-sm"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    )}
                  >
                    <Icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-slate-400")} />
                    <span>{item.name}</span>
                    <span
                      className={cn(
                        "text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide",
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {item.badge}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Status Badge */}
          <div className="flex items-center gap-3">
            <div
              className="hidden sm:inline-flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200"
              title="SQLite local persistence with Prisma ORM"
            >
              <Database className="h-3.5 w-3.5 text-emerald-600" />
              <span>SQLite Active</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden border-t border-slate-200/80 bg-white px-4 py-2 flex items-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition-colors",
                isActive
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
            >
              <Icon className={cn("h-4 w-4", isActive ? "text-blue-600" : "text-slate-400")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
