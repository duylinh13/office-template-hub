"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Presentation,
  Search,
  Filter,
  X,
  Sparkles,
  Download,
  Eye,
  Layers,
  Loader2,
  AlertCircle,
  Clock,
  BookOpen,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PresentationPreviewModal,
  PresentationTemplateItem,
} from "@/components/presentations/PresentationPreviewModal";

interface PresentationDraftItem {
  id: string;
  title: string;
  updatedAt: string;
  template?: {
    name: string;
    category: string;
  };
}

const presentationCategoryColorMap: Record<string, { bg: string; text: string; border: string }> = {
  "Startup & Investment": { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  "Corporate & Finance": { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  "Product & Marketing": { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
};

export default function PresentationsPage() {
  const [templates, setTemplates] = useState<PresentationTemplateItem[]>([]);
  const [drafts, setDrafts] = useState<PresentationDraftItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Slide Deck Preview Modal
  const [previewTemplate, setPreviewTemplate] = useState<PresentationTemplateItem | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Downloading map
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [resTemplates, resDrafts] = await Promise.all([
        fetch("/api/presentation-templates"),
        fetch("/api/presentations"),
      ]);

      const jsonTemplates = await resTemplates.json();
      const jsonDrafts = await resDrafts.json();

      if (jsonTemplates.success) {
        setTemplates(jsonTemplates.data);
      } else {
        throw new Error(jsonTemplates.error || "Failed to load presentation templates");
      }

      if (jsonDrafts.success) {
        setDrafts(jsonDrafts.data);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while loading presentations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Compute categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    templates.forEach((t) => set.add(t.category));
    return ["all", ...Array.from(set)];
  }, [templates]);

  // Filter templates locally
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;

      const matchesSearch =
        searchQuery.trim() === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  const handleDownloadPptx = async (template: PresentationTemplateItem) => {
    try {
      setDownloadingId(template.id);
      const downloadUrl = `/api/presentation-templates/${template.id}/download`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${template.name.replace(/\s+/g, "_")}.pptx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Create a draft record to track download history
      await fetch("/api/presentations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          title: `${template.name} (Downloaded Copy)`,
        }),
      });

      // Refresh drafts
      const resDrafts = await fetch("/api/presentations");
      const jsonDrafts = await resDrafts.json();
      if (jsonDrafts.success) setDrafts(jsonDrafts.data);
    } catch (err) {
      console.error(err);
      alert("Error initiating PPTX download.");
    } finally {
      setDownloadingId(null);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Product 2 &bull; Presentation Management</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Presentation Template Library
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Browse genuine multi-slide PowerPoint slide decks. Preview individual slides in each deck and download independent, editable PPTX copies.
          </p>
        </div>

        {/* Compatibility Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200/80 text-xs font-medium text-amber-900">
          <Info className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Editable in PowerPoint, Keynote &amp; Google Slides</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search presentation decks by title or keyword..."
            aria-label="Search presentation templates"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search input"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus-visible:ring-2 focus-visible:ring-amber-500 rounded p-0.5"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none" role="group" aria-label="Presentation Category Filters">
          <Filter className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block mr-1" />
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-amber-500",
                  isActive
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                )}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Filter Indicators */}
      {(searchQuery || selectedCategory !== "all") && (
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <div className="flex items-center gap-2">
            <span>Filtering by:</span>
            {selectedCategory !== "all" && (
              <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                {selectedCategory}
              </span>
            )}
            {searchQuery && (
              <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                &ldquo;{searchQuery}&rdquo;
              </span>
            )}
            <span>({filteredTemplates.length} matching)</span>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="text-amber-600 hover:underline font-semibold"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Main Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 animate-pulse"
            >
              <div className="w-full h-44 bg-slate-200 rounded-lg" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
              <div className="h-5 w-3/4 bg-slate-200 rounded" />
              <div className="h-4 w-full bg-slate-200 rounded" />
              <div className="pt-2 flex gap-2">
                <div className="h-9 flex-1 bg-slate-200 rounded" />
                <div className="h-9 flex-1 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center space-y-3">
          <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
          <h3 className="font-bold text-red-900">Failed to load presentation templates</h3>
          <p className="text-sm text-red-600 max-w-md mx-auto">{error}</p>
          <button
            type="button"
            onClick={fetchData}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="h-12 w-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-800 text-base">No matching presentations found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any presentation deck matching your current search or category filter.
            </p>
          </div>
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg text-sm font-semibold transition-colors border border-amber-200"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const isDownloading = downloadingId === template.id;
            const categoryStyle = presentationCategoryColorMap[template.category] || {
              bg: "bg-amber-50",
              text: "text-amber-700",
              border: "border-amber-200",
            };

            return (
              <div
                key={template.id}
                className="group bg-white rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Thumbnail */}
                  <div
                    onClick={() => {
                      setPreviewTemplate(template);
                      setIsPreviewOpen(true);
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setPreviewTemplate(template);
                        setIsPreviewOpen(true);
                      }
                    }}
                    aria-label={`Preview presentation: ${template.name}`}
                    className="relative h-48 w-full bg-slate-50 overflow-hidden cursor-pointer border-b border-slate-100 flex items-center justify-center group-hover:opacity-95 transition-opacity focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-inset"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={template.thumbnailPath}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Overlay Slide count badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-slate-900/85 text-white text-[11px] font-semibold backdrop-blur-sm shadow flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-amber-400" />
                      <span>{template.slides.length} Slides</span>
                    </div>

                    {/* Quick Preview Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-xs font-semibold backdrop-blur-sm shadow-md">
                        <Eye className="h-3.5 w-3.5" />
                        <span>Preview Slides</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                          categoryStyle.bg,
                          categoryStyle.text,
                          categoryStyle.border
                        )}
                      >
                        {template.category}
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        16:9 Deck
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-600 transition-colors line-clamp-1">
                      {template.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewTemplate(template);
                      setIsPreviewOpen(true);
                    }}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview Deck</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDownloadPptx(template)}
                    disabled={isDownloading}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-amber-500"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Downloading...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-3.5 w-3.5" />
                        <span>Download PPTX</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Existing Drafts Download History Section */}
      {drafts.length > 0 && (
        <div className="pt-8 border-t border-slate-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-500" />
                <span>Your Active Presentation Downloads &amp; Drafts</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Copies generated from master templates stored in SQLite.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 rounded-full text-slate-600">
              {drafts.length} copies
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>{draft.template?.category || "Presentation"}</span>
                    <span>{new Date(draft.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-semibold text-slate-900 text-sm line-clamp-1">
                    {draft.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Ready to edit in PowerPoint / Keynote
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={`/api/presentations/${draft.id}/export`}
                    download
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 focus-visible:ring-2 focus-visible:ring-amber-500 rounded"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Copy (.pptx)</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slide-by-slide Preview Modal */}
      <PresentationPreviewModal
        template={previewTemplate}
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setPreviewTemplate(null);
        }}
      />
    </div>
  );
}
