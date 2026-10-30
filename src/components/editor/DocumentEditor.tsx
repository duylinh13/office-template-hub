"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
  Pilcrow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";

interface DocumentEditorProps {
  content: string;
  onChange: (html: string) => void;
  editable?: boolean;
}

export function DocumentEditor({
  content,
  onChange,
  editable = true,
}: DocumentEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: "Write your document content here...",
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose max-w-none focus:outline-none min-h-[550px] px-8 sm:px-14 py-12 leading-relaxed text-slate-800",
      },
    },
  });

  // Sync content if it changes externally
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  // Statistics: Word count, character count, and reading time
  const stats = useMemo(() => {
    if (!editor) return { words: 0, chars: 0, minutes: 1 };
    const text = editor.getText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return { words, chars, minutes };
  }, [editor?.getText()]);

  if (!editor) {
    return (
      <div className="min-h-[550px] flex items-center justify-center bg-white rounded-xl border border-slate-200">
        <div className="flex items-center gap-2.5 text-slate-400 text-sm font-medium">
          <div className="h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Initializing Tiptap rich-text editor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm flex flex-col">
      {/* Sticky Editor Toolbar */}
      {editable && (
        <div
          role="toolbar"
          aria-label="Rich-text editing tools"
          className="sticky top-16 md:top-[152px] z-20 flex flex-wrap items-center gap-1 px-4 py-2.5 bg-slate-50/95 backdrop-blur-md border-b border-slate-200 rounded-t-xl shadow-xs"
        >
          {/* Paragraph / Normal text */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={cn(
              "p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600",
              editor.isActive("paragraph") && !editor.isActive("heading") && "bg-slate-200/90 text-slate-900 font-bold"
            )}
            title="Normal Paragraph"
            aria-label="Normal text"
          >
            <Pilcrow className="h-4 w-4" />
          </button>

          {/* Headings */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn(
              "p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600",
              editor.isActive("heading", { level: 1 }) && "bg-blue-100 text-blue-700 font-bold"
            )}
            title="Heading 1"
            aria-label="Heading 1"
          >
            <Heading1 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn(
              "p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600",
              editor.isActive("heading", { level: 2 }) && "bg-blue-100 text-blue-700 font-bold"
            )}
            title="Heading 2"
            aria-label="Heading 2"
          >
            <Heading2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn(
              "p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600",
              editor.isActive("heading", { level: 3 }) && "bg-blue-100 text-blue-700 font-bold"
            )}
            title="Heading 3"
            aria-label="Heading 3"
          >
            <Heading3 className="h-4 w-4" />
          </button>

          <div className="h-5 w-[1px] bg-slate-300 mx-1" />

          {/* Text Formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn(
              "p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600",
              editor.isActive("bold") && "bg-blue-100 text-blue-700 font-bold"
            )}
            title="Bold (Ctrl+B)"
            aria-label="Toggle Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn(
              "p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600",
              editor.isActive("italic") && "bg-blue-100 text-blue-700 font-bold"
            )}
            title="Italic (Ctrl+I)"
            aria-label="Toggle Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={cn(
              "p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600",
              editor.isActive("strike") && "bg-blue-100 text-blue-700 font-bold"
            )}
            title="Strikethrough"
            aria-label="Toggle Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </button>

          <div className="h-5 w-[1px] bg-slate-300 mx-1" />

          {/* Lists & Quotes */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn(
              "p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600",
              editor.isActive("bulletList") && "bg-blue-100 text-blue-700 font-bold"
            )}
            title="Bulleted List"
            aria-label="Toggle Bulleted List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn(
              "p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600",
              editor.isActive("orderedList") && "bg-blue-100 text-blue-700 font-bold"
            )}
            title="Numbered List"
            aria-label="Toggle Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn(
              "p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600",
              editor.isActive("blockquote") && "bg-blue-100 text-blue-700 font-bold"
            )}
            title="Blockquote"
            aria-label="Toggle Blockquote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Horizontal Divider"
            aria-label="Insert Horizontal Divider"
          >
            <Minus className="h-4 w-4" />
          </button>

          <div className="h-5 w-[1px] bg-slate-300 mx-1" />

          {/* History Undo / Redo */}
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 disabled:opacity-30 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Undo (Ctrl+Z)"
            aria-label="Undo"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-2 rounded-lg text-slate-700 hover:bg-slate-200/80 disabled:opacity-30 transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            title="Redo (Ctrl+Y)"
            aria-label="Redo"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Editor Content Canvas styled like authentic office sheet */}
      <div className="bg-slate-100/70 p-4 sm:p-10 flex justify-center min-h-[650px]">
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-slate-200/90 min-h-[600px] transition-all">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Bottom Editor Status & Metrics Bar */}
      <div className="px-6 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <span>Words: <strong className="text-slate-800">{stats.words}</strong></span>
          <span>Characters: <strong className="text-slate-800">{stats.chars}</strong></span>
          <span>Est. Reading Time: <strong className="text-slate-800">{stats.minutes} min</strong></span>
        </div>

        <div className="text-slate-400">
          <span>Standard A4 / OpenXML DOCX Compatible</span>
        </div>
      </div>
    </div>
  );
}
