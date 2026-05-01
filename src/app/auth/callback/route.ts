import { NextResponse } from "next/server";

import { defaultLocale, getLocaleFromPath, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/shared";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? withLocale(defaultLocale, "/dashboard");
  const locale = getLocaleFromPath(next);
  const dict = getDictionary(locale);

  if (!getSupabaseEnv()) {
    return NextResponse.redirect(
      `${origin}${withLocale(locale, "/login")}?error=${encodeURIComponent(dict.system.supabaseMissing)}`,
    );
  }

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${origin}${next}`);
}
