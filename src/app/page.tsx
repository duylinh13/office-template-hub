import Link from "next/link";
import {
  FileText,
  Presentation,
  ArrowRight,
  ShieldCheck,
  Download,
  Edit3,
  Sparkles,
  Database,
  Lock,
  Layers,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <div className="relative rounded-2xl bg-white border border-slate-200/90 p-8 sm:p-12 shadow-sm overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>Senior Recruitment Take-Home MVP</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Enterprise Office Template Hub
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
            A unified workspace for discovering, previewing, and authoring documents and presentations.
            Edits produce independent draft copies &mdash; original master templates remain strictly immutable.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/documents"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span>Explore Documents</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/presentations"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-sm transition-colors border border-slate-200"
            >
              <span>Explore Presentations</span>
              <ArrowRight className="h-4 w-4 text-slate-500" />
            </Link>
          </div>
        </div>

        {/* Decorative subtle gradient background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none" />
      </div>

      {/* Two Core Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Module 1: Document Template Library */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <FileText className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                Product 1 &bull; DOCX
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Document Template Library
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Word-style templates for contracts, proposals, and administrative requests with built-in Tiptap editor.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>5 Curated Templates</strong> with instant category and keyword filtering</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>Tiptap Rich-Text Editor</strong> supporting Headings, Bold, Lists, Tables</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>Native OpenXML Export</strong> streams real <code>.docx</code> binaries</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/documents"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <span>Browse Document Library</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Module 2: Presentation Template Library */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:border-amber-300 transition-all flex flex-col justify-between">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                <Presentation className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                Product 2 &bull; PPTX
              </span>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                Presentation Template Library
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Professional PowerPoint decks for investor pitches, quarterly reviews, and product keynotes.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>3 Multi-Slide Presentations</strong> with distinct visual styles (Dark, Navy, Purple)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>Slide-by-Slide Viewer</strong> to inspect titles, layouts, and talking points</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span><strong>Genuine PPTX Downloads</strong> editable in PowerPoint, Keynote &amp; Google Slides</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <Link
              href="/presentations"
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              <span>Browse Presentation Library</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Architectural Guarantees Footer Strip */}
      <div className="rounded-xl bg-slate-100/70 border border-slate-200 p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
          Architectural Principles &amp; Guarantees
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <Lock className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Strict Immutability</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Master templates are read-only. Editing or downloading creates isolated copies in SQLite.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Download className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Genuine Binary Files</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                No simulated downloads. Generates compliant OpenXML DOCX and PPTX archives.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-slate-900">Local SQLite Storage</h4>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                Zero external cloud dependencies. Works completely offline with Prisma ORM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
