export default function LocaleLoading() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-4 px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
      <div className="h-40 animate-pulse rounded-[28px] border border-border bg-panel" />
      <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="hidden h-80 animate-pulse rounded-[28px] border border-border bg-panel lg:block" />
        <div className="space-y-4 rounded-[28px] border border-border bg-panel p-4 sm:p-5">
          <div className="h-24 animate-pulse rounded-2xl bg-panel-strong" />
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="h-28 animate-pulse rounded-2xl bg-panel-strong" />
            <div className="h-28 animate-pulse rounded-2xl bg-panel-strong" />
            <div className="h-28 animate-pulse rounded-2xl bg-panel-strong" />
          </div>
        </div>
      </div>
    </main>
  );
}
