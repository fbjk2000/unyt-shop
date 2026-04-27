import { getTranslations } from "next-intl/server";
import { navigationItems } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { Button } from "@/components/ui/button";

export async function MarketingHeader() {
  const t = await getTranslations();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b1020]/94 backdrop-blur-md">
      <div className="shell relative flex min-h-16 items-center justify-between gap-5">
        <Link href="/" className="flex items-center gap-3">
          <BrandLogo variant="lockupGradient" className="h-6 w-auto sm:h-7" alt="UNYTs" priority />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-5 md:flex">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[13px] font-medium text-white/58 hover:text-white"
            >
              {t(`navigation.${item.labelKey}`)}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher />
          <Link href="/app/wallet" className="whitespace-nowrap text-[13px] font-medium text-white/58 hover:text-white">
            {t("marketingHeader.signIn")}
          </Link>
          <Button href="/app/wallet" variant="secondary" className="min-h-10 whitespace-nowrap rounded-lg px-4 py-2 shadow-none">
            {t("marketingHeader.getUnyts")}
          </Button>
        </div>
        <div className="flex min-w-0 items-center gap-2 md:hidden">
          <LocaleSwitcher />
          <Link href="/ecosystem" className="hidden whitespace-nowrap text-[13px] text-white/58 hover:text-white sm:inline">
            {t("navigation.ecosystem")}
          </Link>
          <Button href="/app/wallet" variant="secondary" className="hidden min-h-10 whitespace-nowrap rounded-lg px-4 py-2 sm:inline-flex">
            {t("marketingHeader.openApp")}
          </Button>
        </div>
      </div>
    </header>
  );
}
