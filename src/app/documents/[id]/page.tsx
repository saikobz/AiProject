import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { getMockDocumentById } from "@/features/documents/mock-data";
import { requireUser } from "@/lib/supabase/auth";

type DocumentDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function DocumentDetailPage({ params }: DocumentDetailPageProps) {
  await requireUser();
  const { id } = await params;
  const document = getMockDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <AppShell
      title={document.title}
      description="Document detail scaffold with room for AI summary, chat history, and activity timeline."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[24px] border border-border bg-panel-strong p-5">
          <div className="flex flex-wrap gap-2 text-xs text-muted">
            {document.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-white px-3 py-1">
                #{tag}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-8 text-foreground">{document.content}</p>
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
