import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { convertHtmlToDocx } from "@/lib/docx-export";
import { Packer } from "docx";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const draft = await db.draft.findFirst({
      where: {
        id,
        type: "DOCUMENT",
      },
    });

    if (!draft) {
      return NextResponse.json(
        { success: false, error: "Document draft not found" },
        { status: 404 }
      );
    }

    // Convert draft HTML content into DOCX document
    const doc = convertHtmlToDocx(draft.title, draft.content);
    const buffer = await Packer.toBuffer(doc);

    // Sanitize filename for Content-Disposition header
    const safeTitle =
      draft.title
        .replace(/[^\w\s\-\u00C0-\u1EF9]/gi, "")
        .trim()
        .replace(/\s+/g, "_") || "document";

    const filename = `${safeTitle}.docx`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          filename
        )}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Content-Length": buffer.length.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error exporting document to DOCX:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error during export" },
      { status: 500 }
    );
  }
}
