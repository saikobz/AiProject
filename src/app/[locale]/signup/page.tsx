import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { LinkPendingIndicator } from "@/components/link-pending-indicator";
import { getLocale, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

import { signup } from "../login/actions";

type SignupPageProps = {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function SignupPage({ params, searchParams }: SignupPageProps) {
  const { locale: localeParam } = await params;
  const locale = getLocale(localeParam);
  const dict = getDictionary(locale);
  const query = (await searchParams) ?? {};

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4 py-6 sm:px-6 sm:py-8">
      <section className="w-full rounded-[32px] border border-border bg-panel p-5 shadow-[var(--shadow)] backdrop-blur-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight">{dict.auth.signUpTitle}</h1>
          <LanguageSwitcher locale={locale} />
        </div>
        <p className="mt-3 text-sm leading-7 text-muted">{dict.auth.signUpDescription}</p>
        {query.success ? (
          <div className="mt-6 rounded-2xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {query.success}
          </div>
        ) : null}
        {query.error ? (
          <div className="mt-6 rounded-2xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-100">
            {query.error}
          </div>
        ) : null}
        <form className="mt-8 grid gap-4">
          <input type="hidden" name="locale" value={locale} />
          <input name="full_name" placeholder={dict.auth.fullName} className="rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft" />
          <input name="email" type="email" placeholder={dict.auth.email} className="rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft" />
          <input name="password" type="password" placeholder={dict.auth.password} className="rounded-2xl border border-border bg-background/35 px-4 py-3 outline-none transition placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent-soft" />
          <button formAction={signup} className="cursor-pointer rounded-full bg-accent px-5 py-3 text-sm font-semibold text-background transition hover:bg-accent-strong">
            {dict.auth.createAccount}
          </button>
        </form>
        <p className="mt-6 text-sm text-muted">
          {dict.auth.haveAccount}{" "}
          <Link href={withLocale(locale, "/login")} className="cursor-pointer font-semibold text-accent transition hover:text-accent-strong">
            {dict.common.signIn}
            <LinkPendingIndicator className="ml-1 inline" />
          </Link>
        </p>
      </section>
    </main>
  );
}
