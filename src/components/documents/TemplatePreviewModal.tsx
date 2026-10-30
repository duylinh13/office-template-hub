"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, Sparkles, FileText, ArrowRight, Loader2, Info } from "lucide-react";

export interface TemplateItem {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnailPath: string;
  content: string;
  createdAt: string;
}

interface TemplatePreviewModalProps {
  template: TemplateItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePreviewModal({
  template,
  isOpen,
  onClose,
}: TemplatePreviewModalProps) {
  const router = useRouter();
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);

  // Close on Escape & Lock body scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !template) return null;

  const handleUseTemplate = async () => {
    try {
      setIsCreatingDraft(true);
      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          title: `${template.name} (My Draft)`,
        }),
      });

      const json = await res.json();
      if (json.success && json.data?.id) {
        router.push(`/documents/${json.data.id}`);
      } else {
        alert(json.error || "Failed to create document draft");
        setIsCreatingDraft(false);
      }
    } catch (err) {
      console.error("Error creating draft:", err);
      alert("Network error occurred while creating draft.");
      setIsCreatingDraft(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="template-preview-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/90">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide">
                  {template.category}
                </span>
                <span className="text-xs text-slate-400">Template Preview</span>
              </div>
              <h2 id="template-preview-title" className="text-lg font-bold text-slate-900 mt-0.5">
                {template.name}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview modal"
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-100/60">
          <div className="mb-6 p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 text-sm text-slate-700 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-semibold text-slate-900">{template.description}</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Clicking &ldquo;Use This Template&rdquo; creates an independent draft in SQLite. The original master template file remains strictly immutable.
              </p>
            </div>
          </div>

          {/* Document Canvas Preview */}
          <div className="bg-white rounded-xl p-8 sm:p-12 shadow-sm border border-slate-200">
            <div
              className="prose max-w-none text-slate-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: template.content }}
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-white">
          <div className="text-xs text-slate-500 hidden sm:block">
            <span>Supports heading levels, styled lists, tables, and native DOCX export.</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleUseTemplate}
              disabled={isCreatingDraft}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              {isCreatingDraft ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating Draft...</span>
                </>
              ) : (
                <>
                  <span>Use This Template</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
