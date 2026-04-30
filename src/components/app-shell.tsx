import Link from "next/link";
import type { ReactNode } from "react";

import { getCurrentUser } from "@/lib/supabase/auth";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/documents", label: "Documents" },
  { href: "/admin", label: "Admin" },
  { href: "/settings", label: "Settings" },
];

type AppShellProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export async function AppShell({ title, description, children }: AppShellProps) {
  const user = await getCurrentUser();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-5 py-5 md:px-8 lg:px-10">
      <header className="rounded-[28px] border border-border bg-panel px-5 py-4 shadow-[var(--shadow)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/" className="text-sm font-semibold uppercase tracking-[0.18em] text-muted">
              Team Knowledge Hub
            </Link>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{description}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-full border border-border bg-panel-strong px-4 py-2 text-sm font-medium transition hover:bg-white"
                >
                  Sign out
                </button>
              </form>
            ) : null}
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full border border-border px-4 py-2 text-sm font-medium transition",
                  "hover:bg-accent-soft",
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-[28px] border border-border bg-panel p-4">
          <div className="mb-4 rounded-2xl border border-border bg-panel-strong px-4 py-3">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Session</p>
            <p className="mt-2 text-sm font-medium text-foreground">
              {user?.email ?? "No active session"}
            </p>
          </div>
          <nav className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl px-4 py-3 text-sm text-muted transition hover:bg-panel-strong hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              className="block rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
            >
              Login scaffold
            </Link>
          </nav>
        </aside>
        <section className="rounded-[28px] border border-border bg-panel p-5 md:p-6">{children}</section>
      </div>
    </div>
  );
}
