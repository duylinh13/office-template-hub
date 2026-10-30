const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");

async function generatePitchDeck(outputPath) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Venture Capital Pitch Deck";
  pres.author = "Office Template Hub";

  // Slide 1: Title
  const s1 = pres.addSlide();
  s1.background = { color: "0F172A" };
  s1.addText("NOVACORP AI", {
    x: 1.0,
    y: 1.8,
    w: 8.5,
    h: 0.6,
    fontSize: 20,
    color: "38BDF8",
    bold: true,
  });
  s1.addText("Autonomous Enterprise Workflow Automation", {
    x: 1.0,
    y: 2.6,
    w: 8.5,
    h: 1.2,
    fontSize: 40,
    color: "FFFFFF",
    bold: true,
  });
  s1.addText("Series A Investor Presentation | October 2026", {
    x: 1.0,
    y: 4.2,
    w: 8.5,
    h: 0.5,
    fontSize: 16,
    color: "94A3B8",
  });

  // Slide 2: The Problem & Market
  const s2 = pres.addSlide();
  s2.background = { color: "0F172A" };
  s2.addText("THE OPPORTUNITY", { x: 1.0, y: 0.8, w: 8.5, h: 0.4, fontSize: 16, color: "38BDF8", bold: true });
  s2.addText("Enterprises spend 42% of knowledge work on repetitive documents", { x: 1.0, y: 1.3, w: 8.5, h: 0.8, fontSize: 26, color: "FFFFFF", bold: true });
  s2.addText("• $120B Total Addressable Market (TAM) growing at 32% CAGR\n• Siloed tools cause massive version conflicts and compliance liabilities\n• Existing legacy suites lack isolated, reproducible templating architecture", {
    x: 1.0,
    y: 2.4,
    w: 8.5,
    h: 3.0,
    fontSize: 18,
    color: "CBD5E1",
    lineSpacing: 28,
  });

  // Slide 3: The Solution
  const s3 = pres.addSlide();
  s3.background = { color: "0F172A" };
  s3.addText("OUR SOLUTION", { x: 1.0, y: 0.8, w: 8.5, h: 0.4, fontSize: 16, color: "38BDF8", bold: true });
  s3.addText("Office Template Hub: Immutable Templates & Real-time Export", { x: 1.0, y: 1.3, w: 8.5, h: 0.8, fontSize: 26, color: "FFFFFF", bold: true });
  s3.addShape(pres.ShapeType.rect, { x: 1.0, y: 2.5, w: 2.5, h: 3.0, fill: { color: "1E293B" }, line: { color: "38BDF8", width: 1.5 } });
  s3.addText("100% Immutable\n\nTemplate originals can never be corrupted by draft edits.", { x: 1.1, y: 2.8, w: 2.3, h: 2.2, color: "FFFFFF", fontSize: 14, align: "center" });

  s3.addShape(pres.ShapeType.rect, { x: 4.0, y: 2.5, w: 2.5, h: 3.0, fill: { color: "1E293B" }, line: { color: "38BDF8", width: 1.5 } });
  s3.addText("High-Fidelity Export\n\nDirect server-side DOCX and PPTX generation without web mocks.", { x: 4.1, y: 2.8, w: 2.3, h: 2.2, color: "FFFFFF", fontSize: 14, align: "center" });

  s3.addShape(pres.ShapeType.rect, { x: 7.0, y: 2.5, w: 2.5, h: 3.0, fill: { color: "1E293B" }, line: { color: "38BDF8", width: 1.5 } });
  s3.addText("Enterprise-Ready\n\nAir-gapped SQLite persistence with zero vendor lock-in.", { x: 7.1, y: 2.8, w: 2.3, h: 2.2, color: "FFFFFF", fontSize: 14, align: "center" });

  // Slide 4: Business Traction
  const s4 = pres.addSlide();
  s4.background = { color: "0F172A" };
  s4.addText("TRACTION & GROWTH", { x: 1.0, y: 0.8, w: 8.5, h: 0.4, fontSize: 16, color: "38BDF8", bold: true });
  s4.addText("Rapid ARR expansion driven by enterprise expansion", { x: 1.0, y: 1.3, w: 8.5, h: 0.8, fontSize: 26, color: "FFFFFF", bold: true });
  s4.addText("• $4.2M Current ARR (up 220% YoY)\n• 148 Enterprise Customers with $28,000 ACV\n• 128% Net Revenue Retention (NRR)\n• 94% Gross Margin on Cloud Services", {
    x: 1.0,
    y: 2.4,
    w: 8.5,
    h: 3.0,
    fontSize: 18,
    color: "CBD5E1",
    lineSpacing: 28,
  });

  // Slide 5: Funding Ask
  const s5 = pres.addSlide();
  s5.background = { color: "0F172A" };
  s5.addText("THE ASK", { x: 1.0, y: 0.8, w: 8.5, h: 0.4, fontSize: 16, color: "38BDF8", bold: true });
  s5.addText("Raising $12M Series A to Accelerate Enterprise GTM", { x: 1.0, y: 1.3, w: 8.5, h: 0.8, fontSize: 26, color: "FFFFFF", bold: true });
  s5.addText("Use of Funds:\n• 50% Engineering & AI Architecture R&D\n• 30% Enterprise Sales & Customer Success\n• 20% Security, SOC2 Compliance & Partnerships", {
    x: 1.0,
    y: 2.4,
    w: 8.5,
    h: 3.0,
    fontSize: 18,
    color: "CBD5E1",
    lineSpacing: 28,
  });

  await pres.writeFile({ fileName: outputPath });
  console.log(`✓ Generated Pitch Deck: ${outputPath}`);
}

