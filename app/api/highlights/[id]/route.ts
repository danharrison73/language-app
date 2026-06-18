import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import type { WordAnalysis } from "@/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { isHidden } = await req.json();

  const highlight = await db.highlight.update({
    where: { id },
    data: { isHidden },
  });

  return NextResponse.json({
    ...highlight,
    analysis: JSON.parse(highlight.analysis) as WordAnalysis,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await db.highlight.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
