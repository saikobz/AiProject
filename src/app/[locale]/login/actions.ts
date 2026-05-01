"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { normalizeLocale, withLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/shared";

function getRedirectUrl(path: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return `${siteUrl ?? "http://localhost:3000"}${path}`;
}

function getErrorRedirect(locale: ReturnType<typeof normalizeLocale>, message: string) {
  return `${withLocale(locale, "/login")}?error=${encodeURIComponent(message)}`;
}

function safeNextPath(next: string, locale: ReturnType<typeof normalizeLocale>) {
  if (!next.startsWith("/") || next.startsWith("//")) {
    return withLocale(locale, "/dashboard");
  }

  return next;
}

export async function login(formData: FormData) {
  const locale = normalizeLocale(formData.get("locale"));
  const dict = getDictionary(locale);

  if (!getSupabaseEnv()) {
    redirect(getErrorRedirect(locale, dict.system.supabaseMissing));
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? withLocale(locale, "/dashboard"));

  if (!email || !password) {
    redirect(getErrorRedirect(locale, dict.system.emailPasswordRequired));
  }

  await headers();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(getErrorRedirect(locale, error.message));
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(next, locale));
}

export async function signup(formData: FormData) {
  const locale = normalizeLocale(formData.get("locale"));
  const dict = getDictionary(locale);

  if (!getSupabaseEnv()) {
    redirect(`${withLocale(locale, "/signup")}?error=${encodeURIComponent(dict.system.supabaseMissing)}`);
  }

  const fullName = String(formData.get("full_name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    redirect(`${withLocale(locale, "/signup")}?error=${encodeURIComponent(dict.system.signupRequired)}`);
  }

  await headers();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getRedirectUrl(`/auth/callback?next=${encodeURIComponent(withLocale(locale, "/dashboard"))}`),
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(`${withLocale(locale, "/signup")}?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/", "layout");
  redirect(`${withLocale(locale, "/signup")}?success=${encodeURIComponent(dict.system.confirmEmail)}`);
}
