import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";

export async function GET() {
  const documents = await db.document.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { highlights: true } } },
  });
  return NextResponse.json(documents);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const id = crypto.randomUUID();
  const filePath = path.join(process.cwd(), "uploads", `${id}.pdf`);
  await writeFile(filePath, buffer);

  const document = await db.document.create({
    data: { name: file.name, filePath: `${id}.pdf` },
  });

  return NextResponse.json(document, { status: 201 });
}
