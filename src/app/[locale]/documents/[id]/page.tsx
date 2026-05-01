import Link from "next/link";
import { notFound } from "next/navigation";

import { AiSummary } from "@/components/ai-summary";
import { AppShell } from "@/components/app-shell";
import { LinkPendingIndicator } from "@/components/link-pending-indicator";
import { SubmitButton } from "@/components/submit-button";
import {
  askDocumentQuestionAction,
  generateSummaryAction,
} from "@/features/documents/ai-actions";
import { getDocumentById, listAiConversations } from "@/features/documents/data";
import { getLocale, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireUser } from "@/lib/supabase/auth";

export const unstable_dynamicStaleTime = 30;

type DocumentDetailPageProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function DocumentDetailPage({
  params,
  searchParams,
}: DocumentDetailPageProps) {
  const { locale: localeParam, id } = await params;
  const locale = getLocale(localeParam);
  const user = await requireUser(withLocale(locale, "/login"));
  const dict = getDictionary(locale);
  const search = (await searchParams) ?? {};
  const document = await getDocumentById(id, locale);

  if (!document) {
    notFound();
  }

  const conversations = await listAiConversations(document.id);

  return (
    <AppShell
      locale={locale}
      title={document.title}
      description={dict.documents.detailDescription}
      currentUserEmail={user.email}
    >
      <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <article className="min-w-0 rounded-[24px] border border-border bg-panel-strong p-4 sm:p-5">
          {search.success ? (
            <div className="mb-4 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
              {search.success}
            </div>
          ) : null}
          {search.error ? (
            <div className="mb-4 rounded-2xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
              {search.error}
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>{document.category}</span>
            <span>&bull;</span>
            <span>{document.author}</span>
            <span>&bull;</span>
            <span>{document.status === "published" ? dict.common.published : dict.common.draft}</span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
            {document.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-background/35 px-3 py-1">
                #{tag}
              </span>
            ))}
          </div>
          <p className="mt-5 whitespace-pre-wrap break-words text-sm leading-8 text-foreground">
            {document.content}
          </p>
          <div className="mt-6">
            <Link href={withLocale(locale, `/documents/${document.slug}/edit`)} className="inline-flex cursor-pointer rounded-full border border-border px-4 py-2 text-sm font-semibold text-accent transition hover:border-accent hover:bg-accent-soft">
              {dict.documents.editDocument}
              <LinkPendingIndicator className="ml-2" />
            </Link>
          </div>
        </article>
        <aside className="space-y-4">
          <section className="rounded-[24px] border border-border bg-panel-strong p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-semibold tracking-tight">{dict.documents.aiSummary}</h2>
              <form action={generateSummaryAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="document_id" value={document.id} />
                <input type="hidden" name="document_slug" value={document.slug} />
                <input type="hidden" name="content" value={document.content} />
                <SubmitButton
                  idleLabel={dict.documents.generate}
                  pendingLabel={dict.documents.summarizing}
                  className="rounded-full border border-border bg-background/35 px-4 py-2 text-xs font-semibold text-foreground transition hover:border-accent hover:bg-accent-soft"
                />
              </form>
            </div>
            <AiSummary summary={document.summary} />
          </section>
          <section className="rounded-[24px] border border-border bg-panel-strong p-4 sm:p-5">
            <h2 className="text-lg font-semibold tracking-tight">{dict.documents.askTitle}</h2>
            <form action={askDocumentQuestionAction}>
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="document_id" value={document.id} />
              <input type="hidden" name="document_slug" value={document.slug} />
              <input type="hidden" name="content" value={document.content} />
              <textarea
                name="question"
                className="mt-4 min-h-32 w-full rounded-2xl border border-border bg-background/35 px-4 py-3 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft"
                placeholder={dict.documents.questionPlaceholder}
              />
              <SubmitButton
                idleLabel={dict.documents.askGemini}
                pendingLabel={dict.documents.thinking}
                className="mt-4 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent-strong"
              />
            </form>
            <div className="mt-5 space-y-3">
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <article
                    key={conversation.id}
                    className="rounded-2xl border border-border bg-background/35 px-4 py-3"
                  >
                    <p className="text-xs text-muted">{conversation.createdAt}</p>
                    <p className="mt-2 text-sm font-semibold">{conversation.question}</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">
                      {conversation.answer}
                    </p>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-background/30 px-4 py-6 text-sm leading-6 text-muted">
                  {dict.documents.emptyAnswers}
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
