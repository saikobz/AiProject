"use client";

import { useParams } from "next/navigation";

import { getLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams<{ locale?: string }>();
  const locale = getLocale(params.locale);
  const dict = getDictionary(locale);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl items-center px-5 py-10">
      <section className="w-full rounded-2xl border border-border bg-panel p-6 shadow-[var(--shadow)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">{dict.states.errorLabel}</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">{dict.states.errorTitle}</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          {error.message || dict.states.errorDescription}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 cursor-pointer rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-background transition hover:bg-accent-strong"
        >
          {dict.common.tryAgain}
        </button>
      </section>
    </main>
  );
}
