import { NextRequest, NextResponse } from "next/server";
import { analyzeWord } from "@/lib/anthropic";

export async function POST(req: NextRequest) {
  const { text, sentence } = await req.json();
  if (!text || !sentence) {
    return NextResponse.json({ error: "Missing text or sentence" }, { status: 400 });
  }

  const analysis = await analyzeWord(text, sentence);
  return NextResponse.json(analysis);
}
