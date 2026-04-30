import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/shared";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (!getSupabaseEnv()) {
    return NextResponse.redirect(`${origin}/login?error=Supabase environment variables are not configured yet.`);
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
