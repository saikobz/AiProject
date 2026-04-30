import Link from "next/link";

import { login } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-8">
      <section className="w-full rounded-[32px] border border-border bg-panel p-8 shadow-[var(--shadow)]">
        <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          Sign in with Supabase email and password. If your environment variables are missing, this page will not be able to create a real session yet.
        </p>
        {params.error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {params.error}
          </div>
        ) : null}
        <form className="mt-8 grid gap-4">
          <input type="hidden" name="next" value={params.next ?? "/dashboard"} />
          <input name="email" type="email" placeholder="Email address" className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
          <input name="password" type="password" placeholder="Password" className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
          <button formAction={login} className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
            Sign in
          </button>
        </form>
        <p className="mt-6 text-sm text-muted">
          Need an account?{" "}
          <Link href="/signup" className="font-semibold text-accent">
            Create one
          </Link>
        </p>
      </section>
    </main>
  );
}
