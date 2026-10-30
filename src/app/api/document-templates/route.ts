import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;

    const validated = querySchema.safeParse({ search, category });
    if (!validated.success) {
      return NextResponse.json(
        { success: false, error: "Invalid query parameters" },
        { status: 400 }
      );
    }

    const whereClause: {
      type: string;
      category?: string;
      OR?: Array<{ name: { contains: string } } | { description: { contains: string } }>;
    } = {
      type: "DOCUMENT",
    };

    if (category && category !== "all") {
      whereClause.category = category;
    }

    if (search && search.trim() !== "") {
      const term = search.trim();
      whereClause.OR = [
        { name: { contains: term } },
        { description: { contains: term } },
      ];
    }

    const templates = await db.template.findMany({
      where: whereClause,
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
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      count: templates.length,
      data: templates,
    });
  } catch (error) {
    console.error("Error fetching document templates:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
