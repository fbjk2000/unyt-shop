import { getTranslations } from "next-intl/server";
import { navigationItems } from "@/lib/site";
import { Link } from "@/i18n/navigation";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";

export async function Footer() {
  const t = await getTranslations();

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-white/8 pb-28 pt-12 md:pb-16">
      <SectionAccent variant="footer" />
      <div className="shell relative flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <div className="max-w-md space-y-4">
          <BrandLogo variant="lockupGradient" className="h-8 w-auto" alt="UNYTs" />
          <p className="text-sm leading-6 text-[var(--muted)]">
            {t("footer.description")}
          </p>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              {t("footer.relationshipLabel")}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <a href="https://fintery.com" target="_blank" rel="noreferrer" className="hover:text-white">
                {t("footer.startWithFintery")}
              </a>
              <a href="https://aios.institute" target="_blank" rel="noreferrer" className="hover:text-white">
                {t("footer.aiosAuthority")}
              </a>
              <a href="https://earnrm.com" target="_blank" rel="noreferrer" className="hover:text-white">
                {t("footer.earnrmTool")}
              </a>
            </div>
          </div>
          <div className="brand-outline-divider" />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--muted)]">
          {navigationItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-white">
              {t(`navigation.${item.labelKey}`)}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
