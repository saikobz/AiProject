import type { DashboardStat } from "@/types";

type StatGridProps = {
  stats: DashboardStat[];
};

export function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-[24px] border border-border bg-panel-strong p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] sm:p-5"
        >
          <p className="text-sm font-medium text-muted">{stat.label}</p>
          <p className="mt-3 font-mono text-3xl font-semibold text-foreground">{stat.value}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{stat.detail}</p>
        </article>
      ))}
    </div>
  );
}
