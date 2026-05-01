import { cache } from "react";

import type { Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";
import type { AiConversationRecord, DocumentRecord } from "@/types";

type DocumentRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string | null;
  content: string;
  updated_at: string;
  status: "draft" | "published";
  author_id: string;
  profiles:
    | Array<{
        full_name: string | null;
        email: string;
      }>
    | {
        full_name: string | null;
        email: string;
      }
    | null;
  document_tags: Array<{
    tags:
      | Array<{
          name: string;
        }>
      | {
          name: string;
        }
      | null;
  }> | null;
};

type AiConversationRow = {
  id: string;
  question: string;
  answer: string;
  created_at: string;
};

export type DocumentFilters = {
  query?: string;
  category?: string;
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
}

const documentSelect = `
  id,
  slug,
  title,
  category,
  summary,
  content,
  updated_at,
  status,
  author_id,
  profiles:profiles!documents_author_id_fkey(full_name, email),
  document_tags(
    tags(name)
  )
`;

function mapDocument(row: DocumentRow, locale: Locale = "th"): DocumentRecord {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const dict = getDictionary(locale);

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: row.summary ?? dict.documents.noSummary,
    content: row.content,
    updatedAt: new Date(row.updated_at).toLocaleDateString("en-CA"),
    author: profile?.full_name || profile?.email || "Unknown author",
    status: row.status,
    tags:
      row.document_tags
        ?.flatMap((item) => {
          if (!item.tags) {
            return [];
          }

          return Array.isArray(item.tags) ? item.tags.map((tag) => tag.name) : [item.tags.name];
        })
        .filter((value): value is string => Boolean(value)) ?? [],
  };
}

export const getDocumentCategories = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select("category")
    .order("category", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return [...new Set((data ?? []).map((item) => item.category))];
});

export async function listDocuments(filters: DocumentFilters = {}, locale: Locale = "th") {
  const supabase = await createClient();
  let query = supabase
    .from("documents")
    .select(documentSelect)
    .order("updated_at", { ascending: false });

  if (filters.query) {
    query = query.or(`title.ilike.%${filters.query}%,content.ilike.%${filters.query}%`);
  }

  if (filters.category && filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data as DocumentRow[] | null | undefined)?.map((row) => mapDocument(row, locale)) ?? [];
}

export async function listRecentDocuments(limit = 3, locale: Locale = "th") {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("documents")
    .select(documentSelect)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return (data as DocumentRow[] | null | undefined)?.map((row) => mapDocument(row, locale)) ?? [];
}

export async function getDocumentById(id: string, locale: Locale = "th") {
  const supabase = await createClient();
  const query = supabase.from("documents").select(documentSelect);
  const lookup = isUuid(id) ? query.eq("id", id) : query.eq("slug", id);
  const { data, error } = await lookup.single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new Error(error.message);
  }

  return mapDocument(data as DocumentRow, locale);
}

export async function listAiConversations(documentId: string, limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("ai_conversations")
    .select("id, question, answer, created_at")
    .eq("document_id", documentId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as AiConversationRow[]).map(
    (conversation): AiConversationRecord => ({
      id: conversation.id,
      question: conversation.question,
      answer: conversation.answer,
      createdAt: new Date(conversation.created_at).toLocaleString("en-CA", {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    }),
  );
}
