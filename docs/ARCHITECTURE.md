# Architecture Documentation: Office Template Hub

This document details the architectural design, module boundaries, data flow, persistence models, and security principles for **Office Template Hub**.

---

## 1. System Overview

```
                                  +---------------------------------------+
                                  |            Next.js App Router         |
                                  |              (Node.js Runtime)        |
                                  +---------------------------------------+
                                                     |
                 +-----------------------------------+-----------------------------------+
                 |                                                                       |
                 v                                                                       v
     [Client UI Layer (React)]                                              [Server Route Handlers (API)]
  - Landing Page (`/`)                                                   - `/api/document-templates`
  - Document Library (`/documents`)                                      - `/api/documents`
  - Document Editor (`/documents/[id]`)                                  - `/api/documents/[id]/export`
  - Presentation Library (`/presentations`)                              - `/api/presentation-templates`
  - Tiptap Toolbar & ProseMirror Engine                                  - `/api/presentation-templates/[id]/download`
                 |                                                                       |
                 +-----------------------------------+-----------------------------------+
                                                     |
                                                     v
                                  +---------------------------------------+
                                  |           Core Data & Storage         |
                                  +---------------------------------------+
                                  | - SQLite Database (`prisma/dev.db`)   |
                                  | - Prisma ORM (`src/lib/db.ts`)        |
                                  | - Template Assets (`templates/`)      |
                                  | - Preview Thumbnails (`public/`)      |
                                  +---------------------------------------+
```

Office Template Hub is constructed as a modern, unified Next.js App Router application running on the Node.js runtime. It eliminates the operational complexity of managing separate frontend and backend deployments while strictly enforcing module boundaries and data isolation.

---

## 2. Module Boundaries & Directory Structure

```
d:\New folder\test\
├── docs/                             # Technical handover and architecture specifications
│   ├── API.md                        # Complete REST API documentation
│   └── ARCHITECTURE.md               # Architecture, domain boundaries, and data design
├── prisma/
│   ├── dev.db                        # SQLite local relational database
│   ├── schema.prisma                 # Prisma schema definition
│   └── seed.js                       # Seed script initializing 5 document + 3 presentation templates
├── public/
│   └── thumbnails/                   # Responsive SVG preview thumbnails
│       ├── documents/                # Visual cards for 5 document templates
│       └── presentations/            # Visual cards for 3 presentation decks
├── templates/                        # Immutable reference template assets
│   ├── documents/                    # Reference HTML document templates
│   └── presentations/                # Genuine OpenXML PPTX files (~70-78 KB each)
├── src/
│   ├── app/                          # Next.js App Router hierarchy
│   │   ├── layout.tsx                # Root HTML shell with responsive global Navbar
│   │   ├── page.tsx                  # Application landing page & quick links
│   │   ├── globals.css               # Design tokens, typography, and Tiptap styles
│   │   ├── documents/
│   │   │   ├── page.tsx              # Document Template Library catalog
│   │   │   └── [id]/page.tsx         # Document Editor page with auto-save & export
│   │   ├── presentations/
│   │   │   └── page.tsx              # Presentation Template Library with slide inspector
│   │   └── api/                      # Node.js Server Route Handlers
│   │       ├── document-templates/   # Catalog listing & single template lookup
│   │       ├── documents/            # Draft creation, retrieval, updates, and DOCX export
│   │       ├── presentation-templates/ # Presentation catalog & direct master download
│   │       └── presentations/        # Presentation draft tracking and export
│   ├── components/
│   │   ├── layout/Navbar.tsx         # Responsive application header with active route states
│   │   ├── documents/
│   │   │   └── TemplatePreviewModal.tsx # Document inspection modal with scroll-lock
│   │   ├── presentations/
│   │   │   └── PresentationPreviewModal.tsx # Slide inspector with carousel & arrow keys
│   │   └── editor/
│   │       └── DocumentEditor.tsx    # Tiptap WYSIWYG editor with word count & status indicator
│   ├── lib/
│   │   ├── db.ts                     # PrismaClient singleton with connection pooling
│   │   ├── docx-export.ts            # HTML-to-OpenXML `.docx` binary generation engine
│   │   └── utils.ts                  # Class merging (`clsx` + `tailwind-merge`)
│   ├── types/
│   │   └── next.d.ts                 # TypeScript type declarations
│   └── __tests__/                    # Vitest automated test suite
│       ├── smoke.test.ts             # Health check & database verification
│       ├── documents.test.ts         # Document catalog, draft isolation, and export tests
│       └── presentations.test.ts     # Presentation catalog, download headers, and security tests
├── package.json                      # Dependency manifest and scripts
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # Strict TypeScript configuration
└── vitest.config.ts                  # Vitest configuration with `@/` path aliasing
```

---

## 3. Prisma Data Models & Relationships

The database is built on SQLite via Prisma ORM (`prisma/schema.prisma`):

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Template {
  id            String   @id @default(cuid())
  type          String   @default("DOCUMENT") // "DOCUMENT" | "PRESENTATION"
  name          String
  category      String
  description   String
  thumbnailPath String
  filePath      String?
  content       String   // HTML or structured template initial content
  slides        String?  // JSON slides for presentation templates
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  drafts        Draft[]

  @@index([type])
  @@index([category])
  @@index([name])
}

