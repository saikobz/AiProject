import { AppShell } from "@/components/app-shell";
import { getLocale, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireUser } from "@/lib/supabase/auth";

export const unstable_dynamicStaleTime = 60;

type AdminPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AdminPage({ params }: AdminPageProps) {
  const { locale: localeParam } = await params;
  const locale = getLocale(localeParam);
  const user = await requireUser(withLocale(locale, "/login"));
  const dict = getDictionary(locale);

  return (
    <AppShell
      locale={locale}
      title={dict.admin.title}
      description={dict.admin.description}
      currentUserEmail={user.email}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-[24px] border border-border bg-panel-strong p-4 sm:p-5">
          <h2 className="text-lg font-semibold tracking-tight">{dict.admin.roles}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{dict.admin.rolesDescription}</p>
        </section>
        <section className="rounded-[24px] border border-border bg-panel-strong p-4 sm:p-5">
          <h2 className="text-lg font-semibold tracking-tight">{dict.admin.audit}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{dict.admin.auditDescription}</p>
        </section>
      </div>
    </AppShell>
  );
}
