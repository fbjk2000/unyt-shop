"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MobileBottomActionBar } from "@/components/marketing/mobile-bottom-action-bar";

const items = [
  { href: "/app/wallet", labelKey: "wallet" },
  { href: "/app/wallet#top-up", labelKey: "topUp" },
  { href: "/app/wallet#redeem", labelKey: "redeem" },
  { href: "/app/activity", labelKey: "activity" },
  { href: "/app/admin", labelKey: "admin" },
  { href: "/app/swap", labelKey: "swapPreview" },
  { href: "/app/settings", labelKey: "settings" },
] as const;

function isItemActive(pathname: string, hash: string, href: (typeof items)[number]["href"]) {
  if (href === "/app/wallet") {
    return pathname === "/app/wallet" && hash !== "#top-up" && hash !== "#redeem";
  }

  if (href === "/app/wallet#top-up" || href === "/app/wallet#redeem") {
    const targetHash = `#${href.split("#")[1]}`;
    return pathname === "/app/wallet" && hash === targetHash;
  }

  return pathname === href;
}

export function AppShell({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  const t = useTranslations("appShell");
  const pathname = usePathname();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const syncHash = () => {
      setHash(window.location.hash || "");
    };

    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  const activeMap = useMemo(
    () => new Map(items.map((item) => [item.href, isItemActive(pathname, hash, item.href)])),
    [hash, pathname],
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(79,124,255,0.16),_transparent_30%),linear-gradient(180deg,_#08101d_0%,_#0b1020_100%)]">
      <a href="#app-main-content" className="skip-link">
        {t("skipToContent")}
      </a>
      <header className="relative overflow-hidden border-b border-white/8 bg-[#08101d]/86 backdrop-blur-xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(140,215,255,0.75)] to-transparent" />
        <div className="shell relative flex min-h-18 items-center justify-between gap-6">
          <Link href="/" aria-label="Go to UNYT.shop home" className="flex items-center gap-3">
            <BrandLogo variant="mark" className="h-10 w-10" alt="UNYTs" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
                {t("appLabel")}
              </p>
              <h1 className="mt-2 text-lg font-semibold text-white">{title}</h1>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <LocaleSwitcher className="hidden sm:inline-flex" />
            <Link href="/" className="text-sm text-[var(--muted)] hover:text-white">
              {t("backToSite")}
            </Link>
          </div>
        </div>
      </header>
      <div className="shell grid gap-6 py-6 lg:grid-cols-[220px_minmax(0,1fr)] lg:py-8">
        <aside className="subtle-card relative hidden overflow-hidden p-3 lg:block">
          <nav aria-label="App">
            <ul className="space-y-1">
              {items.map((item) => {
                const isActive = activeMap.get(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "nav-item flex min-h-11 items-center px-4 text-sm text-[var(--muted)] hover:bg-white/6 hover:text-white",
                        isActive
                          ? "active rounded-r-[8px] border-l-2 border-l-[#4a9eff] bg-[rgba(255,255,255,0.06)] pl-[14px] text-white"
                          : "rounded-2xl border-l-2 border-l-transparent",
                      )}
                    >
                      {t(item.labelKey)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>
        <main id="app-main-content" className="space-y-4 pb-24 md:pb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
            {items.map((item) => {
              const isActive = activeMap.get(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm whitespace-nowrap text-[var(--muted)] hover:text-white",
                    isActive && "border-[#4a9eff]/60 bg-white/8 text-white",
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </div>
          <div className="flex flex-col gap-2 px-1">
            <p className="text-sm text-[var(--muted)]">{description}</p>
          </div>
          {children}
        </main>
      </div>
      <MobileBottomActionBar />
    </div>
  );
}