async function generateQBR(outputPath) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Quarterly Business Review (QBR)";
  pres.author = "Office Template Hub";

  // Slide 1: Title
  const s1 = pres.addSlide();
  s1.background = { color: "F8FAFC" };
  s1.addText("GLOBAL ENTERPRISE GROUP", { x: 1.0, y: 1.8, w: 8.5, h: 0.6, fontSize: 18, color: "1E40AF", bold: true });
  s1.addText("Quarterly Business Review (Q3 2026)", { x: 1.0, y: 2.5, w: 8.5, h: 1.0, fontSize: 36, color: "0F172A", bold: true });
  s1.addText("Performance Scorecard, Operations & Strategic Roadmaps", { x: 1.0, y: 3.8, w: 8.5, h: 0.5, fontSize: 16, color: "64748B" });

  // Slide 2: Executive Summary
  const s2 = pres.addSlide();
  s2.background = { color: "FFFFFF" };
  s2.addText("EXECUTIVE SCORECARD", { x: 1.0, y: 0.8, w: 8.5, h: 0.4, fontSize: 14, color: "1E40AF", bold: true });
  s2.addText("Q3 Performance Overview", { x: 1.0, y: 1.3, w: 8.5, h: 0.6, fontSize: 24, color: "0F172A", bold: true });

  s2.addShape(pres.ShapeType.rect, { x: 1.0, y: 2.2, w: 2.5, h: 1.8, fill: { color: "EFF6FF" }, line: { color: "BFDBFE", width: 1 } });
  s2.addText("REVENUE\n\n$8.4M", { x: 1.1, y: 2.4, w: 2.3, h: 1.4, color: "1E40AF", fontSize: 20, bold: true, align: "center" });

  s2.addShape(pres.ShapeType.rect, { x: 4.0, y: 2.2, w: 2.5, h: 1.8, fill: { color: "F0FDF4" }, line: { color: "BBF7D0", width: 1 } });
  s2.addText("EBITDA MARGIN\n\n28.4%", { x: 4.1, y: 2.4, w: 2.3, h: 1.4, color: "15803D", fontSize: 20, bold: true, align: "center" });

  s2.addShape(pres.ShapeType.rect, { x: 7.0, y: 2.2, w: 2.5, h: 1.8, fill: { color: "FAF5FF" }, line: { color: "E9D5FF", width: 1 } });
  s2.addText("NET RETENTION\n\n118%", { x: 7.1, y: 2.4, w: 2.3, h: 1.4, color: "7E22CE", fontSize: 20, bold: true, align: "center" });

  // Slide 3: Regional Highlights
  const s3 = pres.addSlide();
  s3.background = { color: "FFFFFF" };
  s3.addText("REGIONAL EXPANSION", { x: 1.0, y: 0.8, w: 8.5, h: 0.4, fontSize: 14, color: "1E40AF", bold: true });
  s3.addText("APAC and North America Lead New Customer Growth", { x: 1.0, y: 1.3, w: 8.5, h: 0.6, fontSize: 24, color: "0F172A", bold: true });
  s3.addText("• APAC: Revenue expanded +46% QoQ propelled by manufacturing hubs\n• North America: Won 12 Fortune 500 financial service commitments\n• EMEA: Reorganized sales distribution network; pipeline up 35%", {
    x: 1.0,
    y: 2.2,
    w: 8.5,
    h: 3.0,
    fontSize: 16,
    color: "334155",
    lineSpacing: 26,
  });

  // Slide 4: Strategic Priorities
  const s4 = pres.addSlide();
  s4.background = { color: "FFFFFF" };
  s4.addText("STRATEGIC OUTLOOK", { x: 1.0, y: 0.8, w: 8.5, h: 0.4, fontSize: 14, color: "1E40AF", bold: true });
  s4.addText("Top Initiatives for Next Quarter", { x: 1.0, y: 1.3, w: 8.5, h: 0.6, fontSize: 24, color: "0F172A", bold: true });
  s4.addText("1. Complete ISO 27001 & SOC 2 Type II audit certifications\n2. Roll out automated multi-format office document generator\n3. Launch Enterprise Partner Tier to drive indirect distribution", {
    x: 1.0,
    y: 2.2,
    w: 8.5,
    h: 3.0,
    fontSize: 16,
    color: "334155",
    lineSpacing: 26,
  });

  await pres.writeFile({ fileName: outputPath });
  console.log(`✓ Generated QBR: ${outputPath}`);
}

