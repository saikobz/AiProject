import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-8">
      <section className="w-full rounded-[32px] border border-border bg-panel p-8 shadow-[var(--shadow)]">
        <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-3 text-sm leading-7 text-muted">
          This is the auth scaffold. Replace the button handler with Supabase sign-in once your project keys are configured.
        </p>
        <form className="mt-8 grid gap-4">
          <input type="email" placeholder="Email address" className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
          <input type="password" placeholder="Password" className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
          <button type="button" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
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
