import type { DashboardStat } from "@/types";

type StatGridProps = {
  stats: DashboardStat[];
};

export function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <article key={stat.label} className="rounded-[24px] border border-border bg-panel-strong p-5">
          <p className="text-sm text-muted">{stat.label}</p>
          <p className="mt-3 font-mono text-3xl font-semibold">{stat.value}</p>
          <p className="mt-2 text-sm text-muted">{stat.detail}</p>
        </article>
      ))}
    </div>
  );
}
