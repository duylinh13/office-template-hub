import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createDraftSchema = z.object({
  templateId: z.string().optional(),
  title: z.string().min(1).max(200).optional(),
  content: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const validated = createDraftSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { templateId, title, content } = validated.data;

    let initialTitle = title || "Untitled Document";
    let initialContent = content || "<p>Start writing your document here...</p>";

    if (templateId) {
      const template = await db.template.findUnique({
        where: { id: templateId },
      });

      if (!template) {
        return NextResponse.json(
          { success: false, error: "Template not found" },
          { status: 404 }
        );
      }

      if (template.type !== "DOCUMENT") {
        return NextResponse.json(
          { success: false, error: "Provided template is not a document template" },
          { status: 400 }
        );
      }

      initialTitle = title || `${template.name} (Draft)`;
      initialContent = content || template.content;
    }

    // Create an independent draft. The template record is strictly untouched!
    const draft = await db.draft.create({
      data: {
        templateId: templateId || null,
        type: "DOCUMENT",
        title: initialTitle,
        content: initialContent,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Draft created successfully",
        data: draft,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating document draft:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const drafts = await db.draft.findMany({
      where: { type: "DOCUMENT" },
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
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      count: drafts.length,
      data: drafts,
    });
  } catch (error) {
    console.error("Error listing document drafts:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
