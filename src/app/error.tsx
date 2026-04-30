"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-5 py-10">
      <section className="w-full rounded-2xl border border-border bg-panel p-6 shadow-[var(--shadow)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">Application error</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          {error.message || "The app could not complete this request. Try again after a moment."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-strong"
        >
          Try again
        </button>
      </section>
    </main>
  );
}
