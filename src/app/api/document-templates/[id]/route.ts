import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

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
        type: "DOCUMENT",
      },
      select: {
        id: true,
        type: true,
        name: true,
        category: true,
        description: true,
        thumbnailPath: true,
        content: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!template) {
      return NextResponse.json(
        { success: false, error: "Document template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Error fetching document template by ID:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
