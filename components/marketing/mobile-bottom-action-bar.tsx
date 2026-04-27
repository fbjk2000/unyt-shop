"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function MobileBottomActionBar() {
  const t = useTranslations();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden border-t border-white/10 bg-[#08101d]/92 px-4 py-3 backdrop-blur-xl md:hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,215,255,0.7)] to-transparent" />
      <div className="mx-auto grid max-w-[560px] grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-2">
        <Link
          href="/app/wallet#top-up"
          className="flex min-h-10 min-w-0 items-center justify-center rounded-lg border border-white/12 bg-white/5 px-1 text-center text-[11px] font-semibold text-white"
        >
          {t("mobileBottomBar.topUp")}
        </Link>
        <Link
          href="/app/wallet#redeem"
          className="flex min-h-10 min-w-0 items-center justify-center rounded-lg border border-white/12 bg-white/5 px-1 text-center text-[11px] font-semibold text-white"
        >
          {t("mobileBottomBar.redeem")}
        </Link>
        <Link
          href="/app/activity"
          className="flex min-h-10 min-w-0 items-center justify-center rounded-lg border border-white/12 bg-white/5 px-1 text-center text-[11px] font-semibold text-white"
        >
          {t("mobileBottomBar.activity")}
        </Link>
      </div>
    </div>
  );
}
