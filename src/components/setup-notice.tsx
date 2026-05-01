type SetupNoticeProps = {
  labels: {
    configuredTitle: string;
    missingTitle: string;
    configuredDescription: string;
    missingDescription: string;
  };
};

export function SetupNotice({ labels }: SetupNoticeProps) {
  const isConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) &&
    Boolean(process.env.GEMINI_API_KEY);

  return (
    <div className="rounded-[24px] border border-border bg-panel-strong p-4 text-sm text-muted">
      <p className="font-semibold text-foreground">
        {isConfigured ? labels.configuredTitle : labels.missingTitle}
      </p>
      <p className="mt-2 leading-7">
        {isConfigured ? labels.configuredDescription : labels.missingDescription}
      </p>
    </div>
  );
}
