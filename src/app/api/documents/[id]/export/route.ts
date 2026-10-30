import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { convertHtmlToDocx } from "@/lib/docx-export";
import { Packer } from "docx";

export const dynamic = "force-dynamic";

async function generateDocxResponse(title: string, content: string) {
  const doc = convertHtmlToDocx(title, content);
  const buffer = await Packer.toBuffer(doc);

  const safeTitle =
    title
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
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

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

    return await generateDocxResponse(draft.title, draft.content);
  } catch (error) {
    console.error("Error exporting document to DOCX (GET):", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error during export" },
      { status: 500 }
    );
  }
}

export async function POST(
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

    const body = await request.json().catch(() => ({}));
    const targetTitle = (typeof body.title === "string" && body.title.trim()) ? body.title : draft.title;
    const targetContent = typeof body.content === "string" ? body.content : draft.content;

    // Persist latest content to SQLite to guarantee synchronization
    await db.draft.update({
      where: { id },
      data: {
        title: targetTitle,
        content: targetContent,
      },
    });

    return await generateDocxResponse(targetTitle, targetContent);
  } catch (error) {
    console.error("Error exporting document to DOCX (POST):", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error during export" },
      { status: 500 }
    );
  }
}
