import Link from "next/link";
import { Bot, FilePlus2, Search } from "lucide-react";

import { ActivityList } from "@/components/activity-list";
import { AppShell } from "@/components/app-shell";
import { StatGrid } from "@/components/stat-grid";
import { getDashboardStats, getRecentActivity } from "@/features/dashboard/data";
import { listRecentDocuments } from "@/features/documents/data";
import { requireUser } from "@/lib/supabase/auth";

export default async function DashboardPage() {
  await requireUser();
  const [stats, documents, activity] = await Promise.all([
    getDashboardStats(),
    listRecentDocuments(3),
    getRecentActivity(),
  ]);

  return (
    <AppShell
      title="Dashboard"
      description="Live overview from Supabase documents, summaries, and activity logs."
    >
      <div className="space-y-6">
        <StatGrid stats={stats} />
        <div className="grid gap-3 md:grid-cols-3">
          <Link
            href="/documents/new"
            className="flex items-center gap-3 rounded-xl border border-border bg-panel-strong px-4 py-3 text-sm font-semibold transition hover:border-accent"
          >
            <FilePlus2 className="size-4 text-accent" aria-hidden="true" />
            Create document
          </Link>
          <Link
            href="/documents"
            className="flex items-center gap-3 rounded-xl border border-border bg-panel-strong px-4 py-3 text-sm font-semibold transition hover:border-accent"
          >
            <Search className="size-4 text-accent" aria-hidden="true" />
            Search knowledge base
          </Link>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-panel-strong px-4 py-3 text-sm font-semibold">
            <Bot className="size-4 text-accent" aria-hidden="true" />
            AI actions update live metrics
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-xl border border-border bg-panel-strong p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-semibold tracking-tight">Recent documents</h2>
              <Link href="/documents" className="text-sm font-semibold text-accent">
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {documents.length > 0 ? (
                documents.map((document) => (
                  <Link
                    key={document.id}
                    href={`/documents/${document.slug}`}
                    className="block rounded-xl border border-border bg-white px-4 py-3 transition hover:border-accent"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium">{document.title}</p>
                      <span className="text-xs capitalize text-muted">{document.status}</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{document.summary}</p>
                    <p className="mt-2 text-xs text-muted">{document.updatedAt}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-border bg-white px-4 py-6 text-sm text-muted">
                  Create your first document to populate the dashboard.
                </div>
              )}
            </div>
          </div>
          <ActivityList activity={activity} />
        </div>
      </div>
    </AppShell>
  );
}
