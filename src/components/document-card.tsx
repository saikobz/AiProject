import Link from "next/link";

import { LinkPendingIndicator } from "@/components/link-pending-indicator";
import { withLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { DocumentRecord } from "@/types";

type DocumentCardProps = {
  document: DocumentRecord;
  locale: Locale;
};

export function DocumentCard({ document, locale }: DocumentCardProps) {
  const dict = getDictionary(locale);

  return (
    <article className="rounded-[24px] border border-border bg-panel-strong p-4 transition hover:border-accent hover:bg-accent-soft sm:p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>{document.category}</span>
        <span>&bull;</span>
        <span>{document.updatedAt}</span>
        <span>&bull;</span>
        <span>{document.status === "published" ? dict.common.published : dict.common.draft}</span>
      </div>
      <h2 className="mt-3 text-lg font-semibold tracking-tight text-foreground sm:text-xl">{document.title}</h2>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{document.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {document.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-background/35 px-3 py-1 text-xs font-medium text-muted"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-5">
        <Link
          href={withLocale(locale, `/documents/${document.slug}`)}
          className="inline-flex cursor-pointer rounded-full bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-strong"
        >
          {dict.documents.openDocument}
          <LinkPendingIndicator className="ml-2 text-background" />
        </Link>
      </div>
    </article>
  );
}
