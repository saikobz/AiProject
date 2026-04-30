import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { getMockDocumentById } from "@/features/documents/mock-data";
import { requireUser } from "@/lib/supabase/auth";

type EditDocumentPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditDocumentPage({ params }: EditDocumentPageProps) {
  await requireUser();
  const { id } = await params;
  const document = getMockDocumentById(id);

  if (!document) {
    notFound();
  }

  return (
    <AppShell
      title={`Edit: ${document.title}`}
      description="Editing scaffold that should later connect to validation, persistence, and activity logging."
    >
      <form className="grid gap-4">
        <input defaultValue={document.title} className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
        <input defaultValue={document.category} className="rounded-2xl border border-border bg-panel-strong px-4 py-3" />
        <textarea defaultValue={document.content} className="min-h-64 rounded-2xl border border-border bg-panel-strong px-4 py-3" />
        <div className="flex flex-wrap gap-3">
          <button type="button" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
            Save changes
          </button>
          <button type="button" className="rounded-full border border-border px-5 py-3 text-sm font-semibold">
            Delete document
          </button>
        </div>
      </form>
    </AppShell>
  );
}
