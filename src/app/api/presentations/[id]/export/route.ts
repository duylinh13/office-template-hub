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

    const draft = await db.draft.findFirst({
      where: {
        id,
        type: "PRESENTATION",
      },
      include: {
        template: true,
      },
    });

    if (!draft) {
      return NextResponse.json(
        { success: false, error: "Presentation draft not found" },
        { status: 404 }
      );
    }

    if (!draft.template || !draft.template.filePath) {
      return NextResponse.json(
        { success: false, error: "Associated presentation master file missing" },
        { status: 404 }
      );
    }

    const normalizedRelative = path.normalize(draft.template.filePath).replace(/^(\.\.(\/|\\))+/, "");
    const absolutePath = path.resolve(process.cwd(), normalizedRelative);
    const presentationsBaseDir = path.resolve(process.cwd(), "templates", "presentations");

    if (!absolutePath.startsWith(presentationsBaseDir)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized file access" },
        { status: 403 }
      );
    }

    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json(
        { success: false, error: "Presentation file not found on disk" },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.promises.readFile(absolutePath);

    const safeTitle =
      draft.title
        .replace(/[^\w\s\-\u00C0-\u1EF9]/gi, "")
        .trim()
        .replace(/\s+/g, "_") || "presentation";

    const filename = `${safeTitle}.pptx`;

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
    console.error("Error exporting presentation PPTX:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error exporting presentation" },
      { status: 500 }
    );
  }
}
