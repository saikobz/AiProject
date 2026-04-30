import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { DocumentCard } from "@/components/document-card";
import { getDocumentCategories, listDocuments } from "@/features/documents/data";
import { requireUser } from "@/lib/supabase/auth";

type DocumentsPageProps = {
  searchParams?: Promise<{
    q?: string;
    category?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function DocumentsPage({ searchParams }: DocumentsPageProps) {
  await requireUser();
  const params = (await searchParams) ?? {};
  const [documents, categories] = await Promise.all([
    listDocuments({ query: params.q, category: params.category }),
    getDocumentCategories(),
  ]);

  return (
    <AppShell
      title="Documents"
      description="Search, filter, create, and manage documents directly from Supabase-backed storage."
    >
      <div className="space-y-6">
        {params.success ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {params.success}
          </div>
        ) : null}
        {params.error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}
        <div className="flex flex-col gap-4 rounded-[24px] border border-border bg-panel-strong p-5 md:flex-row md:items-center md:justify-between">
          <form className="grid flex-1 gap-3 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <input
              name="q"
              className="rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none placeholder:text-muted"
              placeholder="Search documents"
              defaultValue={params.q ?? ""}
            />
            <select
              name="category"
              className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted"
              defaultValue={params.category ?? "all"}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button className="rounded-2xl border border-border bg-white px-4 py-3 text-sm font-medium text-foreground">
              Apply filters
            </button>
          </form>
          <Link
            href="/documents/new"
            className="rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-accent-strong"
          >
            New document
          </Link>
        </div>
        {documents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-border bg-panel-strong p-8 text-sm text-muted">
            No documents found yet. Create the first document or adjust your filters.
          </div>
        )}
      </div>
    </AppShell>
  );
}
