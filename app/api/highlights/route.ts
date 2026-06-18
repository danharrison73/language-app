import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { WordAnalysis } from "@/types";

export async function POST(req: NextRequest) {
  const { documentId, text, context, page, definition, analysis } = await req.json();

  const highlight = await db.highlight.create({
    data: {
      documentId,
      text,
      context,
      page,
      definition,
      analysis: JSON.stringify(analysis),
    },
  });

  return NextResponse.json(
    { ...highlight, analysis: JSON.parse(highlight.analysis) as WordAnalysis },
    { status: 201 }
  );
}
