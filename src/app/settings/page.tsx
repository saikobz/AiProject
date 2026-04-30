import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/supabase/auth";

export default async function SettingsPage() {
  await requireUser();
  return (
    <AppShell
      title="Settings"
      description="Use this route for profile details, API status, and future preferences such as notification or summary defaults."
    >
      <div className="grid gap-4">
        <section className="rounded-[24px] border border-border bg-panel-strong p-5">
          <h2 className="text-lg font-semibold tracking-tight">Environment checklist</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <li>`NEXT_PUBLIC_SUPABASE_URL`</li>
            <li>`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`</li>
            <li>`GEMINI_API_KEY`</li>
          </ul>
        </section>
        <section className="rounded-[24px] border border-border bg-panel-strong p-5">
          <h2 className="text-lg font-semibold tracking-tight">Next implementation targets</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Connect Supabase auth, create database migrations, replace mock data with queries, and persist AI results.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
