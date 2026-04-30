import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseEnv } from "./shared";

export function createClient() {
  const env = getSupabaseEnv();

  if (!env) {
    throw new Error("Supabase environment variables are missing.");
  }

  return createBrowserClient(env.url, env.publishableKey);
}
