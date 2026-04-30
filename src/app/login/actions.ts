"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/shared";

function getRedirectUrl(path = "/dashboard") {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  return `${siteUrl ?? "http://localhost:3000"}${path}`;
}

function getErrorRedirect(message: string) {
  return `/login?error=${encodeURIComponent(message)}`;
}

export async function login(formData: FormData) {
  if (!getSupabaseEnv()) {
    redirect(getErrorRedirect("Supabase environment variables are not configured yet."));
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/dashboard");

  if (!email || !password) {
    redirect(getErrorRedirect("Email and password are required."));
  }

  await headers();
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(getErrorRedirect(error.message));
  }

  revalidatePath("/", "layout");
  redirect(next.startsWith("/") ? next : "/dashboard");
}

export async function signup(formData: FormData) {
  if (!getSupabaseEnv()) {
    redirect(getErrorRedirect("Supabase environment variables are not configured yet."));
  }

  const fullName = String(formData.get("full_name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    redirect(getErrorRedirect("Full name, email, and password are required."));
  }

  await headers();
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getRedirectUrl("/auth/callback"),
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(getErrorRedirect(error.message));
  }

  revalidatePath("/", "layout");
  redirect("/signup?success=Check your email to confirm your account.");
}