async function generateProductKeynote(outputPath) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "Product Launch Keynote";
  pres.author = "Office Template Hub";

  // Slide 1: Title
  const s1 = pres.addSlide();
  s1.background = { color: "3B0764" };
  s1.addText("ANNUAL KEYNOTE 2026", { x: 1.0, y: 1.8, w: 8.5, h: 0.6, fontSize: 18, color: "F59E0B", bold: true });
  s1.addText("Office Template Hub 2.0", { x: 1.0, y: 2.5, w: 8.5, h: 1.0, fontSize: 44, color: "FFFFFF", bold: true });
  s1.addText("Reimagining Enterprise Documents & Presentations", { x: 1.0, y: 3.8, w: 8.5, h: 0.5, fontSize: 18, color: "E9D5FF" });

  // Slide 2: The Breakthrough
  const s2 = pres.addSlide();
  s2.background = { color: "3B0764" };
  s2.addText("THE BREAKTHROUGH", { x: 1.0, y: 0.8, w: 8.5, h: 0.4, fontSize: 14, color: "F59E0B", bold: true });
  s2.addText("Zero Mockups. Real OpenXML Generation.", { x: 1.0, y: 1.3, w: 8.5, h: 0.6, fontSize: 26, color: "FFFFFF", bold: true });
  s2.addText("• Native DOCX and PPTX packaging directly on the server\n• Complete template isolation guarantees master files are never overwritten\n• Fully embedded rich-text Tiptap editing with real-time state feedback", {
    x: 1.0,
    y: 2.2,
    w: 8.5,
    h: 3.0,
    fontSize: 18,
    color: "F3E8FF",
    lineSpacing: 28,
  });

  // Slide 3: Three Pillars
  const s3 = pres.addSlide();
  s3.background = { color: "3B0764" };
  s3.addText("ARCHITECTURAL EXCELLENCE", { x: 1.0, y: 0.8, w: 8.5, h: 0.4, fontSize: 14, color: "F59E0B", bold: true });
  s3.addText("Designed for Reliability, Extensibility & Simplicity", { x: 1.0, y: 1.3, w: 8.5, h: 0.6, fontSize: 26, color: "FFFFFF", bold: true });
  s3.addShape(pres.ShapeType.rect, { x: 1.0, y: 2.4, w: 2.5, h: 2.8, fill: { color: "4C1D95" }, line: { color: "F59E0B", width: 1.5 } });
  s3.addText("Immutable\n\nRead-only masters with copy-on-write drafts.", { x: 1.1, y: 2.6, w: 2.3, h: 2.2, color: "FFFFFF", fontSize: 14, align: "center" });

  s3.addShape(pres.ShapeType.rect, { x: 4.0, y: 2.4, w: 2.5, h: 2.8, fill: { color: "4C1D95" }, line: { color: "F59E0B", width: 1.5 } });
  s3.addText("Type-Safe\n\nStrict TypeScript & Zod validation on all API endpoints.", { x: 4.1, y: 2.6, w: 2.3, h: 2.2, color: "FFFFFF", fontSize: 14, align: "center" });

  s3.addShape(pres.ShapeType.rect, { x: 7.0, y: 2.4, w: 2.5, h: 2.8, fill: { color: "4C1D95" }, line: { color: "F59E0B", width: 1.5 } });
  s3.addText("Tested\n\nUnit tests with Vitest covering error and edge cases.", { x: 7.1, y: 2.6, w: 2.3, h: 2.2, color: "FFFFFF", fontSize: 14, align: "center" });

  // Slide 4: Availability
  const s4 = pres.addSlide();
  s4.background = { color: "3B0764" };
  s4.addText("LAUNCH TIMELINE", { x: 1.0, y: 0.8, w: 8.5, h: 0.4, fontSize: 14, color: "F59E0B", bold: true });
  s4.addText("Available Today in Recruitment Take-Home MVP", { x: 1.0, y: 1.3, w: 8.5, h: 0.6, fontSize: 26, color: "FFFFFF", bold: true });
  s4.addText("• 100% Offline-capable SQLite database\n• Compatible with PowerPoint, Keynote & Google Slides\n• Ready for enterprise deployment and customization", {
    x: 1.0,
    y: 2.2,
    w: 8.5,
    h: 3.0,
    fontSize: 18,
    color: "F3E8FF",
    lineSpacing: 28,
  });

  await pres.writeFile({ fileName: outputPath });
  console.log(`✓ Generated Product Keynote: ${outputPath}`);
}

async function main() {
  const dir = path.join(__dirname, "..", "templates", "presentations");
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await generatePitchDeck(path.join(dir, "venture-pitch-deck.pptx"));
  await generateQBR(path.join(dir, "quarterly-business-review.pptx"));
  await generateProductKeynote(path.join(dir, "product-launch-keynote.pptx"));

  console.log("All 3 authentic PPTX files generated successfully!");
}

main().catch(console.error);
