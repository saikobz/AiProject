import Link from "next/link";

import { DashboardPreview } from "@/components/dashboard-preview";
import { FeatureCard } from "@/components/feature-card";
import { SetupNotice } from "@/components/setup-notice";
import { getMockDashboardStats, getMockDocuments } from "@/features/documents/mock-data";

const features = [
  {
    title: "Document knowledge base",
    description:
      "Store SOPs, onboarding notes, FAQs, and internal references with tags, categories, and search.",
  },
  {
    title: "AI summary and Q&A",
    description:
      "Use Gemini to summarize documents and answer questions from a single document context.",
  },
  {
    title: "Production-ready foundations",
    description:
      "Scaffolded with Next.js App Router, Supabase SSR helpers, typed validation, and API routes.",
  },
];

export default function Home() {
  const stats = getMockDashboardStats();
  const documents = getMockDocuments().slice(0, 3);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-10 px-6 py-6 md:px-10 lg:px-12">
      <section className="overflow-hidden rounded-[32px] border border-border bg-panel shadow-[var(--shadow)]">
        <div className="grid gap-10 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.2fr_0.8fr] lg:px-12">
          <div className="space-y-8">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
              <span className="rounded-full border border-border bg-panel-strong px-3 py-1">
                Full-stack portfolio scaffold
              </span>
              <span>Next.js + Supabase + Gemini</span>
            </div>
            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
                Team Knowledge Hub with AI search, summaries, and clean full-stack architecture.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-muted md:text-lg">
                This starter turns your roadmap into a project skeleton you can keep building for
                your portfolio. It includes app routes, Supabase wiring, Gemini route handlers,
                dashboard placeholders, and README setup guidance.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard"
                className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white transition hover:bg-accent-strong"
              >
                Open dashboard
              </Link>
              <Link
                href="/documents"
                className="rounded-full border border-border px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-accent-soft"
              >
                Browse documents
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-border bg-panel-strong px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-white"
              >
                Review auth flow
              </Link>
            </div>
            <SetupNotice />
          </div>
          <DashboardPreview stats={stats} documents={documents} />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </section>

      <section className="grid gap-6 rounded-[28px] border border-border bg-panel px-6 py-6 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div className="space-y-3">
          <h2 className="text-2xl font-semibold tracking-tight">Included in the scaffold</h2>
          <p className="text-sm leading-7 text-muted">
            The current scaffold focuses on the shape of a strong portfolio app: route structure,
            reusable UI primitives, environment setup, API placeholders, and typed mock data to
            keep the UI useful before your backend is fully wired.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-muted md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-panel-strong p-4">
            <h3 className="font-semibold text-foreground">Routes</h3>
            <p className="mt-2">Dashboard, documents, auth, admin, settings, and AI API routes.</p>
          </div>
          <div className="rounded-2xl border border-border bg-panel-strong p-4">
            <h3 className="font-semibold text-foreground">Integrations</h3>
            <p className="mt-2">Supabase SSR client helpers and Gemini server utilities.</p>
          </div>
          <div className="rounded-2xl border border-border bg-panel-strong p-4">
            <h3 className="font-semibold text-foreground">Validation</h3>
            <p className="mt-2">Zod schemas for document input and AI prompts.</p>
          </div>
          <div className="rounded-2xl border border-border bg-panel-strong p-4">
            <h3 className="font-semibold text-foreground">Portfolio docs</h3>
            <p className="mt-2">README plus roadmap file to guide your next implementation steps.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
