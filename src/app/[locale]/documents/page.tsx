import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { DocumentCard } from "@/components/document-card";
import { LinkPendingIndicator } from "@/components/link-pending-indicator";
import { getDocumentCategories, listDocuments } from "@/features/documents/data";
import { getLocale, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireUser } from "@/lib/supabase/auth";

export const unstable_dynamicStaleTime = 20;

type DocumentsPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    q?: string;
    category?: string;
    success?: string;
    error?: string;
  }>;
};

export default async function DocumentsPage({ params, searchParams }: DocumentsPageProps) {
  const { locale: localeParam } = await params;
  const locale = getLocale(localeParam);
  const user = await requireUser(withLocale(locale, "/login"));
  const dict = getDictionary(locale);
  const query = (await searchParams) ?? {};
  const [documents, categories] = await Promise.all([
    listDocuments({ query: query.q, category: query.category }, locale),
    getDocumentCategories(),
  ]);

  return (
    <AppShell
      locale={locale}
      title={dict.documents.title}
      description={dict.documents.description}
      currentUserEmail={user.email}
    >
      <div className="space-y-5 sm:space-y-6">
        {query.success ? (
          <div className="rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {query.success}
          </div>
        ) : null}
        {query.error ? (
          <div className="rounded-2xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {query.error}
          </div>
        ) : null}
        <div className="flex flex-col gap-4 rounded-[24px] border border-border bg-panel-strong p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
          <form className="grid flex-1 gap-3 md:grid-cols-[minmax(0,1.2fr)_220px_auto]">
            <input
              name="q"
              className="rounded-2xl border border-border bg-background/35 px-4 py-3 text-sm outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft"
              placeholder={dict.documents.searchPlaceholder}
              defaultValue={query.q ?? ""}
            />
            <select
              name="category"
              className="rounded-2xl border border-border bg-background/35 px-4 py-3 text-sm text-muted outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
              defaultValue={query.category ?? "all"}
            >
              <option value="all">{dict.documents.allCategories}</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <button className="cursor-pointer rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-background transition hover:bg-accent-strong">
              {dict.documents.applyFilters}
            </button>
          </form>
          <Link
            href={withLocale(locale, "/documents/new")}
            className="cursor-pointer rounded-full border border-border bg-panel px-5 py-3 text-center text-sm font-semibold text-foreground transition hover:border-accent hover:bg-accent-soft"
          >
            {dict.documents.newDocument}
            <LinkPendingIndicator className="ml-2 inline" />
          </Link>
        </div>
        {documents.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-border bg-panel-strong p-6 text-sm leading-7 text-muted sm:p-8">
            {dict.documents.empty}
          </div>
        )}
      </div>
    </AppShell>
  );
}
