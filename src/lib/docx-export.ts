import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from "docx";

export interface TextSegment {
  text: string;
  bold?: boolean;
  italics?: boolean;
}

/**
 * Parses inline HTML tags like <strong>, <em>, <b>, <i> inside a snippet.
 */
export function parseInlineFormatting(html: string): TextSegment[] {
  const cleaned = html
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');

  const segments: TextSegment[] = [];
  const tagRegex = /(<\/?(?:strong|b|em|i)[^>]*>)/gi;
  const parts = cleaned.split(tagRegex);

  let isBold = false;
  let isItalic = false;

  for (const part of parts) {
    if (!part) continue;
    const lower = part.toLowerCase();

    if (lower.startsWith("<strong") || lower.startsWith("<b")) {
      isBold = true;
    } else if (lower.startsWith("</strong") || lower.startsWith("</b")) {
      isBold = false;
    } else if (lower.startsWith("<em") || lower.startsWith("<i")) {
      isItalic = true;
    } else if (lower.startsWith("</em") || lower.startsWith("</i")) {
      isItalic = false;
    } else if (!part.startsWith("<")) {
      segments.push({
        text: part,
        bold: isBold,
        italics: isItalic,
      });
    }
  }

  if (segments.length === 0) {
    segments.push({ text: "" });
  }

  return segments;
}

/**
 * Converts segments into docx TextRuns with optional overrides
 */
function createTextRuns(
  segments: TextSegment[],
  overrides?: { bold?: boolean; size?: number; color?: string }
): TextRun[] {
  return segments.map(
    (seg) =>
      new TextRun({
        text: seg.text,
        bold: overrides?.bold !== undefined ? overrides.bold : seg.bold,
        italics: seg.italics,
        font: "Arial",
        size: overrides?.size || 22, // 11pt default
        color: overrides?.color,
      })
  );
}

/**
 * Strips HTML tags from text
 */
function stripHtml(html: string): string {
  return html.replace(/<[^>]*>?/gm, "").trim();
}

/**
 * Converts HTML string from Tiptap editor into docx Document elements
 */
export function convertHtmlToDocx(title: string, htmlContent: string): Document {
  const children: (Paragraph | Table)[] = [];

  const blockRegex = /<(h[1-6]|p|ul|ol|table|hr)[^>]*>([\s\S]*?)<\/\1>|<hr\s*\/?>/gi;
  let match: RegExpExecArray | null;
  let hasBlocks = false;

  while ((match = blockRegex.exec(htmlContent)) !== null) {
    hasBlocks = true;
    const tag = (match[1] || "hr").toLowerCase();
    const innerHtml = match[2] || "";

    if (tag === "h1") {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 240, after: 120 },
          children: createTextRuns(parseInlineFormatting(innerHtml), {
            bold: true,
            size: 36, // 18pt
            color: "1e293b",
          }),
        })
      );
    } else if (tag === "h2") {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 },
          children: createTextRuns(parseInlineFormatting(innerHtml), {
            bold: true,
            size: 28, // 14pt
            color: "334155",
          }),
        })
      );
    } else if (tag === "h3") {
      children.push(
        new Paragraph({
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 160, after: 80 },
          children: createTextRuns(parseInlineFormatting(innerHtml), {
            bold: true,
            size: 24, // 12pt
            color: "475569",
          }),
        })
      );
    } else if (tag === "p") {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 80, line: 276 },
          children: createTextRuns(parseInlineFormatting(innerHtml)),
        })
      );
    } else if (tag === "ul") {
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch: RegExpExecArray | null;
      while ((liMatch = liRegex.exec(innerHtml)) !== null) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 40, after: 40 },
            children: createTextRuns(parseInlineFormatting(liMatch[1])),
          })
        );
      }
    } else if (tag === "ol") {
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let liMatch: RegExpExecArray | null;
      let counter = 1;
      while ((liMatch = liRegex.exec(innerHtml)) !== null) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: `${counter}. `,
                bold: true,
                font: "Arial",
                size: 22,
              }),
              ...createTextRuns(parseInlineFormatting(liMatch[1])),
            ],
          })
        );
        counter++;
      }
    } else if (tag === "hr") {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 120 },
          border: {
            bottom: {
              color: "cbd5e1",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        })
      );
    } else if (tag === "table") {
      const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      const rows: TableRow[] = [];
      let rowMatch: RegExpExecArray | null;

      while ((rowMatch = rowRegex.exec(innerHtml)) !== null) {
        const cellRegex = /<(td|th)[^>]*>([\s\S]*?)<\/\1>/gi;
        const cells: TableCell[] = [];
        let cellMatch: RegExpExecArray | null;

        while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
          const isHeader = cellMatch[1].toLowerCase() === "th";
          const cellContent = cellMatch[2];
          cells.push(
            new TableCell({
              width: { size: 3000, type: WidthType.DXA },
              children: [
                new Paragraph({
                  spacing: { before: 60, after: 60 },
                  children: createTextRuns(parseInlineFormatting(cellContent), {
                    bold: isHeader ? true : undefined,
                    size: 20,
                  }),
                }),
              ],
            })
          );
        }

        if (cells.length > 0) {
          rows.push(new TableRow({ children: cells }));
        }
      }

      if (rows.length > 0) {
        children.push(
          new Table({
            rows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          })
        );
      }
    }
  }

  // Fallback for plain text
  if (!hasBlocks || children.length === 0) {
    const lines = htmlContent.split("\n");
    for (const line of lines) {
      if (line.trim()) {
        children.push(
          new Paragraph({
            spacing: { before: 60, after: 60 },
            children: [
              new TextRun({
                text: stripHtml(line),
                font: "Arial",
                size: 22,
              }),
            ],
          })
        );
      }
    }
  }

  return new Document({
    title,
    creator: "Office Template Hub",
    description: "Generated from Office Template Hub Recruitment Take-Home MVP",
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children,
      },
    ],
  });
}
