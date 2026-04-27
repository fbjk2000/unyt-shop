import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export async function ClosingCta() {
  const t = await getTranslations("closingCta");

  return (
    <section className="shell py-12 sm:py-16 lg:py-20">
      <Reveal>
        <Card className="overflow-hidden p-8 sm:p-10 lg:p-12">
          <SectionAccent variant="footer" />
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-5">
              <BrandLogo variant="mark" className="h-8 w-8 opacity-90" alt="" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
                {t("eyebrow")}
              </p>
              <h2 className="max-w-2xl text-3xl font-medium tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
                {t("title")}
              </h2>
              <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
                {t("body")}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Button href="/app/wallet">{t("walletCta")}</Button>
              <Button href="/ecosystem" variant="secondary">
                {t("ecosystemCta")}
              </Button>
            </div>
          </div>
        </Card>
      </Reveal>
    </section>
  );
}
