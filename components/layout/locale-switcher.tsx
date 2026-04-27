"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const labels: Record<AppLocale, string> = {
  en: "EN",
  de: "DE",
};

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("localeSwitcher");
  const locale = useLocale() as AppLocale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: AppLocale) {
    if (nextLocale === locale) {
      return;
    }

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1 rounded-full border border-white/12 bg-white/5 p-1", className)}
      role="group"
      aria-label={t("label")}
    >
      {routing.locales.map((value) => {
        const isActive = value === locale;

        return (
          <button
            key={value}
            type="button"
            onClick={() => switchLocale(value)}
            disabled={isPending}
            className={cn(
              "min-w-9 rounded-full px-2.5 py-1 text-xs font-semibold tracking-[0.08em] transition-colors",
              isActive
                ? "bg-[#4a9eff] text-[#071022]"
                : "text-[var(--muted)] hover:bg-white/8 hover:text-white",
            )}
            aria-pressed={isActive}
            aria-label={t("switchTo", { locale: t(`languages.${value}`) })}
            title={t("switchTo", { locale: t(`languages.${value}`) })}
          >
            {labels[value]}
          </button>
        );
      })}
    </div>
  );
}
