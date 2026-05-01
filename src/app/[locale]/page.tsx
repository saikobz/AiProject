import Link from "next/link";

import { DashboardPreview } from "@/components/dashboard-preview";
import { FeatureCard } from "@/components/feature-card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { LinkPendingIndicator } from "@/components/link-pending-indicator";
import { SetupNotice } from "@/components/setup-notice";
import { getMockDashboardStats, getMockDocuments } from "@/features/documents/mock-data";
import { getLocale, withLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type HomeProps = {
  params: Promise<{ locale: string }>;
};

export default async function Home({ params }: HomeProps) {
  const { locale: localeParam } = await params;
  const locale = getLocale(localeParam);
  const dict = getDictionary(locale);
  const stats = getMockDashboardStats(locale);
  const documents = getMockDocuments().slice(0, 3);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col gap-6 px-3 py-3 sm:px-5 sm:py-5 lg:px-8">
      <section className="relative overflow-hidden rounded-[32px] border border-border bg-panel shadow-[var(--shadow)] backdrop-blur-xl">
        <div className="pointer-events-none absolute -left-24 top-10 size-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="pointer-events-none absolute -right-20 bottom-0 size-80 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative grid gap-8 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1.08fr_0.92fr] lg:px-8 lg:py-10 xl:px-10">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="rounded-full border border-border bg-accent-soft px-3 py-1 text-accent">
                {dict.home.badge}
              </span>
              <span>Next.js + Supabase + Gemini</span>
              <LanguageSwitcher locale={locale} />
            </div>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
                {dict.home.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted md:text-lg">
                {dict.home.description}
              </p>
            </div>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <Link
                href={withLocale(locale, "/dashboard")}
                className="cursor-pointer rounded-full bg-accent px-5 py-3 text-center text-sm font-semibold text-background transition hover:bg-accent-strong"
              >
                {dict.home.openDashboard}
                <LinkPendingIndicator className="ml-2 inline text-background" />
              </Link>
              <Link
                href={withLocale(locale, "/documents")}
                className="cursor-pointer rounded-full border border-border bg-panel-strong px-5 py-3 text-center text-sm font-semibold text-foreground transition hover:border-accent hover:bg-accent-soft"
              >
                {dict.home.browseDocuments}
                <LinkPendingIndicator className="ml-2 inline" />
              </Link>
              <Link
                href={withLocale(locale, "/login")}
                className="cursor-pointer rounded-full border border-border bg-background/35 px-5 py-3 text-center text-sm font-semibold text-foreground transition hover:border-accent hover:bg-accent-soft"
              >
                {dict.home.reviewAuth}
                <LinkPendingIndicator className="ml-2 inline" />
              </Link>
            </div>
            <SetupNotice labels={getSetupNoticeLabels(locale)} />
          </div>
          <DashboardPreview stats={stats} documents={documents} labels={getPreviewLabels(locale)} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {dict.home.features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </section>

      <section className="grid gap-6 rounded-[28px] border border-border bg-panel px-4 py-5 shadow-[var(--shadow)] backdrop-blur-xl sm:px-6 sm:py-6 lg:grid-cols-[0.82fr_1.18fr]">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">{dict.home.featuresTitle}</h2>
          <p className="text-sm leading-7 text-muted">{dict.home.featuresDescription}</p>
        </div>
        <div className="grid gap-3 text-sm text-muted md:grid-cols-2">
          {dict.home.supportCards.map((card) => (
            <div key={card.title} className="rounded-2xl border border-border bg-panel-strong p-4">
              <h3 className="font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2">{card.description}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function getPreviewLabels(locale: Locale) {
  if (locale === "en") {
    return {
      eyebrow: "Preview",
      title: "Dashboard overview",
      sampleData: "Sample data",
      recentDocuments: "Recent documents",
    };
  }

  return {
    eyebrow: "ตัวอย่าง",
    title: "ภาพรวมแดชบอร์ด",
    sampleData: "ข้อมูลตัวอย่าง",
    recentDocuments: "เอกสารล่าสุด",
  };
}

function getSetupNoticeLabels(locale: Locale) {
  if (locale === "en") {
    return {
      configuredTitle: "Environment configured",
      missingTitle: "Environment setup required",
      configuredDescription: "The app is ready to connect Supabase and Gemini for real usage.",
      missingDescription: "Add .env.local values for Supabase and Gemini before using auth, database, and AI.",
    };
  }

  return {
    configuredTitle: "ตั้งค่า Environment แล้ว",
    missingTitle: "ยังต้องตั้งค่า Environment",
    configuredDescription: "ระบบพร้อมเชื่อมต่อ Supabase และ Gemini สำหรับใช้งานจริงแล้ว",
    missingDescription: "เพิ่มค่าใน .env.local สำหรับ Supabase และ Gemini ก่อนใช้งาน auth, database และ AI",
  };
}
