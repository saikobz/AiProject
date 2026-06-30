import { isLocale, withLocale, type Locale } from "@/lib/i18n/config";

export function safeNextPath(next: string, locale: Locale) {
  if (
    !next.startsWith("/") ||
    next.startsWith("//") ||
    next.includes("\\") ||
    next.includes(":")
  ) {
    return withLocale(locale, "/dashboard");
  }

  const segments = next.split("/");

  if (!isLocale(segments[1])) {
    return withLocale(locale, "/dashboard");
  }

  return next;
}
