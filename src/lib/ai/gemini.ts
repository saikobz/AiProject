import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

export async function summarizeDocument(content: string) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Summarize this internal knowledge-base document in 5 concise bullet points:\n\n${content}`,
  });

  return response.text ?? "";
}

export async function askDocumentQuestion(content: string, question: string) {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Answer the question using only this document.\n\nDocument:\n${content}\n\nQuestion:\n${question}`,
  });

  return response.text ?? "";
}