model Draft {
  id          String    @id @default(cuid())
  templateId  String?
  template    Template? @relation(fields: [templateId], references: [id], onDelete: SetNull)
  type        String    @default("DOCUMENT") // "DOCUMENT" | "PRESENTATION"
  title       String
  content     String    // HTML or JSON content of the draft document
  slides      String?   // JSON slides for presentation drafts
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@index([type])
}
```

### Relationship Design
- **Template to Draft (`1 : N`)**: A single `Template` can be the parent origin for multiple user `Draft` records.
- **Referential Integrity**: The relationship specifies `onDelete: SetNull`. If a master template is archived or removed from the catalog, existing user drafts remain intact with `templateId: null`.

---

## 4. Draft Isolation & Template Immutability

A critical requirement of the system is that **master templates must remain completely immutable**.

### Isolation Architecture

```
User selects "Use Template" [Template ID: doc-tmpl-01]
               │
               ▼
     POST /api/documents
               │
               ▼
     +────────────────────────────────────────────────────────+
     | 1. Read master Template record from SQLite             |
     | 2. Clone `content` string into memory                  |
     | 3. Generate a brand new unique CUID for Draft          |
     | 4. INSERT into `Draft` table:                          |
     |      id: "clxxxxxx..."                                 |
     |      templateId: "doc-tmpl-01"                         |
     |      title: "Standard Employment Contract (Draft)"     |
     |      content: cloned_master_content                    |
     +────────────────────────────────────────────────────────+
               │
               ▼
  Redirects user to: /documents/clxxxxxx...
               │
               ▼
  User edits content in Tiptap
               │
               ▼
     PATCH /api/documents/clxxxxxx...
               │
               ▼
     Updates ONLY `Draft` row where id == "clxxxxxx..."
     [Template doc-tmpl-01 is NEVER touched]
```

1. **Database Immutability**: All save operations executed in the editor target `db.draft.update({ where: { id } })`. There are no write routes exposing updates to the `Template` table.
2. **Filesystem Immutability**: Master `.pptx` and `.html` files reside in `templates/documents/` and `templates/presentations/`. When a user downloads a presentation, the file is read as a binary stream and transmitted directly with attachment headers without disk mutation.
3. **Automated Verification**: Vitest test `creating a draft should not mutate the master template` asserts that the master template's `updatedAt`, `content`, and record fields remain identical before and after draft creation and editing.

---

## 5. Rich-Text Editing & Document Export Pipeline

```
  +-------------------------------------------------------------+
  |                   Tiptap Client Editor                      |
  |  - ProseMirror schema with StarterKit extensions            |
  |  - Toolbar actions (H1-H3, Bold, Italic, Strikethrough,     |
  |    Bullet Lists, Numbered Lists, Blockquotes, Rules)        |
  |  - Debounced auto-save & manual `Ctrl+S` shortcut           |
  |  - Unsaved change protection (`window.onbeforeunload`)      |
  +-------------------------------------------------------------+
                                │
                        HTML/Text Payload
                                │
                                ▼
                   PATCH /api/documents/[id]
                                │
                                ▼
                       SQLite `Draft` Row
                                │
        User clicks "Export DOCX" (GET /api/documents/[id]/export)
                                │
                                ▼
  +-------------------------------------------------------------+
  |              HTML-to-OpenXML Converter Engine               |
  |                  (`src/lib/docx-export.ts`)                 |
  +-------------------------------------------------------------+
  | 1. Sanitize HTML tags into structured DOM tokens.           |
  | 2. Map `<h1>`, `<h2>`, `<h3>` to OpenXML Heading levels.    |
  | 3. Parse inline text segments into `TextRun` objects with   |
  |    exact bold, italics, and strike styles.                  |
  | 4. Transform `<ul><li>` and `<ol><li>` into OpenXML bullet  |
  |    and numbered lists with proper indentation.              |
  | 5. Transform `<blockquote>` into indented, styled sections.  |
  | 6. Assemble into `docx.Document` with Arial typography and  |
  |    1.15 line spacing.                                       |
  | 7. Pack into OpenXML `.docx` buffer via `Packer.toBuffer()`.|
  +-------------------------------------------------------------+
                                │
                                ▼
                Direct Binary Download to Browser
    `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`
    `Content-Disposition: attachment; filename="[Draft-Title].docx"`
```

---

## 6. Security & Safe Server-Side File Handling

1. **Path Traversal Prevention**:
   The presentation download endpoint (`/api/presentation-templates/[id]/download`) verifies that the requested template ID matches a valid database record and computes the absolute path using `path.resolve(process.cwd(), template.filePath)`. It asserts that the resolved path strictly starts with the expected base directory (`templates/presentations`). Any attempt to pass relative navigation paths (`../`, `..\`) is rejected with HTTP 400/404.
2. **Strict Request Validation**:
   All mutation endpoints validate request bodies using **Zod** schemas. Malformed JSON or unexpected fields are rejected with HTTP 400 and structured error arrays before reaching database operations.
3. **No Unsanitized File Paths Exposed**:
   API responses return public asset paths (e.g. `/thumbnails/documents/contract.svg`) rather than internal server filesystem paths (`d:\New folder\...`).
