import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const updateDraftSchema = z.object({
  title: z.string().min(1, "Title cannot be empty").max(200).optional(),
  content: z.string().optional(),
});

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
      include: {
        template: {
          select: {
            id: true,
            name: true,
            category: true,
            thumbnailPath: true,
          },
        },
      },
    });

    if (!draft) {
      return NextResponse.json(
        { success: false, error: "Document draft not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: draft,
    });
  } catch (error) {
    console.error("Error retrieving document draft:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existingDraft = await db.draft.findFirst({
      where: {
        id,
        type: "DOCUMENT",
      },
    });

    if (!existingDraft) {
      return NextResponse.json(
        { success: false, error: "Document draft not found" },
        { status: 404 }
      );
    }

    const json = await request.json();
    const validated = updateDraftSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Invalid update payload", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { title, content } = validated.data;

    const updatedDraft = await db.draft.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Draft saved successfully",
      data: updatedDraft,
    });
  } catch (error) {
    console.error("Error updating document draft:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const existingDraft = await db.draft.findFirst({
      where: { id, type: "DOCUMENT" },
    });

    if (!existingDraft) {
      return NextResponse.json(
        { success: false, error: "Document draft not found" },
        { status: 404 }
      );
    }

    await db.draft.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Draft deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document draft:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
