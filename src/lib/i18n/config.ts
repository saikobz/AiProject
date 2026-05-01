export const locales = ["th", "en"] as const;
export const defaultLocale = "th";

export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale);
}

export function getLocale(value: string | undefined): Locale {
  return isLocale(value) ? value : defaultLocale;
}

export function normalizeLocale(value: FormDataEntryValue | string | null | undefined): Locale {
  return getLocale(typeof value === "string" ? value : undefined);
}

export function localizePath(locale: Locale, path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalizedPath === "/" ? "" : normalizedPath}`;
}

export const withLocale = localizePath;

export function replaceLocale(pathname: string, locale: Locale) {
  const segments = pathname.split("/");

  if (isLocale(segments[1])) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return localizePath(locale, pathname);
}

export const switchLocalePath = replaceLocale;

export function getLocaleFromPath(pathname: string): Locale {
  return getLocale(pathname.split("/")[1]);
}
