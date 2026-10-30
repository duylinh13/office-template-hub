import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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
        template: {
          select: {
            id: true,
            name: true,
            category: true,
            thumbnailPath: true,
            filePath: true,
          },
        },
      },
    });

    if (!draft) {
      return NextResponse.json(
        { success: false, error: "Presentation draft not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...draft,
        slides: draft.slides ? JSON.parse(draft.slides) : [],
      },
    });
  } catch (error) {
    console.error("Error retrieving presentation draft:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
