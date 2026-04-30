import { AppShell } from "@/components/app-shell";

export default function NewDocumentPage() {
  return (
    <AppShell
      title="Create document"
      description="Form scaffold for document creation. Replace this with a Server Action or Route Handler connected to Supabase."
    >
      <form className="grid gap-4">
        <input className="rounded-2xl border border-border bg-panel-strong px-4 py-3" placeholder="Document title" />
        <div className="grid gap-4 md:grid-cols-2">
          <input className="rounded-2xl border border-border bg-panel-strong px-4 py-3" placeholder="Category" />
          <input className="rounded-2xl border border-border bg-panel-strong px-4 py-3" placeholder="Tags separated by commas" />
        </div>
        <textarea
          className="min-h-64 rounded-2xl border border-border bg-panel-strong px-4 py-3"
          placeholder="Paste document content here"
        />
        <div className="flex flex-wrap gap-3">
          <button type="button" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white">
            Save draft
          </button>
          <button type="button" className="rounded-full border border-border px-5 py-3 text-sm font-semibold">
            Generate summary later
          </button>
        </div>
      </form>
    </AppShell>
  );
}
