"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DocumentEditor } from "@/components/editor/DocumentEditor";

type SaveStatus = "idle" | "saving" | "saved" | "unsaved" | "error";

interface DraftData {
  id: string;
  templateId?: string | null;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  template?: {
    name: string;
    category: string;
  };
}

export default function DocumentEditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [draft, setDraft] = useState<DraftData | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch draft data from API
  const fetchDraft = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/documents/${id}`);
      if (res.status === 404) {
        setNotFound(true);
        setIsLoading(false);
        return;
      }

      const json = await res.json();
      if (json.success && json.data) {
        setDraft(json.data);
        setTitle(json.data.title);
        setContent(json.data.content);
        setSaveStatus("saved");
      } else {
        setErrorMessage(json.error || "Failed to load document");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Network error loading document");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchDraft();
    }
  }, [id, fetchDraft]);

  // Handle saving content to SQLite via PATCH /api/documents/[id]
  const handleSave = async (customContent?: string, customTitle?: string) => {
    try {
      setSaveStatus("saving");
      setErrorMessage("");

      const payload = {
        title: customTitle !== undefined ? customTitle : title,
        content: customContent !== undefined ? customContent : content,
      };

      const res = await fetch(`/api/documents/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setDraft(json.data);
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
        setErrorMessage(json.error || "Failed to save draft");
      }
    } catch (err: any) {
      console.error(err);
      setSaveStatus("error");
      setErrorMessage("Network error while saving");
    }
  };

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [title, content]);

  // Prevent accidental loss of unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (saveStatus === "unsaved") {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveStatus]);

  // Handle Export DOCX
  const handleExportDocx = async () => {
    try {
      setIsExporting(true);
      await handleSave();

      const downloadUrl = `/api/documents/${id}/export`;
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `${title.replace(/\s+/g, "_") || "document"}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Error occurred while generating DOCX file.");
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Delete Draft
  const handleDeleteDraft = async () => {
    if (!confirm("Are you sure you want to delete this document draft?")) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        router.push("/documents");
      } else {
        alert(json.error || "Failed to delete draft");
        setIsDeleting(false);
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting draft");
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Loading document editor &amp; draft data...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm my-12">
        <div className="h-14 w-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Document Draft Not Found</h2>
        <p className="text-sm text-slate-500">
          The requested document draft ID (<code className="font-mono text-xs bg-slate-100 px-1 py-0.5 rounded">{id}</code>) does not exist in the database or may have been deleted.
        </p>
        <Link
          href="/documents"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Document Templates</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action & Navigation Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/90 shadow-sm">
        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Back to Template Library"
            aria-label="Back to Template Library"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="h-6 w-[1px] bg-slate-200" />

          {/* Editable Title */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSaveStatus("unsaved");
              }}
              placeholder="Document Title"
              aria-label="Document Title"
              className="w-full text-lg font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none transition-colors px-1 py-0.5"
            />
            <div className="flex items-center gap-2 text-xs text-slate-400 px-1 mt-0.5">
              <span>Template: {draft?.template?.name || "Blank Document"}</span>
              <span>&bull;</span>
              <span>Draft ID: {id.slice(0, 8)}...</span>
            </div>
          </div>
        </div>

        {/* Right Status & Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 self-end md:self-auto">
          {/* Save Status Indicator */}
          <div className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full border bg-slate-50">
            {saveStatus === "saving" && (
              <span className="text-blue-600 flex items-center gap-1.5 font-medium">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving to SQLite...</span>
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="text-emerald-700 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span>Saved</span>
              </span>
            )}
            {saveStatus === "unsaved" && (
              <span className="text-amber-700 flex items-center gap-1.5 font-medium">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Unsaved changes (Ctrl+S)</span>
              </span>
            )}
            {saveStatus === "error" && (
              <span className="text-red-700 flex items-center gap-1.5 font-medium">
                <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                <span>Save failed</span>
              </span>
            )}
            {saveStatus === "idle" && (
              <span className="text-slate-500">Ready</span>
            )}
          </div>

          {/* Delete Draft Button */}
          <button
            type="button"
            onClick={handleDeleteDraft}
            disabled={isDeleting}
            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors focus-visible:ring-2 focus-visible:ring-red-500"
            title="Delete this draft"
            aria-label="Delete draft"
          >
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin text-red-600" /> : <Trash2 className="h-4 w-4" />}
          </button>

          {/* Manual Save Button */}
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saveStatus === "saving"}
            className={cn(
              "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm focus-visible:ring-2 focus-visible:ring-blue-600",
              saveStatus === "unsaved"
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-slate-100 hover:bg-slate-200 text-slate-700"
            )}
          >
            {saveStatus === "saving" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save</span>
          </button>

          {/* Real DOCX Export Button */}
          <button
            type="button"
            onClick={handleExportDocx}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-emerald-600"
            title="Download formatted OpenXML DOCX file"
          >
            {isExporting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Download className="h-3.5 w-3.5" />
            )}
            <span>Export DOCX</span>
          </button>
        </div>
      </div>

      {/* Rich-Text Tiptap Editor Canvas */}
      <DocumentEditor
        content={content}
        onChange={(newHtml) => {
          setContent(newHtml);
          setSaveStatus("unsaved");
        }}
      />
    </div>
  );
}
