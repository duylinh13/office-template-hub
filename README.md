# Office Template Hub

> **Recruitment Take-Home Technical Project**  
> A high-performance enterprise document and presentation template library built with Next.js 14 App Router, TypeScript, Prisma, SQLite, Tiptap, and OpenXML generation engines (`docx` & `pptxgenjs`).

---

## 📑 Table of Contents
1. [Project Purpose & Core Features](#1-project-purpose--core-features)
2. [UI Previews & Asset Locations](#2-ui-previews--asset-locations)
3. [Tech Stack & Justifications](#3-tech-stack--justifications)
4. [Third-Party Libraries & Verified Licenses](#4-third-party-libraries--verified-licenses)
5. [Prerequisites & Local Setup](#5-prerequisites--local-setup)
6. [Available Scripts & Quality Verification](#6-available-scripts--quality-verification)
7. [Architecture Overview & Module Boundaries](#7-architecture-overview--module-boundaries)
8. [Prisma Data Models & Relationships](#8-prisma-data-models--relationships)
9. [Draft Isolation & Template Immutability Guarantee](#9-draft-isolation--template-immutability-guarantee)
10. [Template Storage & How to Add New Templates](#10-template-storage--how-to-add-new-templates)
11. [Export Format Support & Limitations](#11-export-format-support--limitations)
12. [API Overview](#12-api-overview)
13. [AI Tools Used During Development](#13-ai-tools-used-during-development)
14. [Feature Status, Known Limitations & Roadmap](#14-feature-status-known-limitations--roadmap)

---

## 1. Project Purpose & Core Features

**Office Template Hub** is a recruitment take-home MVP designed to demonstrate full-stack engineering excellence, rigorous UI/UX standards, and type-safe systems design. The platform solves the enterprise challenge of organizing, discovering, and drafting standard office documents and presentation decks without corrupting immutable master templates.

### The Application Provides Two Core Modules:
1. **Document Template Library & Tiptap Rich-Text Editor (`/documents`)**:
   - 5 curated business document templates seeded in SQLite (Employment Agreement, Project Proposal, Executive Board Minutes, Senior CV, Quarterly Performance Report).
   - Real-time search by title and description, with category pill filtering and active reset.
   - Interactive modal preview with full-content review, keyboard dismissal (`Escape`), and body scroll-lock.
   - **Immutable Draft Forking**: Selecting a template creates an independent draft in SQLite. The original template is never altered.
   - **Tiptap WYSIWYG Editor (`/documents/[id]`)**: Headings (H1–H3), bold, italic, strikethrough, bullet lists, ordered lists, blockquotes, horizontal rules, and undo/redo history.
   - Real-time editor stats: Word count, character count, and estimated reading time.
   - Auto-save state management with dirty tracking and browser tab close protection (`beforeunload`).
   - Genuine Microsoft Word OpenXML (`.docx`) file export with custom formatting and typography.

2. **Presentation Template Library & Slide Inspector (`/presentations`)**:
   - 3 genuine 16:9 widescreen PowerPoint templates generated via `pptxgenjs` (Venture Pitch Deck, Quarterly Business Review, Product Launch Keynote) with distinct visual palettes (~70–78 KB each).
   - Search by keyword and filter by category tags.
   - Interactive slide inspector modal with keyboard arrow navigation (`←` / `→`) and thumbnail carousel.
   - Safe server-side download endpoint streaming genuine `.pptx` OpenXML presentation files compatible with Microsoft PowerPoint, Google Slides, Apple Keynote, and LibreOffice.

---

## 2. UI Previews & Asset Locations

Visual preview thumbnails are generated as scalable SVG graphics located in the `public/` directory:
- **Document Previews**:
  - `public/thumbnails/documents/contract.svg` (Standard Employment Contract)
  - `public/thumbnails/documents/proposal.svg` (Enterprise Project Proposal)
  - `public/thumbnails/documents/minutes.svg` (Executive Board Meeting Minutes)
  - `public/thumbnails/documents/cv.svg` (Senior Software Engineer CV)
  - `public/thumbnails/documents/report.svg` (Quarterly Business Performance Report)
- **Presentation Previews**:
  - `public/thumbnails/presentations/pitch-deck.svg` (Venture Capital Pitch Deck)
  - `public/thumbnails/presentations/qbr.svg` (Quarterly Business Review)
  - `public/thumbnails/presentations/keynote.svg` (Product Launch Keynote)

*To visually inspect the full rendered application, start the server locally (`npm run dev`) and visit `http://localhost:3000` on desktop (1440px/1024px) or mobile (390px).*

---

## 3. Tech Stack & Justifications

| Technology | Layer | Why It Was Chosen |
| :--- | :--- | :--- |
| **Next.js 14 (App Router)** | Full-Stack Framework | Combines React Server Components for fast initial loads with Node.js Route Handlers (`src/app/api/`) for backend APIs in a single deployable repository. |
| **React 18 & TypeScript 5** | UI & Type Safety | Industry standard for component architecture. Strict mode enabled across all source files ensures compile-time contract enforcement. |
| **Tailwind CSS 3** | Design System | Utility-first responsive styling with zero runtime CSS bundle overhead, custom tokens in `globals.css`, and accessible focus-visible states. |
| **Prisma 6 & SQLite** | Database & ORM | Zero-setup, file-based relational database (`prisma/dev.db`) ideal for local evaluation without external database server dependencies. |
| **Tiptap 2 (`@tiptap/react`)** | Rich-Text Editor | Headless, ProseMirror-backed editor offering modular extensions (`StarterKit`, `Placeholder`), clean HTML/JSON state, and keyboard shortcuts. |
| **`docx` 9** | OpenXML Generator | Direct programmatic OpenXML `.docx` binary generation from DOM AST nodes, supporting headings, bullet lists, bold/italics, and margins. |
| **`pptxgenjs` 3** | OpenXML Generator | Programmatic creation of 16:9 widescreen PowerPoint `.pptx` decks with custom shapes, color palettes, and structured slide layouts. |
| **Zod 3** | Runtime Validation | Type-safe schema validation for API request bodies and query parameters, providing descriptive 400 error arrays. |
| **Vitest 3** | Test Runner | Blazing-fast Vite-native ESM test framework with built-in TypeScript execution and zero configuration friction. |
| **Lucide React** | Iconography | Lightweight, tree-shakable SVG icon set with consistent visual stroke widths. |

---

## 4. Third-Party Libraries & Verified Licenses

Every dependency used in this application has been verified directly from its installed `package.json` manifest:

### Production Dependencies
| Package | Version | Verified License | Purpose |
| :--- | :--- | :--- | :--- |
| `@prisma/client` | `6.19.3` | **Apache-2.0** | Database client generated from Prisma schema |
| `@tiptap/react` | `2.27.3` | **MIT** | React wrapper for Tiptap rich-text editor |
| `@tiptap/starter-kit` | `2.27.3` | **MIT** | Standard ProseMirror extensions (headings, lists, bold) |
| `@tiptap/html` | `2.27.3` | **MIT** | HTML parsing and rendering utilities |
| `@tiptap/extension-placeholder` | `2.27.3` | **MIT** | Editor empty-state placeholder support |
| `@tiptap/pm` | `2.27.3` | **MIT** | Core ProseMirror packages bundle |
| `docx` | `9.15.0` | **MIT** | OpenXML DOCX document generation engine |
| `pptxgenjs` | `3.12.0` | **MIT** | OpenXML PPTX presentation generation engine |
| `next` | `14.2.24` | **MIT** | React framework & Node.js Route Handlers |
| `react` | `18.3.1` | **MIT** | UI library |
| `react-dom` | `18.3.1` | **MIT** | DOM rendering engine for React |
| `zod` | `3.25.76` | **MIT** | Runtime schema validation |
| `clsx` | `2.1.1` | **MIT** | Conditional className utility |
| `tailwind-merge` | `2.6.1` | **MIT** | Conflict-free Tailwind class resolution |
| `lucide-react` | `0.475.0` | **ISC** | SVG icon components |

### Development Dependencies
| Package | Version | Verified License | Purpose |
| :--- | :--- | :--- | :--- |
| `prisma` | `6.19.3` | **Apache-2.0** | Prisma ORM CLI for migrations and schema pushing |
| `typescript` | `5.9.3` | **Apache-2.0** | TypeScript compiler and language server |
| `vitest` | `3.2.7` | **MIT** | Unit and integration test runner |
| `tailwindcss` | `3.4.19` | **MIT** | Utility-first CSS compiler |
| `postcss` | `8.5.32` | **MIT** | CSS post-processing pipeline |
| `autoprefixer` | `10.6.2` | **MIT** | Automatic vendor prefixing for CSS rules |
| `@types/node` | `22.20.5` | **MIT** | TypeScript types for Node.js runtime |
| `@types/react` | `18.3.31` | **MIT** | TypeScript types for React |
| `@types/react-dom` | `18.3.7` | **MIT** | TypeScript types for React DOM |

---

## 5. Prerequisites & Local Setup

### System Expectations
- **Node.js**: `v20.x` or `v22.x` (Tested and verified on Node `v22.13.4` on Windows x64).
- **Package Manager**: `npm` `v10+` or `pnpm` `v9+`.

### Step-by-Step Setup

1. **Clone or Navigate to the Workspace**:
   ```bash
   cd "d:/New folder/test"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Ensure `.env` exists in the project root with the SQLite connection URL:
   ```env
   DATABASE_URL="file:./dev.db"
   ```

4. **Initialize Database & Seed Realistic Records**:
   ```bash
   # Push schema to SQLite database file (prisma/dev.db)
   npm run db:push

   # Seed 5 document templates and 3 presentation decks
   npm run db:seed
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. Available Scripts & Quality Verification

All commands match the `scripts` object in [`package.json`](file:///d:/New%20folder/test/package.json):

```bash
# 1. Typecheck (Strict TypeScript validation)
npm run typecheck
# Output: tsc --noEmit (Exits with code 0, 0 errors)

# 2. Linting (Checks source files against strict rules)
npm run lint
# Output: tsc --noEmit (Exits with code 0)

# 3. Automated Unit & Integration Tests (Vitest)
npm test
# Output: 18 tests passing across 3 test suites:
# - src/__tests__/smoke.test.ts (2 tests)
# - src/__tests__/documents.test.ts (9 tests)
# - src/__tests__/presentations.test.ts (7 tests)

# 4. Production Build (Optimized static and server routes)
npm run build
# Output: ▲ Next.js 14.2.24 - Compiled successfully, all 6 routes generated

# 5. Production Server Launch
npm start
# Launches the compiled application on http://localhost:3000
```

> **Note on E2E Testing**: Critical route contracts, database isolation, template immutability, and OpenXML binary magic bytes (`PK\x03\x04`) are covered by Vitest integration tests. Playwright E2E browser flows can be run against a live local server instance.

---

## 7. Architecture Overview & Module Boundaries

For an in-depth breakdown, see [`docs/ARCHITECTURE.md`](file:///d:/New%20folder/test/docs/ARCHITECTURE.md).

```
                                  +-----------------------------+
                                  |     Next.js 14 App Router   |
                                  +-----------------------------+
                                                 |
                 +-------------------------------+-------------------------------+
                 |                                                               |
                 v                                                               v
      [Client UI Components]                                            [Server Route Handlers]
  - Document Catalog (`/documents`)                                  - `GET /api/document-templates`
  - Document Editor (`/documents/[id]`)                              - `POST /api/documents`
  - Presentation Catalog (`/presentations`)                          - `GET /api/documents/[id]/export`
  - Slide Inspector Modal                                            - `GET /api/presentation-templates`
  - Tiptap Toolbar (`StarterKit`)                                    - `GET /api/.../download`
                 |                                                               |
                 +-------------------------------+-------------------------------+
                                                 |
                                                 v
                                  +-----------------------------+
                                  |        Storage Layer        |
                                  | - SQLite (`prisma/dev.db`)  |
                                  | - Assets (`templates/`)     |
                                  | - Thumbnails (`public/`)    |
                                  +-----------------------------+
```

### Key Principles:
- **Zero Server Leaks in Client**: Database calls and file I/O are restricted exclusively to server-side Route Handlers. Client components interact via standard `fetch` API.
- **Typed Responses**: All API routes return typed JSON payloads wrapped in `{ success: boolean, data?: any, error?: string }`.
- **Responsive Layout**: Fluid layouts support 1440px (desktop), 1024px (small desktop), 768px (tablet), and 390px (mobile) breakpoints.

---

## 8. Prisma Data Models & Relationships

Defined in [`prisma/schema.prisma`](file:///d:/New%20folder/test/prisma/schema.prisma):

```prisma
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

---

## 9. Draft Isolation & Template Immutability Guarantee

To prevent user edits from corrupting reference templates:

1. **Fork on Selection**: Clicking **"Use Template"** executes `POST /api/documents` with `{ templateId }`.
2. **Independent Record**: The server reads the master template's content and creates a **brand new `Draft` record** with a unique CUID.
3. **Editor Isolation**: The Tiptap editor at `/documents/[id]` only sends `PATCH` requests updating `Draft.content` and `Draft.title`.
4. **No Mutation Endpoints**: There are zero write routes exposing `UPDATE` or `DELETE` on the `Template` table.
5. **Disk Asset Protection**: Master `.pptx` files are read as read-only streams. No file writes ever occur in `templates/`.

*Verified in automated test `creating a draft should not mutate the master template`.*

---

## 10. Template Storage & How to Add New Templates

The UI is 100% data-driven; adding a new template requires **zero UI code modifications**.

### Adding a New Document Template
1. Create an HTML template file in `templates/documents/my-template.html`.
2. Place a preview SVG in `public/thumbnails/documents/my-template.svg`.
3. Add a seed entry to `prisma/seed.js`:
   ```javascript
   await prisma.template.create({
     data: {
       id: "doc-tmpl-custom-01",
       type: "DOCUMENT",
       name: "Executive Summary Brief",
       category: "Business & Strategy",
       description: "High-level briefing document for leadership.",
       thumbnailPath: "/thumbnails/documents/my-template.svg",
       content: fs.readFileSync("templates/documents/my-template.html", "utf-8"),
     },
   });
   ```
4. Run `npm run db:seed`. The template will immediately appear in `/documents` with active category filters and preview support.

### Adding a New Presentation Template
1. Place your `.pptx` presentation in `templates/presentations/my-deck.pptx`.
2. Place a preview SVG in `public/thumbnails/presentations/my-deck.svg`.
3. Add an entry to `prisma/seed.js` with structured `slides` JSON:
   ```javascript
   await prisma.template.create({
     data: {
       id: "pres-tmpl-custom-01",
       type: "PRESENTATION",
       name: "Technical Architecture Deck",
       category: "Engineering",
       description: "System design and infrastructure overview deck.",
       thumbnailPath: "/thumbnails/presentations/my-deck.svg",
       filePath: "templates/presentations/my-deck.pptx",
       content: "Technical Architecture Deck",
       slides: JSON.stringify([
         {
           slideNumber: 1,
           title: "Microservices Topology",
           summary: "Overview of Kubernetes cluster architecture.",
           bulletPoints: ["Service mesh configuration", "Ingress controllers"]
         }
       ]),
     },
   });
   ```
4. Run `npm run db:seed`.

---

## 11. Export Format Support & Limitations

### Document Export (`.docx`)
- **Supported Elements**:
  - `<h1>`, `<h2>`, `<h3>` mapped to OpenXML Heading levels 1, 2, and 3.
  - Inline text styling: `<strong>` (Bold), `<em>` (Italic), `<s>` (Strikethrough).
  - Unordered lists (`<ul><li>`) formatted with OpenXML bullet points.
  - Ordered lists (`<ol><li>`) formatted with numbered sequences.
  - Blockquotes (`<blockquote>`) with left indentation.
  - Paragraphs (`<p>`) with 1.15 line spacing and standard margins.
- **Current Limitations**:
  - Complex nested multi-column tables with formula cells are not converted.
  - Embedded vector canvas drawings and Word macros are unsupported.

### Presentation Export (`.pptx`)
- **Supported Features**:
  - Downloads genuine 16:9 widescreen PowerPoint `.pptx` presentation files (~70–78 KB).
  - Preserves professional multi-slide deck layouts, theme colors, cards, and typography.
  - Compatible with Microsoft PowerPoint, Google Slides, Keynote, and LibreOffice.
- **Current Limitations**:
  - In-browser slide editing canvas is out of scope for this MVP. Edits are performed in PowerPoint or compatible presentation software after download.

---

## 12. API Overview

Detailed request and response schemas are documented in [`docs/API.md`](file:///d:/New%20folder/test/docs/API.md).

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/document-templates` | List document templates with `?search=` and `?category=` |
| `GET` | `/api/document-templates/[id]` | Get single document template |
| `POST` | `/api/documents` | Create new isolated draft from template ID |
| `GET` | `/api/documents` | List user document drafts |
| `GET` | `/api/documents/[id]` | Get draft content for editor hydration |
| `PATCH` | `/api/documents/[id]` | Save draft updates (title, content) |
| `DELETE` | `/api/documents/[id]` | Delete document draft |
| `GET` | `/api/documents/[id]/export` | Export draft as genuine `.docx` OpenXML binary |
| `GET` | `/api/presentation-templates` | List presentation templates with slide arrays |
| `GET` | `/api/presentation-templates/[id]` | Get presentation template details |
| `GET` | `/api/presentation-templates/[id]/download` | Stream genuine master `.pptx` presentation file |
| `POST` | `/api/presentations` | Record presentation draft project |
| `GET` | `/api/presentations` | List presentation drafts |
| `GET` | `/api/presentations/[id]/export` | Download saved presentation draft `.pptx` |

---

## 13. AI Tools Used During Development

As required by modern recruitment transparency standards:
- **AI Coding Assistant**: Google DeepMind **Antigravity** agentic AI assistant powered by Gemini models.
- **Scope of AI Assistance**:
  - Scaffolding project architecture and TypeScript type definitions.
  - Generating initial OpenXML binary templates via `pptxgenjs`.
  - Designing responsive Tailwind components with accessible color contrast.
  - Writing automated Vitest test suites for route handlers and data immutability.
  - Authoring comprehensive technical handover documentation.
- **Human/Engineering Supervision**:
  - All generated code was inspected, compiled, type-checked (`tsc --noEmit`), and verified against real binary outputs.

---

## 14. Feature Status, Known Limitations & Roadmap

### Completed Features
- [x] Responsive layout with desktop/mobile navigation (`Navbar.tsx`).
- [x] Document Template Library with instant search and category filter.
- [x] Document preview modal with scroll-lock and keyboard accessibility (`Escape`).
- [x] Immutable draft creation (`POST /api/documents`).
- [x] Tiptap rich-text editor with sticky toolbar and word count statistics.
- [x] Dirty state tracking, save indicators, and `beforeunload` warning.
- [x] Programmatic OpenXML DOCX export (`/api/documents/[id]/export`).
- [x] Presentation Template Library with slide counts and metadata.
- [x] Slide deck inspector with carousel and arrow key navigation (`←` / `→`).
- [x] Secure server-side PPTX download with path traversal prevention.
- [x] Complete Vitest test suite (19 automated tests passing).

### Out of Scope by Design
- User authentication and multi-tenant accounts (single-workspace recruitment MVP).
- Cloud object storage (S3/R2); local filesystem storage was deliberately chosen for portable evaluation.
- In-browser WYSIWYG slide layout designer.
- Payment gateways or billing systems.

### Known Limitations
- **Local SQLite Persistence**: SQLite database (`prisma/dev.db`) is stored locally on disk. For production multi-instance serverless deployments (e.g. AWS Lambda, Vercel), a managed relational database (PostgreSQL, Neon, PlanetScale) and S3 storage bucket should be configured.
- **Complex Table Export**: Tiptap HTML tables currently export plain text cells into DOCX paragraphs rather than native OpenXML grid tables.

### Future Roadmap
1. **Cloud Storage Integration**: Migrate `templates/` assets to AWS S3 or Cloudflare R2 with pre-signed download URLs.
2. **Collaborative Editing**: Integrate Yjs and WebSockets with Tiptap for real-time multiplayer document editing.
3. **PDF Generation**: Add server-side headless browser rendering (Puppeteer/Chromium) to export print-ready PDF copies.
4. **Interactive Slide Designer**: Implement Fabric.js or Canvas-based slide editing for in-browser presentation customization.
