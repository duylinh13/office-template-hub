import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid template ID" },
        { status: 400 }
      );
    }

    const template = await db.template.findFirst({
      where: {
        id,
        type: "PRESENTATION",
      },
      select: {
        id: true,
        type: true,
        name: true,
        category: true,
        description: true,
        thumbnailPath: true,
        slides: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Presentation template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...template,
        slides: template.slides ? JSON.parse(template.slides) : [],
      },
    });
  } catch (error) {
    console.error("Error fetching presentation template by ID:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
