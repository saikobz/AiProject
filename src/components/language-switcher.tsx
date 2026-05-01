"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { switchLocalePath, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils/cn";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <div className="inline-flex rounded-full border border-border bg-panel-strong p-1 text-xs font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
      {(["th", "en"] as const).map((item) => (
        <Link
          key={item}
          href={switchLocalePath(pathname, item)}
          className={cn(
            "rounded-full px-3 py-1.5 transition hover:bg-accent-soft hover:text-foreground",
            locale === item ? "bg-accent text-background hover:bg-accent" : "text-muted",
          )}
        >
          {item === "th" ? "ไทย" : "EN"}
        </Link>
      ))}
    </div>
  );
}
