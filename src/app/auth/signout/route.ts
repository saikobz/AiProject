import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/shared";

export async function POST(request: Request) {
  if (!getSupabaseEnv()) {
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(`${origin}/login`, { status: 302 });
  }

  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/", "layout");

  const origin = new URL(request.url).origin;
  return NextResponse.redirect(`${origin}/login`, { status: 302 });
}
