import type { DashboardStat, DocumentRecord } from "@/types";

type DashboardPreviewProps = {
  stats: DashboardStat[];
  documents: DocumentRecord[];
};

export function DashboardPreview({ stats, documents }: DashboardPreviewProps) {
  return (
    <section className="rounded-[28px] border border-border bg-[#2f241e] p-5 text-white shadow-[0_18px_40px_rgba(20,10,2,0.24)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-orange-100/70">Preview</p>
          <h2 className="mt-2 text-2xl font-semibold">Dashboard snapshot</h2>
        </div>
        <div className="rounded-full bg-white/10 px-3 py-1 text-xs text-orange-50">Mock data</div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-orange-100/70">{stat.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold">{stat.value}</p>
            <p className="mt-2 text-xs text-orange-100/70">{stat.detail}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm text-orange-100/70">Recent documents</p>
        <div className="mt-3 space-y-3">
          {documents.map((document) => (
            <div
              key={document.id}
              className="rounded-2xl border border-white/8 bg-black/10 px-4 py-3 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{document.title}</p>
                  <p className="mt-1 text-xs text-orange-100/70">{document.category}</p>
                </div>
                <p className="text-xs text-orange-100/70">{document.updatedAt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
