import Link from "next/link";

import type { DocumentRecord } from "@/types";

type DocumentCardProps = {
  document: DocumentRecord;
};

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <article className="rounded-[24px] border border-border bg-panel-strong p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>{document.category}</span>
        <span>&bull;</span>
        <span>{document.updatedAt}</span>
        <span>&bull;</span>
        <span className="capitalize">{document.status}</span>
      </div>
      <h2 className="mt-3 text-xl font-semibold tracking-tight">{document.title}</h2>
      <p className="mt-3 text-sm leading-7 text-muted">{document.summary}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {document.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-muted"
          >
            #{tag}
          </span>
        ))}
      </div>
      <div className="mt-5">
        <Link
          href={`/documents/${document.slug}`}
          className="text-sm font-semibold text-accent transition hover:text-accent-strong"
        >
          Open document
        </Link>
      </div>
    </article>
  );
}
