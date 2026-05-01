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
    ? new Error("Gemini ยังไม่พร้อมใช้งานชั่วคราว กรุณาลองใหม่อีกครั้งในอีกไม่กี่นาที")
    : new Error("เรียก Gemini ไม่สำเร็จ");
}

export async function summarizeDocument(content: string) {
  return generateWithFallback(
    [
      "สรุปเอกสารคลังความรู้นี้เป็นภาษาไทย",
      "ตอบเป็น bullet สั้น ๆ จำนวน 5 ข้อเท่านั้น",
      'ใช้รูปแบบนี้ทุกบรรทัด: "- ประเด็นสรุป"',
      "ห้ามใช้ markdown bold, heading, numbering หรือ paragraph ยาว",
      "แต่ละ bullet ไม่เกิน 22 คำ",
      "",
      content,
    ].join("\n"),
  );
}

export async function askDocumentQuestion(content: string, question: string) {
  return generateWithFallback(
    `ตอบคำถามเป็นภาษาไทยโดยอ้างอิงจากเอกสารนี้เท่านั้น\n\nเอกสาร:\n${content}\n\nคำถาม:\n${question}`,
  );
}
