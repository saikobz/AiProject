import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, getLocaleFromPath, isLocale, withLocale } from "@/lib/i18n/config";
import { getSupabaseEnv } from "@/lib/supabase/shared";

const protectedRoutes = ["/dashboard", "/documents", "/admin", "/settings"];
const authRoutes = ["/login", "/signup"];
const localizedRouteRoots = [...protectedRoutes, ...authRoutes];

function pathWithoutLocale(pathname: string) {
  const segments = pathname.split("/");
  return isLocale(segments[1]) ? `/${segments.slice(2).join("/")}`.replace(/\/$/, "") || "/" : pathname;
}

function shouldLocalize(pathname: string) {
  return localizedRouteRoots.some((path) => pathname === path || pathname.startsWith(`${path}/`));
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url));
  }

  if (!isLocale(pathname.split("/")[1]) && shouldLocalize(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = withLocale(defaultLocale, pathname);
    return NextResponse.redirect(url);
  }

  const locale = getLocaleFromPath(pathname);
  const routePath = pathWithoutLocale(pathname);
  const isProtected = protectedRoutes.some(
    (path) => routePath === path || routePath.startsWith(`${path}/`),
  );
  const isAuthPage = authRoutes.some((path) => routePath === path);
  const env = getSupabaseEnv();

  if (!env) {
    return NextResponse.next({ request });
  }

  const response = NextResponse.next({ request });

  const supabase = createServerClient(env.url, env.publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value);
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = withLocale(locale, "/login");
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthPage) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = withLocale(locale, "/dashboard");
    dashboardUrl.search = "";
    return NextResponse.redirect(dashboardUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|auth|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
