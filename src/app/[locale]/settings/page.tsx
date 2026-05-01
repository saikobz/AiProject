import { AppShell } from "@/components/app-shell";
import { getLocale, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { requireUser } from "@/lib/supabase/auth";

export const unstable_dynamicStaleTime = 60;

type SettingsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { locale: localeParam } = await params;
  const locale = getLocale(localeParam);
  const user = await requireUser(withLocale(locale, "/login"));
  const dict = getDictionary(locale);

  return (
    <AppShell
      locale={locale}
      title={dict.settings.title}
      description={dict.settings.description}
      currentUserEmail={user.email}
    >
      <div className="grid gap-4">
        <section className="rounded-[24px] border border-border bg-panel-strong p-4 sm:p-5">
          <h2 className="text-lg font-semibold tracking-tight">{dict.settings.envChecklist}</h2>
          <ul className="mt-4 space-y-2 text-sm leading-7 text-muted">
            <li>`NEXT_PUBLIC_SUPABASE_URL`</li>
            <li>`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`</li>
            <li>`GEMINI_API_KEY`</li>
          </ul>
        </section>
        <section className="rounded-[24px] border border-border bg-panel-strong p-4 sm:p-5">
          <h2 className="text-lg font-semibold tracking-tight">{dict.settings.nextTargets}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{dict.settings.nextTargetsDescription}</p>
        </section>
      </div>
    </AppShell>
  );
}
