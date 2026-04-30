import { NextResponse } from "next/server";

import { askDocumentQuestion } from "@/lib/ai/gemini";
import { aiQuestionSchema } from "@/lib/validations/document";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const payload = aiQuestionSchema.parse(json);
    const answer = await askDocumentQuestion(payload.content, payload.question);

    return NextResponse.json({ answer });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to answer question.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
