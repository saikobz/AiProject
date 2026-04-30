import { AppShell } from "@/components/app-shell";
import { requireUser } from "@/lib/supabase/auth";

export default async function AdminPage() {
  await requireUser();
  return (
    <AppShell
      title="Admin overview"
      description="Reserve this route for role-restricted features such as user roles, category management, and audit review."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-[24px] border border-border bg-panel-strong p-5">
          <h2 className="text-lg font-semibold tracking-tight">Role management</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Future work: list users, promote admins, and store role data in a safe authorization path.
          </p>
        </section>
        <section className="rounded-[24px] border border-border bg-panel-strong p-5">
          <h2 className="text-lg font-semibold tracking-tight">Audit trail</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Future work: surface create, update, delete, and AI usage events from activity logs.
          </p>
        </section>
      </div>
    </AppShell>
  );
}
