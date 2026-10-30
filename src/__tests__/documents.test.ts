import { describe, it, expect } from "vitest";
import { db } from "@/lib/db";
import { convertHtmlToDocx } from "@/lib/docx-export";
import { Packer } from "docx";

describe("Document Templates API & Logic", () => {
  it("should have at least 5 seeded document templates in the database", async () => {
    const templates = await db.template.findMany({
      where: { type: "DOCUMENT" },
    });
    expect(templates.length).toBeGreaterThanOrEqual(5);
  });

  it("should filter templates by category properly", async () => {
    const legalTemplates = await db.template.findMany({
      where: {
        type: "DOCUMENT",
        category: "Legal & HR",
      },
    });

    expect(legalTemplates.length).toBeGreaterThan(0);
    expect(legalTemplates.every((t: { category: string }) => t.category === "Legal & HR")).toBe(true);
  });

  it("should search templates by name or description substring", async () => {
    const results = await db.template.findMany({
      where: {
        type: "DOCUMENT",
        OR: [
          { name: { contains: "Contract" } },
          { description: { contains: "Contract" } },
        ],
      },
    });

    expect(results.length).toBeGreaterThan(0);
    expect(
      results.some(
        (t: { name: string; description: string }) =>
          t.name.includes("Contract") || t.description.includes("Contract")
      )
    ).toBe(true);
  });

  it("should return null when querying a non-existent template ID", async () => {
    const nonExistent = await db.template.findUnique({
      where: { id: "non-existent-template-id-9999" },
    });
    expect(nonExistent).toBeNull();
  });
});

describe("Document Drafts, Immutability & DOCX Export", () => {
  let createdDraftId: string;
  let originalTemplateContent: string;
  let testTemplateId: string;

  it("creating a draft leaves the original template completely unchanged", async () => {
    // 1. Get an existing template
    const template = await db.template.findFirst({
      where: { type: "DOCUMENT" },
    });
    expect(template).not.toBeNull();
    testTemplateId = template!.id;
    originalTemplateContent = template!.content;

    // 2. Create a new draft based on this template
    const draft = await db.draft.create({
      data: {
        templateId: template!.id,
        type: "DOCUMENT",
        title: `${template!.name} (User Draft)`,
        content: template!.content,
      },
    });
    expect(draft.id).toBeDefined();
    expect(draft.id).not.toBe(template!.id);
    createdDraftId = draft.id;

    // 3. Verify original template was NOT changed
    const freshTemplate = await db.template.findUnique({
      where: { id: testTemplateId },
    });
    expect(freshTemplate!.content).toBe(originalTemplateContent);
    expect(freshTemplate!.updatedAt.getTime()).toBe(template!.updatedAt.getTime());
  });

  it("editing and saving draft persists changes to database without affecting template", async () => {
    const modifiedContent = "<h1>Modified Custom Header</h1><p>User custom paragraph added.</p>";
    const modifiedTitle = "My Customized Employment Agreement";

    // Update the draft
    const updatedDraft = await db.draft.update({
      where: { id: createdDraftId },
      data: {
        title: modifiedTitle,
        content: modifiedContent,
      },
    });

    expect(updatedDraft.title).toBe(modifiedTitle);
    expect(updatedDraft.content).toBe(modifiedContent);

    // Re-query from database to verify persistence
    const reloaded = await db.draft.findUnique({
      where: { id: createdDraftId },
    });
    expect(reloaded?.title).toBe(modifiedTitle);
    expect(reloaded?.content).toBe(modifiedContent);

    // Verify original template is STILL completely untouched
    const freshTemplate = await db.template.findUnique({
      where: { id: testTemplateId },
    });
    expect(freshTemplate!.content).toBe(originalTemplateContent);
  });

  it("export generates a valid DOCX binary file with proper OpenXML signatures", async () => {
    const draft = await db.draft.findUnique({
      where: { id: createdDraftId },
    });
    expect(draft).not.toBeNull();

    const docxDoc = convertHtmlToDocx(draft!.title, draft!.content);
    const buffer = await Packer.toBuffer(docxDoc);

    // 1. Buffer should have non-trivial size
    expect(buffer.length).toBeGreaterThan(2000);

    // 2. DOCX is a zipped XML archive, so the first 2 bytes must be PK (0x50, 0x4B)
    expect(buffer[0]).toBe(0x50); // 'P'
    expect(buffer[1]).toBe(0x4b); // 'K'
  });

  it("export gracefully handles rich formatting like headings, lists, and tables", async () => {
    const complexHtml = `
      <h1>Main Document Heading</h1>
      <h2>Sub Section Heading</h2>
      <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
      <ul>
        <li>Bullet point item 1</li>
        <li>Bullet point item 2</li>
      </ul>
      <ol>
        <li>Numbered item 1</li>
        <li>Numbered item 2</li>
      </ol>
      <hr />
      <table>
        <tr><th>Col 1</th><th>Col 2</th></tr>
        <tr><td>Data A</td><td>Data B</td></tr>
      </table>
    `;

    const docxDoc = convertHtmlToDocx("Complex Formatting Test", complexHtml);
    const buffer = await Packer.toBuffer(docxDoc);

    expect(buffer.length).toBeGreaterThan(2000);
    expect(buffer[0]).toBe(0x50);
    expect(buffer[1]).toBe(0x4b);
  });

  it("querying a missing draft returns null / 404 behavior", async () => {
    const nonExistent = await db.draft.findUnique({
      where: { id: "non-existent-draft-cuid-999" },
    });
    expect(nonExistent).toBeNull();
  });
});
