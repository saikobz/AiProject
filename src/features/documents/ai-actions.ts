"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { askDocumentQuestion, summarizeDocument } from "@/lib/ai/gemini";
import { createClient } from "@/lib/supabase/server";
import { aiQuestionSchema, aiSummarySchema } from "@/lib/validations/document";

function getErrorPath(slug: string, message: string) {
  return `/documents/${slug}?error=${encodeURIComponent(message)}`;
}

async function requireAiUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return { supabase, user };
}

export async function generateSummaryAction(formData: FormData) {
  const documentId = String(formData.get("document_id") ?? "");
  const documentSlug = String(formData.get("document_slug") ?? "");
  const content = String(formData.get("content") ?? "");

  const parsed = aiSummarySchema.safeParse({ content });

  if (!documentId || !documentSlug || !parsed.success) {
    redirect(getErrorPath(documentSlug || documentId, "Document content is required for summary."));
  }

  const { supabase, user } = await requireAiUser();
  let redirectPath = `/documents/${documentSlug}?success=${encodeURIComponent("AI summary generated.")}`;

  try {
    const summary = await summarizeDocument(parsed.data.content);
    const { error: updateError } = await supabase
      .from("documents")
      .update({ summary })
      .eq("id", documentId);

    if (updateError) {
      throw updateError;
    }

    const { error: activityError } = await supabase.from("activity_logs").insert({
      user_id: user.id,
      document_id: documentId,
      action: "ai.summary.generated",
    });

    if (activityError) {
      throw activityError;
    }

    revalidatePath("/dashboard");
    revalidatePath("/documents");
    revalidatePath(`/documents/${documentSlug}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate summary.";
    redirectPath = getErrorPath(documentSlug, message);
  }

  redirect(redirectPath);
}

export async function askDocumentQuestionAction(formData: FormData) {
  const documentId = String(formData.get("document_id") ?? "");
  const documentSlug = String(formData.get("document_slug") ?? "");
  const content = String(formData.get("content") ?? "");
  const question = String(formData.get("question") ?? "");

  const parsed = aiQuestionSchema.safeParse({ content, question });

  if (!documentId || !documentSlug || !parsed.success) {
    redirect(getErrorPath(documentSlug || documentId, "A valid question and document content are required."));
  }

  const { supabase, user } = await requireAiUser();
  let redirectPath = `/documents/${documentSlug}?success=${encodeURIComponent("AI answer saved.")}`;

  try {
    const answer = await askDocumentQuestion(parsed.data.content, parsed.data.question);
    const { error: conversationError } = await supabase.from("ai_conversations").insert({
      document_id: documentId,
      user_id: user.id,
      question: parsed.data.question,
      answer,
    });

    if (conversationError) {
      throw conversationError;
    }

    const { error: activityError } = await supabase.from("activity_logs").insert({
      user_id: user.id,
      document_id: documentId,
      action: "ai.question.asked",
    });

    if (activityError) {
      throw activityError;
    }

    revalidatePath("/dashboard");
    revalidatePath(`/documents/${documentSlug}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to answer question.";
    redirectPath = getErrorPath(documentSlug, message);
  }

  redirect(redirectPath);
}
