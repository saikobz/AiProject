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

function formatRelativeTime(value: string) {
  const timestamp = new Date(value).getTime();
  const diff = Date.now() - timestamp;
  const minutes = Math.max(0, Math.floor(diff / 60000));

  if (minutes < 1) {
    return "Just now";
  }

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hr ago`;
  }

  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function actionLabel(action: string) {
  const labels: Record<string, string> = {
    "document.created": "Created",
    "document.updated": "Updated",
    "document.deleted": "Deleted",
    "ai.summary.generated": "Generated summary for",
    "ai.question.asked": "Asked AI about",
  };

  return labels[action] ?? action.replaceAll(".", " ");
}

export async function getDashboardStats(): Promise<DashboardStat[]> {
  const supabase = await createClient();

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
      label: "Documents",
      value: String(totalCount),
      detail: totalCount === 1 ? "1 document in Supabase" : `${totalCount} documents in Supabase`,
    },
    {
      label: "Published",
      value: String(publishedCount),
      detail: `${Math.max(totalCount - publishedCount, 0)} drafts remaining`,
    },
    {
      label: "AI summaries",
      value: String(summaryCount),
      detail: `${Math.max(totalCount - summaryCount, 0)} documents need summaries`,
    },
  ];
}

export async function getRecentActivity(limit = 5): Promise<ActivityRecord[]> {
  const supabase = await createClient();
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
    const documentTitle = item.documents?.[0]?.title ?? "a deleted document";

    return {
      id: item.id,
      label: `${actionLabel(item.action)} ${documentTitle}`,
      timestamp: formatRelativeTime(item.created_at),
    };
  });
}
