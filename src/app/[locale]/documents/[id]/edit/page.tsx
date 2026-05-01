import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { deleteDocumentAction, updateDocumentAction } from "@/features/documents/actions";
import { getDocumentById } from "@/features/documents/data";
import { getLocale, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireUser } from "@/lib/supabase/auth";

type EditDocumentPageProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function EditDocumentPage({
  params,
  searchParams,
}: EditDocumentPageProps) {
  const { locale: localeParam, id } = await params;
  const locale = getLocale(localeParam);
  await requireUser(withLocale(locale, "/login"));
  const dict = getDictionary(locale);
  const search = (await searchParams) ?? {};
  const document = await getDocumentById(id, locale);

  if (!document) {
    notFound();
  }

  return (
    <AppShell
      locale={locale}
      title={dict.documents.editTitle(document.title)}
      description={dict.documents.editDescription}
    >
      <form action={updateDocumentAction} className="grid gap-4">
        <input type="hidden" name="locale" value={locale} />
        {search.error ? (
          <div className="rounded-2xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {search.error}
          </div>
        ) : null}
        <input type="hidden" name="document_id" value={document.id} />
        <input type="hidden" name="document_slug" value={document.slug} />
        <input
          name="title"
          defaultValue={document.title}
          className="rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
        <input
          name="category"
          defaultValue={document.category}
          className="rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
        <input
          name="tags"
          defaultValue={document.tags.join(", ")}
          className="rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
        <select
          name="status"
          defaultValue={document.status}
          className="rounded-2xl border border-border bg-background/35 px-4 py-3 text-sm outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
        >
          <option value="draft">{dict.common.draft}</option>
          <option value="published">{dict.common.published}</option>
        </select>
        <textarea
          name="content"
          defaultValue={document.content}
          className="min-h-72 rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition focus:border-accent focus:ring-2 focus:ring-accent-soft"
        />
        <div className="flex flex-wrap gap-3">
          <button type="submit" className="cursor-pointer rounded-full bg-accent px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent-strong">
            {dict.documents.saveChanges}
          </button>
        </div>
      </form>
      <form action={deleteDocumentAction} className="mt-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name="document_id" value={document.id} />
        <input type="hidden" name="document_slug" value={document.slug} />
        <button type="submit" className="cursor-pointer rounded-full border border-red-300/30 px-5 py-3 text-sm font-semibold text-red-100 transition hover:bg-red-400/10">
          {dict.documents.deleteDocument}
        </button>
      </form>
    </AppShell>
  );
}
