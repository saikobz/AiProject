import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { DocumentCard } from "@/components/document-card";
import { getMockDocuments } from "@/features/documents/mock-data";
import { requireUser } from "@/lib/supabase/auth";

export default async function DocumentsPage() {
  await requireUser();
  const documents = getMockDocuments();

  return (
    <AppShell
      title="Documents"
      description="Use this route as the base for search, filters, pagination, and document ownership rules."
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 rounded-[24px] border border-border bg-panel-strong p-5 md:flex-row md:items-center md:justify-between">
          <div className="grid flex-1 gap-3 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <input
              className="rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none placeholder:text-muted"
              placeholder="Search documents"
              readOnly
            />
            <select className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted" defaultValue="all">
              <option value="all">All categories</option>
            </select>
            <select className="rounded-2xl border border-border bg-white px-4 py-3 text-sm text-muted" defaultValue="updated">
              <option value="updated">Recently updated</option>
            </select>
          </div>
          <Link
            href="/documents/new"
            className="rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-accent-strong"
          >
            New document
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {documents.map((document) => (
            <DocumentCard key={document.id} document={document} />
          ))}
        </div>
      </div>
    </AppShell>
  );
}
