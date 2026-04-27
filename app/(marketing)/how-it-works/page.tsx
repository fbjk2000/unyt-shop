import { buildMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { ecosystemItems } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";
import { ClosingCta } from "@/components/marketing/closing-cta";
import { HowItWorksGrid } from "@/components/marketing/how-it-works-grid";
import { Reveal } from "@/components/motion/reveal";
import { Card, SubtleCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export const metadata = buildMetadata({
  title: "How It Works | UNYT.shop",
  description:
    "Understand the supporter-ready v1 path: buy prepaid credits, track balance activity, and redeem supported usage rights.",
  path: "/how-it-works",
});

export default async function HowItWorksPage() {
  const t = await getTranslations("pages.howItWorks");

  return (
    <>
      <section className="shell relative overflow-hidden pb-8 pt-10 sm:pb-12 sm:pt-14">
        <SectionAccent variant="hero" />
        <Reveal className="relative max-w-4xl space-y-5">
          <BrandLogo variant="mark" className="h-8 w-8 opacity-90" alt="" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            {t("hero.eyebrow")}
          </p>
          <h1 className="text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            {t("hero.body")}
          </p>
        </Reveal>
      </section>

      <HowItWorksGrid />

      <Section
        eyebrow={t("relationship.eyebrow")}
        title={t("relationship.title")}
        body={t("relationship.body")}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((stepIndex, index) => (
            <Reveal key={stepIndex} delay={index * 0.06}>
              <Card className="h-full p-6">
                <p className="text-sm text-[var(--muted)]">{t("relationship.stepLabel", { step: `0${index + 1}` })}</p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                  {t(`relationship.steps.${stepIndex}.title`)}
                </h2>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{t(`relationship.steps.${stepIndex}.body`)}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow={t("network.eyebrow")}
        title={t("network.title")}
        body={t("network.body")}
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ecosystemItems.map((item, index) => (
            <Reveal key={item.name} delay={index * 0.04}>
              <SubtleCard className="p-4">
                <p className="text-sm font-semibold text-white">{item.name}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.useCase}</p>
              </SubtleCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
