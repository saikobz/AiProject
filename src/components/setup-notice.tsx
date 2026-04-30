export function SetupNotice() {
  const isConfigured =
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) &&
    Boolean(process.env.GEMINI_API_KEY);

  return (
    <div className="rounded-[24px] border border-border bg-panel-strong p-4 text-sm text-muted">
      <p className="font-semibold text-foreground">
        {isConfigured ? "Environment looks configured." : "Environment setup still required."}
      </p>
      <p className="mt-2 leading-7">
        {isConfigured
          ? "You can start replacing mock data with real Supabase queries and wire AI actions to the route handlers."
          : "Add values to .env.local for Supabase and Gemini before you wire auth, persistence, and AI actions into production flows."}
      </p>
    </div>
  );
}
