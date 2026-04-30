import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { getDocumentById } from "@/features/documents/data";
import { requireUser } from "@/lib/supabase/auth";

type DocumentDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    success?: string;
  }>;
};

export default async function DocumentDetailPage({
  params,
  searchParams,
}: DocumentDetailPageProps) {
  await requireUser();
  const { id } = await params;
  const search = (await searchParams) ?? {};
  const document = await getDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <AppShell
      title={document.title}
      description="Document detail view backed by Supabase, ready for AI summary and Q&A integration."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[24px] border border-border bg-panel-strong p-5">
          {search.success ? (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              {search.success}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>{document.category}</span>
            <span>&bull;</span>
            <span>{document.author}</span>
            <span>&bull;</span>
            <span className="capitalize">{document.status}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
            {document.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-white px-3 py-1">
                #{tag}
              </span>
            ))}
          </div>
          <p className="mt-5 whitespace-pre-wrap text-sm leading-8 text-foreground">
            {document.content}
          </p>
          <div className="mt-6">
            <Link href={`/documents/${document.id}/edit`} className="text-sm font-semibold text-accent">
              Edit document
            </Link>
          </div>
        </article>
        <aside className="space-y-4">
          <section className="rounded-[24px] border border-border bg-panel-strong p-5">
            <h2 className="text-lg font-semibold tracking-tight">AI summary</h2>
            <p className="mt-3 text-sm leading-7 text-muted">{document.summary}</p>
          </section>
          <section className="rounded-[24px] border border-border bg-panel-strong p-5">
            <h2 className="text-lg font-semibold tracking-tight">Ask AI about this document</h2>
            <textarea
              className="mt-4 min-h-28 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
              placeholder="What are the main action items in this document?"
            />
            <button type="button" className="mt-4 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
              Ask Gemini
            </button>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
