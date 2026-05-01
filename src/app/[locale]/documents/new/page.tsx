import { AppShell } from "@/components/app-shell";
import { createDocumentAction } from "@/features/documents/actions";
import { getLocale, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireUser } from "@/lib/supabase/auth";

export const unstable_dynamicStaleTime = 30;

type NewDocumentPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function NewDocumentPage({ params, searchParams }: NewDocumentPageProps) {
  const { locale: localeParam } = await params;
  const locale = getLocale(localeParam);
  const user = await requireUser(withLocale(locale, "/login"));
  const dict = getDictionary(locale);
  const query = (await searchParams) ?? {};

  return (
    <AppShell
      locale={locale}
      title={dict.documents.createTitle}
      description={dict.documents.createDescription}
      currentUserEmail={user.email}
    >
      <form action={createDocumentAction} className="grid gap-4">
        <input type="hidden" name="locale" value={locale} />
        {query.error ? (
          <div className="rounded-2xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {query.error}
          </div>
        ) : null}
        <input
          name="title"
          className="rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft"
          placeholder={dict.documents.titlePlaceholder}
        />
        <div className="grid gap-4 md:grid-cols-2">
          <input
            name="category"
            className="rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft"
            placeholder={dict.documents.categoryPlaceholder}
          />
          <input
            name="tags"
            className="rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft"
            placeholder={dict.documents.tagsPlaceholder}
          />
        </div>
        <select
          name="status"
          className="rounded-2xl border border-border bg-background/35 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
          defaultValue="draft"
        >
          <option value="draft">{dict.common.draft}</option>
          <option value="published">{dict.common.published}</option>
        </select>
        <textarea
          name="content"
          className="min-h-72 rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft"
          placeholder={dict.documents.contentPlaceholder}
        />
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="cursor-pointer rounded-full bg-accent px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent-strong">
            {dict.documents.saveDocument}
          </button>
        </div>
      </form>
    </AppShell>
  );
}
