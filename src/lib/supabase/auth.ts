import { redirect } from "next/navigation";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/types";

type ProfileRecord = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
};

export const getCurrentUser = cache(async () => {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    return null;
  }

  const supabase = await createClient();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  } catch {
    return null;
  }
});

export const getCurrentProfile = cache(async (): Promise<ProfileRecord | null> => {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
});

export async function requireUser(loginPath = "/th/login") {
  const user = await getCurrentUser();

  if (!user) {
    redirect(loginPath);
  }

  return user;
}

export async function requireAdmin(
  loginPath = "/th/login",
  fallbackPath = "/th/dashboard",
) {
  const user = await requireUser(loginPath);
  const profile = await getCurrentProfile();

  if (profile?.role !== "admin") {
    redirect(fallbackPath);
  }

  return { user, profile };
}

export function canManageDocument(authorId: string, userId: string, isAdmin: boolean) {
  return isAdmin || authorId === userId;
}
