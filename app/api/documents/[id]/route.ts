import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import type { WordAnalysis } from "@/types";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (id.endsWith(".pdf") || _req.nextUrl.pathname.endsWith("/file")) {
    return getFile(_req, id);
  }

  const document = await db.document.findUnique({
    where: { id },
    include: { highlights: { orderBy: { createdAt: "asc" } } },
  });

  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({
    ...document,
    highlights: document.highlights.map((h) => ({
      ...h,
      analysis: JSON.parse(h.analysis) as WordAnalysis,
    })),
  });
}

async function getFile(_req: NextRequest, id: string) {
  const doc = await db.document.findUnique({ where: { id } });
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const filePath = path.join(process.cwd(), "uploads", doc.filePath);
  const fileBuffer = await readFile(filePath);

  return new NextResponse(fileBuffer, {
    headers: { "Content-Type": "application/pdf" },
  });
}
