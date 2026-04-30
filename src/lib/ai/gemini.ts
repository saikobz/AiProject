import { GoogleGenAI } from "@google/genai";

let client: GoogleGenAI | null = null;
const MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

function getGeminiClient() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

function isRetryableGeminiError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.message.includes("503") ||
    error.message.includes("UNAVAILABLE") ||
    error.message.includes("high demand")
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateWithFallback(contents: string) {
  const ai = getGeminiClient();
  let lastError: unknown;

  for (const model of MODELS) {
    for (const waitMs of [0, 750]) {
      if (waitMs > 0) {
        await delay(waitMs);
      }

      try {
        const response = await ai.models.generateContent({
          model,
          contents,
        });

        return response.text ?? "";
      } catch (error) {
        lastError = error;

        if (!isRetryableGeminiError(error)) {
          throw error;
        }
      }
    }
  }

  throw lastError instanceof Error
    ? new Error("Gemini is temporarily unavailable. Please try again in a few minutes.")
    : new Error("Gemini request failed.");
}

export async function summarizeDocument(content: string) {
  return generateWithFallback(
    `Summarize this internal knowledge-base document in 5 concise bullet points:\n\n${content}`,
  );
}

export async function askDocumentQuestion(content: string, question: string) {
  return generateWithFallback(
    `Answer the question using only this document.\n\nDocument:\n${content}\n\nQuestion:\n${question}`,
  );
}
