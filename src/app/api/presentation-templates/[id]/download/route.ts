import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid template ID" },
        { status: 400 }
      );
    }

    // 1. Verify template exists and is a PRESENTATION
    const template = await db.template.findFirst({
      where: {
        id,
        type: "PRESENTATION",
      },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Presentation template not found" },
        { status: 404 }
      );
    }

    if (!template.filePath) {
      return NextResponse.json(
        { success: false, error: "Template asset file path not configured" },
        { status: 404 }
      );
    }

    // 2. Safe path resolution: Ensure file is strictly located inside templates/presentations
    const normalizedRelative = path.normalize(template.filePath).replace(/^(\.\.(\/|\\))+/, "");
    const absolutePath = path.resolve(process.cwd(), normalizedRelative);
    const presentationsBaseDir = path.resolve(process.cwd(), "templates", "presentations");

    if (!absolutePath.startsWith(presentationsBaseDir)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized file access attempt" },
        { status: 403 }
      );
    }

    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json(
        { success: false, error: "PPTX template file not found on disk" },
        { status: 404 }
      );
    }

    // 3. Read genuine PPTX binary buffer
    const fileBuffer = await fs.promises.readFile(absolutePath);

    // 4. Sanitize attachment filename
    const safeTitle =
      template.name
        .replace(/[^\w\s\-\u00C0-\u1EF9]/gi, "")
        .trim()
        .replace(/\s+/g, "_") || "presentation";

    const filename = `${safeTitle}.pptx`;

    // 5. Stream genuine PPTX file as an attachment copy
    return new NextResponse(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          filename
        )}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error serving PPTX presentation file:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error serving PPTX file" },
      { status: 500 }
    );
  }
}
