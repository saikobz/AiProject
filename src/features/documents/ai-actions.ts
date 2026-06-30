"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { askDocumentQuestion, summarizeDocument } from "@/lib/ai/gemini";
import { normalizeLocale, withLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { aiQuestionSchema, aiSummarySchema } from "@/lib/validations/document";

function getErrorPath(locale: Locale, slug: string, message: string) {
  return `${withLocale(locale, `/documents/${slug}`)}?error=${encodeURIComponent(message)}`;
}

async function requireAiUser(locale: Locale) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect(withLocale(locale, "/login"));
  }

  return { supabase, user };
}

async function loadDocumentForAi(
  supabase: Awaited<ReturnType<typeof createClient>>,
  documentId: string,
  documentSlug: string,
) {
  const { data, error } = await supabase
    .from("documents")
    .select("id, slug, content")
    .eq("id", documentId)
    .maybeSingle();

  if (error || !data || data.slug !== documentSlug) {
    return null;
  }

  return data;
}

export async function generateSummaryAction(formData: FormData) {
  const locale = normalizeLocale(formData.get("locale"));
  const dict = getDictionary(locale);
  const documentId = String(formData.get("document_id") ?? "");
  const documentSlug = String(formData.get("document_slug") ?? "");

  if (!documentId || !documentSlug) {
    redirect(getErrorPath(locale, documentSlug || documentId, dict.system.summaryNeedsContent));
  }

  const { supabase, user } = await requireAiUser(locale);
  const document = await loadDocumentForAi(supabase, documentId, documentSlug);
  const parsed = aiSummarySchema.safeParse({ content: document?.content ?? "" });

  if (!document || !parsed.success) {
    redirect(getErrorPath(locale, documentSlug, dict.system.summaryNeedsContent));
  }

  let redirectPath = `${withLocale(locale, `/documents/${documentSlug}`)}?success=${encodeURIComponent(dict.system.summaryGenerated)}`;

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

    revalidatePath(withLocale(locale, "/dashboard"));
    revalidatePath(withLocale(locale, "/documents"));
    revalidatePath(withLocale(locale, `/documents/${documentSlug}`));
  } catch (error) {
    const message = error instanceof Error ? error.message : dict.system.summaryFailed;
    redirectPath = getErrorPath(locale, documentSlug, message);
  }

  redirect(redirectPath);
}

export async function askDocumentQuestionAction(formData: FormData) {
  const locale = normalizeLocale(formData.get("locale"));
  const dict = getDictionary(locale);
  const documentId = String(formData.get("document_id") ?? "");
  const documentSlug = String(formData.get("document_slug") ?? "");
  const question = String(formData.get("question") ?? "");

  const questionParsed = aiQuestionSchema.safeParse({ question });

  if (!documentId || !documentSlug || !questionParsed.success) {
    redirect(getErrorPath(locale, documentSlug || documentId, dict.system.questionNeedsContent));
  }

  const { supabase, user } = await requireAiUser(locale);
  const document = await loadDocumentForAi(supabase, documentId, documentSlug);
  const contentParsed = aiSummarySchema.safeParse({ content: document?.content ?? "" });

  if (!document || !contentParsed.success) {
    redirect(getErrorPath(locale, documentSlug, dict.system.questionNeedsContent));
  }

  let redirectPath = `${withLocale(locale, `/documents/${documentSlug}`)}?success=${encodeURIComponent(dict.system.answerSaved)}`;

  try {
    const answer = await askDocumentQuestion(contentParsed.data.content, questionParsed.data.question);
    const { error: conversationError } = await supabase.from("ai_conversations").insert({
      document_id: documentId,
      user_id: user.id,
      question: questionParsed.data.question,
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

    revalidatePath(withLocale(locale, "/dashboard"));
    revalidatePath(withLocale(locale, `/documents/${documentSlug}`));
  } catch (error) {
    const message = error instanceof Error ? error.message : dict.system.answerFailed;
    redirectPath = getErrorPath(locale, documentSlug, message);
  }

  redirect(redirectPath);
}
