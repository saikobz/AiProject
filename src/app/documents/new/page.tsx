import { AppShell } from "@/components/app-shell";
import { createDocumentAction } from "@/features/documents/actions";
import { requireUser } from "@/lib/supabase/auth";

type NewDocumentPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewDocumentPage({ searchParams }: NewDocumentPageProps) {
  await requireUser();
  const params = (await searchParams) ?? {};

  return (
    <AppShell
      title="Create document"
      description="Create a document directly in Supabase. Tags are comma-separated and stored through the join table."
    >
      <form action={createDocumentAction} className="grid gap-4">
        {params.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}
        <input
          name="title"
          className="rounded-2xl border border-border bg-panel-strong px-4 py-3"
          placeholder="Document title"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="category"
            className="rounded-2xl border border-border bg-panel-strong px-4 py-3"
            placeholder="Category"
          />
          <input
            name="tags"
            className="rounded-2xl border border-border bg-panel-strong px-4 py-3"
            placeholder="Tags separated by commas"
          />
        </div>
        <select
          name="status"
          className="rounded-2xl border border-border bg-panel-strong px-4 py-3 text-sm"
          defaultValue="draft"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
        <textarea
          name="content"
          className="min-h-64 rounded-2xl border border-border bg-panel-strong px-4 py-3"
          placeholder="Paste document content here"
        />
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
            Save document
          </button>
        </div>
      </form>
    </AppShell>
  );
}
