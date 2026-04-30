import Link from "next/link";

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-8">
      <section className="w-full rounded-[32px] border border-border bg-panel p-8 shadow-[var(--shadow)]">
        <h1 className="text-3xl font-semibold tracking-tight">Create account</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          Scaffold for Supabase email/password or magic-link sign up. Keep this page and wire it when auth is ready.
        </p>
        <form className="mt-8 grid gap-4">
          <input placeholder="Full name" className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
          <input type="email" placeholder="Email address" className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
          <input type="password" placeholder="Password" className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
          <button type="button" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
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
