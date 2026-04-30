import { ActivityList } from "@/components/activity-list";
import { AppShell } from "@/components/app-shell";
import { StatGrid } from "@/components/stat-grid";
import { getMockActivity, getMockDashboardStats, getMockDocuments } from "@/features/documents/mock-data";

export default function DashboardPage() {
  const stats = getMockDashboardStats();
  const documents = getMockDocuments().slice(0, 2);
  const activity = getMockActivity();

  return (
    <AppShell
      title="Dashboard"
      description="This page is ready for real metrics once Supabase queries replace the mock dataset."
    >
      <div className="space-y-6">
        <StatGrid stats={stats} />
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[24px] border border-border bg-panel-strong p-5">
            <h2 className="text-lg font-semibold tracking-tight">Priority documents</h2>
            <div className="mt-4 space-y-3">
              {documents.map((document) => (
                <div key={document.id} className="rounded-2xl border border-border bg-white px-4 py-3">
                  <p className="font-medium">{document.title}</p>
                  <p className="mt-1 text-sm text-muted">{document.summary}</p>
                </div>
              ))}
            </div>
          </div>
          <ActivityList activity={activity} />
        </div>
      </div>
    </AppShell>
  );
}
