"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { documentSchema } from "@/lib/validations/document";

function parseTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .slice(0, 8);
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function getErrorPath(path: string, message: string) {
  return `${path}?error=${encodeURIComponent(message)}`;
}

async function ensureUniqueSlug(
  title: string,
  supabase: Awaited<ReturnType<typeof createClient>>,
  excludeId?: string,
) {
  const base = slugify(title) || "document";
  let candidate = base;

  for (let attempt = 0; attempt < 5; attempt += 1) {
    let query = supabase.from("documents").select("id").eq("slug", candidate).limit(1);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return candidate;
    }

    candidate = `${base}-${crypto.randomUUID().slice(0, 6)}`;
  }

  return `${base}-${crypto.randomUUID().slice(0, 8)}`;
}

async function syncDocumentTags(
  supabase: Awaited<ReturnType<typeof createClient>>,
  documentId: string,
  tags: string[],
) {
  const uniqueTags = [...new Set(tags)];

  const { error: deleteError } = await supabase
    .from("document_tags")
    .delete()
    .eq("document_id", documentId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (uniqueTags.length === 0) {
    return;
  }

  const { error: insertTagsError } = await supabase
    .from("tags")
    .upsert(uniqueTags.map((name) => ({ name })), { onConflict: "name" });

  if (insertTagsError) {
    throw new Error(insertTagsError.message);
  }

  const { data: tagRows, error: selectTagsError } = await supabase
    .from("tags")
    .select("id, name")
    .in("name", uniqueTags);

  if (selectTagsError) {
    throw new Error(selectTagsError.message);
  }

  const { error: linkError } = await supabase.from("document_tags").insert(
    (tagRows ?? []).map((tag) => ({
      document_id: documentId,
      tag_id: tag.id,
    })),
  );

  if (linkError) {
    throw new Error(linkError.message);
  }
}

async function insertActivityLog(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  action: string,
  documentId: string,
) {
  const { error } = await supabase.from("activity_logs").insert({
    user_id: userId,
    document_id: documentId,
    action,
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function createDocumentAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const parsed = documentSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    category: String(formData.get("category") ?? ""),
    content: String(formData.get("content") ?? ""),
    tags: parseTags(formData.get("tags")),
    status: String(formData.get("status") ?? "draft"),
  });

  if (!parsed.success) {
    redirect(getErrorPath("/documents/new", parsed.error.issues[0]?.message ?? "Invalid document input."));
  }

  const slug = await ensureUniqueSlug(parsed.data.title, supabase);
  const { data, error } = await supabase
    .from("documents")
    .insert({
      author_id: user.id,
      title: parsed.data.title,
      slug,
      content: parsed.data.content,
      category: parsed.data.category,
      status: parsed.data.status,
    })
    .select("id")
    .single();

  if (error || !data) {
    redirect(getErrorPath("/documents/new", error?.message ?? "Failed to create document."));
  }

  await syncDocumentTags(supabase, data.id, parsed.data.tags);
  await insertActivityLog(supabase, user.id, "document.created", data.id);

  revalidatePath("/documents");
  revalidatePath("/dashboard");
  redirect(`/documents/${data.id}?success=${encodeURIComponent("Document created.")}`);
}

export async function updateDocumentAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const documentId = String(formData.get("document_id") ?? "");

  const parsed = documentSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    category: String(formData.get("category") ?? ""),
    content: String(formData.get("content") ?? ""),
    tags: parseTags(formData.get("tags")),
    status: String(formData.get("status") ?? "draft"),
  });

  if (!documentId || !parsed.success) {
    redirect(
      getErrorPath(
        `/documents/${documentId}/edit`,
        parsed.success ? "Document ID is required." : parsed.error.issues[0]?.message ?? "Invalid input.",
      ),
    );
  }

  const slug = await ensureUniqueSlug(parsed.data.title, supabase, documentId);
  const { error } = await supabase
    .from("documents")
    .update({
      title: parsed.data.title,
      slug,
      content: parsed.data.content,
      category: parsed.data.category,
      status: parsed.data.status,
    })
    .eq("id", documentId);

  if (error) {
    redirect(getErrorPath(`/documents/${documentId}/edit`, error.message));
  }

  await syncDocumentTags(supabase, documentId, parsed.data.tags);
  await insertActivityLog(supabase, user.id, "document.updated", documentId);

  revalidatePath("/documents");
  revalidatePath(`/documents/${documentId}`);
  revalidatePath(`/documents/${documentId}/edit`);
  revalidatePath("/dashboard");
  redirect(`/documents/${documentId}?success=${encodeURIComponent("Document updated.")}`);
}

export async function deleteDocumentAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const documentId = String(formData.get("document_id") ?? "");

  if (!documentId) {
    redirect(getErrorPath("/documents", "Document ID is required."));
  }

  await insertActivityLog(supabase, user.id, "document.deleted", documentId);

  const { error } = await supabase.from("documents").delete().eq("id", documentId);

  if (error) {
    redirect(getErrorPath(`/documents/${documentId}/edit`, error.message));
  }

  revalidatePath("/documents");
  revalidatePath("/dashboard");
  redirect("/documents?success=Document%20deleted.");
}
