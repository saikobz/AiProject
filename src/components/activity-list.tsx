import type { ActivityRecord } from "@/types";

type ActivityListProps = {
  activity: ActivityRecord[];
};

export function ActivityList({ activity }: ActivityListProps) {
  return (
    <div className="rounded-[24px] border border-border bg-panel-strong p-5">
      <h2 className="text-lg font-semibold tracking-tight">Recent activity</h2>
      <div className="mt-4 space-y-3">
        {activity.map((item) => (
          <div key={item.id} className="rounded-2xl border border-border bg-white px-4 py-3">
            <p className="text-sm font-medium">{item.label}</p>
            <p className="mt-1 text-xs text-muted">{item.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
