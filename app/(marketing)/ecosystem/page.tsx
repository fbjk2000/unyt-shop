import { buildMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { ecosystemItems } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";
import { EcosystemCards } from "@/components/marketing/ecosystem-cards";
import { HowItWorksGrid } from "@/components/marketing/how-it-works-grid";
import { ClosingCta } from "@/components/marketing/closing-cta";
import { Reveal } from "@/components/motion/reveal";
import { Card, SubtleCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export const metadata = buildMetadata({
  title: "Ecosystem | UNYT.shop",
  description:
    "See where prepaid UNYTs are supported today and which ecosystem redemption routes are planned next.",
  path: "/ecosystem",
});

export default async function EcosystemPage() {
  const t = await getTranslations("pages.ecosystem");

  return (
    <>
      <section className="shell relative overflow-hidden pb-10 pt-10 sm:pb-12 sm:pt-14 lg:pb-14">
        <SectionAccent variant="hero" />
        <div className="relative grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <Reveal className="space-y-5">
            <BrandLogo variant="mark" className="h-8 w-8 opacity-90" alt="" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              {t("hero.eyebrow")}
            </p>
            <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              {t("hero.body")}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <label className="rounded-[22px] border border-white/10 bg-white/4 px-4 py-3">
                  <span className="sr-only">{t("filters.searchSrOnly")}</span>
                  <input
                    aria-label={t("filters.searchAria")}
                    value={t("filters.searchValue")}
                    readOnly
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                </label>
                <div className="rounded-[22px] border border-white/10 bg-white/4 px-4 py-3 text-sm text-[var(--muted)]">
                  {t("filters.filterAll")}
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/4 px-4 py-3 text-sm text-[var(--muted)]">
                  {t("filters.availability")}
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[t("filters.tags.0"), t("filters.tags.1"), t("filters.tags.2")].map((item) => (
                  <SubtleCard key={item} className="p-4">
                    <p className="text-sm text-white">{item}</p>
                  </SubtleCard>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <Section
        eyebrow={t("supportedProducts.eyebrow")}
        title={t("supportedProducts.title")}
        body={t("supportedProducts.body")}
        className="pt-2"
      >
        <EcosystemCards />
      </Section>

      <Section
        eyebrow={t("howSpendingWorks.eyebrow")}
        title={t("howSpendingWorks.title")}
        body={t("howSpendingWorks.body")}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: t("howSpendingWorks.cards.0.title"),
              body: t("howSpendingWorks.cards.0.body"),
            },
            {
              title: t("howSpendingWorks.cards.1.title"),
              body: t("howSpendingWorks.cards.1.body"),
            },
            {
              title: t("howSpendingWorks.cards.2.title"),
              body: t("howSpendingWorks.cards.2.body"),
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <Card className="h-full p-6">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <HowItWorksGrid />

      <Section
        eyebrow={t("partner.eyebrow")}
        title={t("partner.title")}
        body={t("partner.body")}
      >
        <Card className="grid gap-6 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-base text-white">
              {t("partner.countBody", { count: ecosystemItems.length })}
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {t("partner.note")}
            </p>
          </div>
          <a
            href="mailto:partners@unyt.shop"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white hover:bg-white/6"
          >
            {t("partner.cta")}
          </a>
        </Card>
      </Section>

      <ClosingCta />
    </>
  );
}
