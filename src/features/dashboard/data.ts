import { type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";
import type { ActivityRecord, DashboardStat } from "@/types";

type ActivityRow = {
  id: string;
  action: string;
  created_at: string;
  documents:
    | Array<{
        title: string;
      }>
    | null;
};

function formatRelativeTime(value: string, locale: Locale) {
  const t = getDictionary(locale).dashboard.activity;
  const timestamp = new Date(value).getTime();
  const diff = Date.now() - timestamp;
  const minutes = Math.max(0, Math.floor(diff / 60000));

  if (minutes < 1) {
    return t.justNow;
  }

  if (minutes < 60) {
    return t.minutesAgo(minutes);
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return t.hoursAgo(hours);
  }

  const days = Math.floor(hours / 24);
  return t.daysAgo(days);
}

function actionLabel(action: string, locale: Locale) {
  const labels = getDictionary(locale).dashboard.activity.actions as Record<string, string>;
  return labels[action] ?? action.replaceAll(".", " ");
}

export async function getDashboardStats(locale: Locale): Promise<DashboardStat[]> {
  const supabase = await createClient();
  const t = getDictionary(locale).dashboard.stats;

  const [documents, published, summaries] = await Promise.all([
    supabase.from("documents").select("id", { count: "exact", head: true }),
    supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .not("summary", "is", null),
  ]);

  const firstError = documents.error ?? published.error ?? summaries.error;

  if (firstError) {
    throw new Error(firstError.message);
  }

  const totalCount = documents.count ?? 0;
  const publishedCount = published.count ?? 0;
  const summaryCount = summaries.count ?? 0;

  return [
    {
      label: t.documents,
      value: String(totalCount),
      detail: t.documentsDetail(totalCount),
    },
    {
      label: t.published,
      value: String(publishedCount),
      detail: t.draftsRemaining(Math.max(totalCount - publishedCount, 0)),
    },
    {
      label: t.aiSummaries,
      value: String(summaryCount),
      detail: t.needsSummary(Math.max(totalCount - summaryCount, 0)),
    },
  ];
}

export async function getRecentActivity(locale: Locale, limit = 5): Promise<ActivityRecord[]> {
  const supabase = await createClient();
  const t = getDictionary(locale).dashboard.activity;
  const { data, error } = await supabase
    .from("activity_logs")
    .select(
      `
        id,
        action,
        created_at,
        documents(title)
      `,
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return ((data ?? []) as ActivityRow[]).map((item) => {
    const documentTitle = item.documents?.[0]?.title ?? t.deletedDocument;

    return {
      id: item.id,
      label: `${actionLabel(item.action, locale)} ${documentTitle}`,
      timestamp: formatRelativeTime(item.created_at, locale),
    };
  });
}
