"use client";

import { useTranslations } from "next-intl";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";

export function MobileBottomActionBar() {
  const t = useTranslations();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 overflow-hidden border-t border-white/10 bg-[#08101d]/92 px-4 py-3 backdrop-blur-xl md:hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,215,255,0.7)] to-transparent" />
      <div className="mx-auto grid max-w-[560px] grid-cols-3 gap-2">
        <Button href="/app/wallet#top-up" className="gap-2 px-3 text-xs" variant="secondary">
          <BrandLogo variant="mark" className="h-3.5 w-3.5 opacity-80" alt="" />
          {t("mobileBottomBar.topUp")}
        </Button>
        <Button href="/app/wallet#redeem" className="gap-2 px-3 text-xs" variant="secondary">
          <BrandLogo variant="mark" className="h-3.5 w-3.5 opacity-80" alt="" />
          {t("mobileBottomBar.redeem")}
        </Button>
        <Button href="/app/activity" className="gap-2 px-3 text-xs" variant="secondary">
          <BrandLogo variant="mark" className="h-3.5 w-3.5 opacity-80" alt="" />
          {t("mobileBottomBar.activity")}
        </Button>
      </div>
    </div>
  );
}
