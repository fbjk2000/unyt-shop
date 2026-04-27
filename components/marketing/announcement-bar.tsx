"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function AnnouncementBar() {
  const t = useTranslations();
  const [dismissed, setDismissed] = useState(false);

  return (
    <div
      className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
        dismissed ? "max-h-0 opacity-0" : "max-h-24 opacity-100"
      }`}
    >
      <div className="border-b border-white/8 bg-white/4">
        <div className="shell">
          <div className="relative flex min-h-11 items-center justify-center border-l-[3px] border-l-[#4ade80] pl-4 pr-10 text-center text-sm text-[rgba(255,255,255,0.78)]">
            <span>{t("announcementBar.message")}</span>
            <button
              type="button"
              onClick={() => setDismissed(true)}
              aria-label={t("announcementBar.dismiss")}
              className="absolute right-0 inline-flex h-9 w-9 items-center justify-center rounded-full text-[rgba(255,255,255,0.78)] hover:bg-white/8 hover:text-white"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ×
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
