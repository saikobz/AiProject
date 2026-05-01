import Link from "next/link";
import { Bot, FilePlus2, Search } from "lucide-react";

import { ActivityList } from "@/components/activity-list";
import { AppShell } from "@/components/app-shell";
import { LinkPendingIndicator } from "@/components/link-pending-indicator";
import { StatGrid } from "@/components/stat-grid";
import { getDashboardStats, getRecentActivity } from "@/features/dashboard/data";
import { listRecentDocuments } from "@/features/documents/data";
import { getLocale, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireUser } from "@/lib/supabase/auth";

export const unstable_dynamicStaleTime = 30;

type DashboardPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale: localeParam } = await params;
  const locale = getLocale(localeParam);
  const user = await requireUser(withLocale(locale, "/login"));
  const dict = getDictionary(locale);
  const [stats, documents, activity] = await Promise.all([
    getDashboardStats(locale),
    listRecentDocuments(3, locale),
    getRecentActivity(locale),
  ]);

  return (
    <AppShell
      locale={locale}
      title={dict.dashboard.title}
      description={dict.dashboard.description}
      currentUserEmail={user.email}
    >
      <div className="space-y-5 sm:space-y-6">
        <StatGrid stats={stats} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            href={withLocale(locale, "/documents/new")}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-panel-strong px-4 py-3 text-sm font-semibold transition hover:border-accent hover:bg-accent-soft"
          >
            <FilePlus2 className="size-4 text-accent" aria-hidden="true" />
            {dict.dashboard.createDocument}
            <LinkPendingIndicator />
          </Link>
          <Link
            href={withLocale(locale, "/documents")}
            className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-panel-strong px-4 py-3 text-sm font-semibold transition hover:border-accent hover:bg-accent-soft"
          >
            <Search className="size-4 text-accent" aria-hidden="true" />
            {dict.dashboard.searchKnowledge}
            <LinkPendingIndicator />
          </Link>
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-panel-strong px-4 py-3 text-sm font-semibold">
            <Bot className="size-4 text-accent" aria-hidden="true" />
            {dict.dashboard.aiMetric}
          </div>
        </div>
        <div className="grid min-w-0 gap-4 xl:grid-cols-[1fr_0.88fr]">
          <div className="rounded-[24px] border border-border bg-panel-strong p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold tracking-tight">{dict.dashboard.recentDocuments}</h2>
              <Link href={withLocale(locale, "/documents")} className="cursor-pointer text-sm font-semibold text-accent transition hover:text-accent-strong">
                {dict.dashboard.viewAll}
                <LinkPendingIndicator className="ml-2 inline" />
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {documents.length > 0 ? (
                documents.map((document) => (
                  <Link
                    key={document.id}
                    href={withLocale(locale, `/documents/${document.slug}`)}
                    className="block cursor-pointer rounded-2xl border border-border bg-background/35 px-4 py-3 transition hover:border-accent hover:bg-accent-soft"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="min-w-0 font-medium text-foreground">{document.title}</p>
                      <span className="shrink-0 text-xs text-muted">
                        {document.status === "published" ? dict.common.published : dict.common.draft}
                      </span>
                      <LinkPendingIndicator />
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{document.summary}</p>
                    <p className="mt-2 text-xs text-muted">{document.updatedAt}</p>
                  </Link>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-background/30 px-4 py-6 text-sm leading-6 text-muted">
                  {dict.dashboard.emptyDocuments}
                </div>
              )}
            </div>
          </div>
          <ActivityList
            activity={activity}
            title={dict.dashboard.activity.title}
            emptyMessage={dict.dashboard.activity.empty}
          />
        </div>
      </div>
    </AppShell>
  );
}
