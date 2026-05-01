import type { ActivityRecord } from "@/types";

type ActivityListProps = {
  activity: ActivityRecord[];
  title: string;
  emptyMessage: string;
};

export function ActivityList({ activity, title, emptyMessage }: ActivityListProps) {
  return (
    <div className="rounded-[24px] border border-border bg-panel-strong p-4 sm:p-5">
      <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-4 space-y-3">
        {activity.length > 0 ? (
          activity.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-border bg-background/35 px-4 py-3"
            >
              <p className="text-sm font-medium leading-6 text-foreground">{item.label}</p>
              <p className="mt-1 text-xs text-muted">{item.timestamp}</p>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-background/30 px-4 py-6 text-sm leading-6 text-muted">
            {emptyMessage}
          </div>
        )}
      </div>
    </div>
  );
}
