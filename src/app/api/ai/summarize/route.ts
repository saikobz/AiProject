import { NextResponse } from "next/server";

import { summarizeDocument } from "@/lib/ai/gemini";
import { aiSummarySchema } from "@/lib/validations/document";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = aiSummarySchema.parse(json);
    const summary = await summarizeDocument(payload.content);

    return NextResponse.json({ summary });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to summarize document.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
