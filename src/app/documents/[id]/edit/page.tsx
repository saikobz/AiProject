import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { deleteDocumentAction, updateDocumentAction } from "@/features/documents/actions";
import { getDocumentById } from "@/features/documents/data";
import { requireUser } from "@/lib/supabase/auth";

type EditDocumentPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function EditDocumentPage({
  params,
  searchParams,
}: EditDocumentPageProps) {
  await requireUser();
  const { id } = await params;
  const search = (await searchParams) ?? {};
  const document = await getDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <AppShell
      title={`Edit: ${document.title}`}
      description="Update or delete an existing document in Supabase."
    >
      <form action={updateDocumentAction} className="grid gap-4">
        {search.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {search.error}
          </div>
        ) : null}
        <input type="hidden" name="document_id" value={document.id} />
        <input type="hidden" name="document_slug" value={document.slug} />
        <input
          name="title"
          defaultValue={document.title}
          className="rounded-2xl border border-border bg-panel-strong px-4 py-3"
        />
        <input
          name="category"
          defaultValue={document.category}
          className="rounded-2xl border border-border bg-panel-strong px-4 py-3"
        />
        <input
          name="tags"
          defaultValue={document.tags.join(", ")}
          className="rounded-2xl border border-border bg-panel-strong px-4 py-3"
        />
        <select
          name="status"
          defaultValue={document.status}
          className="rounded-2xl border border-border bg-panel-strong px-4 py-3 text-sm"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <textarea
          name="content"
          defaultValue={document.content}
          className="min-h-64 rounded-2xl border border-border bg-panel-strong px-4 py-3"
        />
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="cursor-pointer rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
            Save changes
          </button>
        </div>
      </form>
      <form action={deleteDocumentAction} className="mt-4">
        <input type="hidden" name="document_id" value={document.id} />
        <input type="hidden" name="document_slug" value={document.slug} />
        <button type="submit" className="cursor-pointer rounded-full border border-border px-5 py-3 text-sm font-semibold">
          Delete document
        </button>
      </form>
    </AppShell>
  );
}
