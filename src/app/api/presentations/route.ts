import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const createPresentationSchema = z.object({
  templateId: z.string().min(1, "Template ID is required"),
  title: z.string().min(1).max(200).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const validated = createPresentationSchema.safeParse(json);

    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Invalid request payload", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { templateId, title } = validated.data;

    const template = await db.template.findUnique({
      where: { id: templateId },
    });

    if (!template || template.type !== "PRESENTATION") {
      return NextResponse.json(
        { success: false, error: "Valid presentation template not found" },
        { status: 404 }
      );
    }

    const draftTitle = title || `${template.name} (My Presentation)`;

    // Create an independent presentation draft record. Master template is untouched!
    const draft = await db.draft.create({
      data: {
        templateId: template.id,
        type: "PRESENTATION",
        title: draftTitle,
        content: template.content,
        slides: template.slides,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Presentation draft created successfully",
        data: draft,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating presentation draft:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const drafts = await db.draft.findMany({
      where: { type: "PRESENTATION" },
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
    console.error("Error listing presentation drafts:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
