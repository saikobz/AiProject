import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import {
  askDocumentQuestionAction,
  generateSummaryAction,
} from "@/features/documents/ai-actions";
import { getDocumentById, listAiConversations } from "@/features/documents/data";
import { requireUser } from "@/lib/supabase/auth";

type DocumentDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    success?: string;
    error?: string;
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

  const conversations = await listAiConversations(document.id);

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
          {search.error ? (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {search.error}
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
            <Link href={`/documents/${document.slug}/edit`} className="text-sm font-semibold text-accent">
              Edit document
            </Link>
          </div>
        </article>
        <aside className="space-y-4">
          <section className="rounded-[24px] border border-border bg-panel-strong p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight">AI summary</h2>
              <form action={generateSummaryAction}>
                <input type="hidden" name="document_id" value={document.id} />
                <input type="hidden" name="document_slug" value={document.slug} />
                <input type="hidden" name="content" value={document.content} />
                <button
                  type="submit"
                  className="rounded-full border border-border bg-white px-4 py-2 text-xs font-semibold text-foreground transition hover:border-accent"
                >
                  Generate
                </button>
              </form>
            </div>
            <p className="mt-3 text-sm leading-7 text-muted">{document.summary}</p>
          </section>
          <section className="rounded-[24px] border border-border bg-panel-strong p-5">
            <h2 className="text-lg font-semibold tracking-tight">Ask AI about this document</h2>
            <form action={askDocumentQuestionAction}>
              <input type="hidden" name="document_id" value={document.id} />
              <input type="hidden" name="document_slug" value={document.slug} />
              <input type="hidden" name="content" value={document.content} />
              <textarea
                name="question"
                className="mt-4 min-h-28 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm"
                placeholder="What are the main action items in this document?"
              />
              <button
                type="submit"
                className="mt-4 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white"
              >
                Ask Gemini
              </button>
            </form>
            <div className="mt-5 space-y-3">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <article
                    key={conversation.id}
                    className="rounded-2xl border border-border bg-white px-4 py-3"
                  >
                    <p className="text-xs text-muted">{conversation.createdAt}</p>
                    <p className="mt-2 text-sm font-semibold">{conversation.question}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">
                      {conversation.answer}
                    </p>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-white px-4 py-6 text-sm text-muted">
                  Saved AI answers will appear here.
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
