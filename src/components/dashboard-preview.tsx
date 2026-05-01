import type { DashboardStat, DocumentRecord } from "@/types";

type DashboardPreviewProps = {
  stats: DashboardStat[];
  documents: DocumentRecord[];
  labels: {
    eyebrow: string;
    title: string;
    sampleData: string;
    recentDocuments: string;
  };
};

export function DashboardPreview({ stats, documents, labels }: DashboardPreviewProps) {
  return (
    <section className="relative overflow-hidden rounded-[28px] border border-border bg-panel-strong p-4 shadow-[var(--shadow)] sm:p-5">
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{labels.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold text-foreground">{labels.title}</h2>
        </div>
        <div className="rounded-full border border-border bg-background/40 px-3 py-1 text-xs text-muted">
          {labels.sampleData}
        </div>
      </div>
      <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-background/35 p-4">
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-foreground">{stat.value}</p>
            <p className="mt-2 text-xs leading-5 text-muted">{stat.detail}</p>
          </div>
        ))}
      </div>
      <div className="relative mt-5 rounded-2xl border border-border bg-background/35 p-4">
        <p className="text-sm font-medium text-muted">{labels.recentDocuments}</p>
        <div className="mt-3 space-y-3">
          {documents.map((document) => (
            <div
              key={document.id}
              className="rounded-2xl border border-border bg-panel/70 px-4 py-3 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-medium text-foreground">{document.title}</p>
                  <p className="mt-1 text-xs text-muted">{document.category}</p>
                </div>
                <p className="shrink-0 text-xs text-muted">{document.updatedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
