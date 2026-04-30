export default function Loading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-5 px-4 py-4 md:px-8 lg:px-10">
      <div className="h-36 animate-pulse rounded-2xl border border-border bg-panel" />
      <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
        <div className="h-80 animate-pulse rounded-2xl border border-border bg-panel" />
        <div className="space-y-4 rounded-2xl border border-border bg-panel p-5">
          <div className="h-24 animate-pulse rounded-xl bg-panel-strong" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-28 animate-pulse rounded-xl bg-panel-strong" />
            <div className="h-28 animate-pulse rounded-xl bg-panel-strong" />
            <div className="h-28 animate-pulse rounded-xl bg-panel-strong" />
          </div>
        </div>
      </div>
    </main>
  );
}
