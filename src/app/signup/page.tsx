import Link from "next/link";

import { signup } from "@/app/login/actions";

type SignupPageProps = {
  searchParams?: Promise<{
    success?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = (await searchParams) ?? {};

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-8">
      <section className="w-full rounded-[32px] border border-border bg-panel p-8 shadow-[var(--shadow)]">
        <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          Create an account with Supabase Auth. After sign-up, the user should confirm their email and return through the callback route.
        </p>
        {params.success ? (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            {params.success}
          </div>
        ) : null}
        <form className="mt-8 grid gap-4">
          <input name="full_name" placeholder="Full name" className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
          <input name="email" type="email" placeholder="Email address" className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
          <input name="password" type="password" placeholder="Password" className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
          <button formAction={signup} className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
            Create account
          </button>
        </form>
        <p className="mt-6 text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-accent">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
