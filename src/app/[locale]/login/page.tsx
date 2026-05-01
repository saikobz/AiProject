import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { LinkPendingIndicator } from "@/components/link-pending-indicator";
import { getLocale, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

import { login } from "./actions";

type LoginPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ params, searchParams }: LoginPageProps) {
  const { locale: localeParam } = await params;
  const locale = getLocale(localeParam);
  const dict = getDictionary(locale);
  const query = (await searchParams) ?? {};

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-6 sm:px-6 sm:py-8">
      <section className="w-full rounded-[32px] border border-border bg-panel p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">{dict.auth.signInTitle}</h1>
          <LanguageSwitcher locale={locale} />
        </div>
        <p className="mt-3 text-sm leading-7 text-muted">{dict.auth.signInDescription}</p>
        {query.error ? (
          <div className="mt-6 rounded-2xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {query.error}
          </div>
        ) : null}
        <form className="mt-8 grid gap-4">
          <input type="hidden" name="locale" value={locale} />
          <input type="hidden" name="next" value={query.next ?? withLocale(locale, "/dashboard")} />
          <input name="email" type="email" placeholder={dict.auth.email} className="rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft" />
          <input name="password" type="password" placeholder={dict.auth.password} className="rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft" />
          <button formAction={login} className="cursor-pointer rounded-full bg-accent px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent-strong">
            {dict.common.signIn}
          </button>
        </form>
        <p className="mt-6 text-sm text-muted">
          {dict.auth.needAccount}{" "}
          <Link href={withLocale(locale, "/signup")} className="cursor-pointer font-semibold text-accent transition hover:text-accent-strong">
            {dict.auth.createOne}
            <LinkPendingIndicator className="ml-1 inline" />
          </Link>
        </p>
      </section>
    </main>
  );
}
