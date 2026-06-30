import { NextResponse } from "next/server";

import { defaultLocale, getLocaleFromPath, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { safeNextPath } from "@/lib/navigation/safe-path";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/shared";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? withLocale(defaultLocale, "/dashboard");
  const locale = getLocaleFromPath(nextParam);
  const dict = getDictionary(locale);
  const loginErrorUrl = (message: string) =>
    `${origin}${withLocale(locale, "/login")}?error=${encodeURIComponent(message)}`;

  if (!getSupabaseEnv()) {
    return NextResponse.redirect(loginErrorUrl(dict.system.supabaseMissing));
  }

  if (!code) {
    return NextResponse.redirect(loginErrorUrl(dict.system.authCallbackFailed));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(loginErrorUrl(error.message));
  }

  const destination = safeNextPath(nextParam, locale);
  return NextResponse.redirect(`${origin}${destination}`);
}
