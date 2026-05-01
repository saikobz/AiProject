import Link from "next/link";
import { BarChart3, FileText, LogIn, LogOut, Settings, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { LinkPendingIndicator } from "@/components/link-pending-indicator";
import { withLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCurrentUser } from "@/lib/supabase/auth";

type AppShellProps = {
  locale: Locale;
  title: string;
  description: string;
  children: ReactNode;
  currentUserEmail?: string | null;
};

export async function AppShell({
  locale,
  title,
  description,
  children,
  currentUserEmail,
}: AppShellProps) {
  const fallbackUser = currentUserEmail === undefined ? await getCurrentUser() : null;
  const userEmail = currentUserEmail ?? fallbackUser?.email ?? null;
  const dict = getDictionary(locale);
  const navigation = [
    { href: withLocale(locale, "/dashboard"), label: dict.nav.dashboard, icon: BarChart3 },
    { href: withLocale(locale, "/documents"), label: dict.nav.documents, icon: FileText },
    { href: withLocale(locale, "/admin"), label: dict.nav.admin, icon: ShieldCheck },
    { href: withLocale(locale, "/settings"), label: dict.nav.settings, icon: Settings },
  ];

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-4 px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
      <header className="overflow-hidden rounded-[28px] border border-border bg-panel px-4 py-4 shadow-[var(--shadow)] backdrop-blur-xl sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Link
              href={withLocale(locale, "/")}
              className="inline-flex cursor-pointer items-center rounded-full border border-border bg-accent-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent"
            >
              {dict.common.appName}
            </Link>
            <h1 className="mt-4 max-w-4xl text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {title}
            </h1>
            <p className="mt-2 max-w-3xl text-sm leading-7 text-muted sm:text-base">{description}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <LanguageSwitcher locale={locale} />
            {userEmail ? (
              <form action={`/auth/signout?locale=${locale}`} method="post">
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-panel-strong px-3.5 py-2 text-sm font-medium text-foreground transition hover:border-accent hover:bg-accent-soft"
                >
                  <LogOut className="size-4" aria-hidden="true" />
                  {dict.common.signOut}
                </button>
              </form>
            ) : null}
          </div>
        </div>
        <nav className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1 lg:hidden">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-border bg-panel-strong px-3.5 py-2 text-sm font-medium text-muted transition hover:border-accent hover:bg-accent-soft hover:text-foreground"
            >
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
              <LinkPendingIndicator />
            </Link>
          ))}
          {!userEmail ? (
            <Link
              href={withLocale(locale, "/login")}
              className="inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-full bg-accent px-3.5 py-2 text-sm font-semibold text-background transition hover:bg-accent-strong"
            >
              <LogIn className="size-4" aria-hidden="true" />
              {dict.common.signIn}
              <LinkPendingIndicator className="text-background" />
            </Link>
          ) : null}
        </nav>
      </header>
      <div className="grid min-w-0 gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="hidden rounded-[28px] border border-border bg-panel p-4 shadow-[var(--shadow)] backdrop-blur-xl lg:block">
          <div className="mb-4 rounded-2xl border border-border bg-panel-strong px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{dict.common.session}</p>
            <p className="mt-2 truncate text-sm font-medium text-foreground">
              {userEmail ?? dict.common.noSession}
            </p>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted transition hover:bg-accent-soft hover:text-foreground"
              >
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
                <LinkPendingIndicator />
              </Link>
            ))}
            {!userEmail ? (
              <Link
                href={withLocale(locale, "/login")}
                className="flex cursor-pointer items-center gap-3 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-background transition hover:bg-accent-strong"
              >
                <LogIn className="size-4" aria-hidden="true" />
                {dict.common.signIn}
                <LinkPendingIndicator className="text-background" />
              </Link>
            ) : null}
          </nav>
        </aside>
        <section className="min-w-0 rounded-[28px] border border-border bg-panel p-4 shadow-[var(--shadow)] backdrop-blur-xl sm:p-5 lg:p-6">
          {children}
        </section>
      </div>
    </div>
  );
}
