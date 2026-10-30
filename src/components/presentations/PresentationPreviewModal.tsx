"use client";

import { useState, useEffect } from "react";
import {
  X,
  Presentation,
  Download,
  CheckCircle2,
  Layers,
  Loader2,
  Info,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface SlideItem {
  slideNumber: number;
  title: string;
  summary: string;
  keyPoints?: string[];
}

export interface PresentationTemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnailPath: string;
  slides: SlideItem[];
  createdAt: string;
}

interface PresentationPreviewModalProps {
  template: PresentationTemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PresentationPreviewModal({
  template,
  isOpen,
  onClose,
}: PresentationPreviewModalProps) {
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Keyboard navigation (Escape, ArrowLeft, ArrowRight) & Scroll lock
  useEffect(() => {
    if (!isOpen || !template) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setSelectedSlideIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setSelectedSlideIndex((prev) => Math.min(template.slides.length - 1, prev + 1));
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, template, onClose]);

  // Reset slide index when opening a new template
  useEffect(() => {
    if (isOpen) {
      setSelectedSlideIndex(0);
      setDownloadSuccess(false);
    }
  }, [isOpen, template]);

  if (!isOpen || !template) return null;

  const currentSlide = template.slides[selectedSlideIndex] || template.slides[0];

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setDownloadSuccess(false);

      const downloadUrl = `/api/presentation-templates/${template.id}/download`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${template.name.replace(/\s+/g, "_")}.pptx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error("Error downloading presentation:", err);
      alert("Failed to download presentation file.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pres-preview-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 shadow-sm">
              <Presentation className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                  {template.category}
                </span>
                <span className="text-xs text-slate-400">
                  {template.slides.length} Slides &bull; 16:9 Widescreen
                </span>
              </div>
              <h2 id="pres-preview-title" className="text-lg font-bold text-slate-900 mt-0.5">
                {template.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close presentation preview"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body: Left Slide Carousel & Right Detail Viewer */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100/60 flex flex-col md:flex-row gap-6">
          {/* Left Column: Slide List Thumbnails */}
          <div className="w-full md:w-72 shrink-0 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-500 px-1">
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                <span>Slides ({template.slides.length})</span>
              </span>
              <span className="text-[10px] text-slate-400 lowercase">Use ← / → keys</span>
            </div>

            <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
              {template.slides.map((slide, idx) => {
                const isSelected = selectedSlideIndex === idx;
                return (
                  <button
                    key={slide.slideNumber}
                    type="button"
                    onClick={() => setSelectedSlideIndex(idx)}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 bg-white focus-visible:ring-2 focus-visible:ring-amber-500",
                      isSelected
                        ? "border-amber-500 ring-2 ring-amber-400/20 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div
                      className={cn(
                        "h-6 w-6 rounded-md flex items-center justify-center text-xs font-bold shrink-0",
                        isSelected
                          ? "bg-amber-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {slide.slideNumber}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {slide.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {slide.summary}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Slide Preview Display */}
          <div className="flex-1 flex flex-col justify-between space-y-4">
            {/* Slide Stage Canvas */}
            <div className="aspect-video w-full rounded-2xl bg-slate-900 text-white p-6 sm:p-10 flex flex-col justify-between shadow-lg border border-slate-800 relative overflow-hidden">
              <div className="relative z-10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                    <span>Slide {currentSlide.slideNumber} of {template.slides.length}</span>
                  </div>

                  {/* Navigation mini buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={selectedSlideIndex === 0}
                      onClick={() => setSelectedSlideIndex((p) => Math.max(0, p - 1))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
                      title="Previous Slide (←)"
                      aria-label="Previous Slide"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={selectedSlideIndex === template.slides.length - 1}
                      onClick={() => setSelectedSlideIndex((p) => Math.min(template.slides.length - 1, p + 1))}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 transition-colors"
                      title="Next Slide (→)"
                      aria-label="Next Slide"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white mt-1 leading-tight">
                  {currentSlide.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                  {currentSlide.summary}
                </p>
              </div>

              {currentSlide.keyPoints && currentSlide.keyPoints.length > 0 && (
                <div className="relative z-10 bg-slate-800/90 backdrop-blur-sm rounded-xl p-4 border border-slate-700/60 mt-4">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-2">
                    Key Slide Topics:
                  </h5>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200">
                    {currentSlide.keyPoints.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Decorative slide backdrop */}
              <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* Application Compatibility Notice */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 flex items-start gap-3 shadow-sm">
              <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-semibold text-slate-900">
                  Independent Master Copy &bull; Full Office Compatibility
                </p>
                <p className="text-slate-500 leading-relaxed">
                  Downloaded files are standard OpenXML (<code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">.pptx</code>) presentations. You can freely open and edit them in <strong>Microsoft PowerPoint</strong>, <strong>Google Slides</strong>, <strong>Apple Keynote</strong>, or <strong>LibreOffice Impress</strong>. The master template remains permanently immutable.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <div className="text-xs text-slate-500 hidden sm:flex items-center gap-1.5">
            {downloadSuccess && (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>File downloaded successfully! Ready to open in PowerPoint.</span>
              </span>
            )}
            {!downloadSuccess && (
              <span>Template file: {template.id}.pptx &bull; Real binary stream</span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Preparing PPTX...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download PPTX Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
