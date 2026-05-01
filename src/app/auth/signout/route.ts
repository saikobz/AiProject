import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { normalizeLocale, withLocale } from "@/lib/i18n/config";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/shared";

export async function POST(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const locale = normalizeLocale(searchParams.get("locale"));

  if (!getSupabaseEnv()) {
    return NextResponse.redirect(`${origin}${withLocale(locale, "/login")}`, { status: 302 });
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");

  return NextResponse.redirect(`${origin}${withLocale(locale, "/login")}`, { status: 302 });
}
