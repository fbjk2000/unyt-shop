import { buildMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";
import { ClosingCta } from "@/components/marketing/closing-cta";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export const metadata = buildMetadata({
  title: "FAQ | UNYT.shop",
  description:
    "Concise answers about prepaid credits, supporter-ready wallet functionality, redemption availability, and support.",
  path: "/faq",
});

export default async function FaqPage() {
  const t = await getTranslations("pages.faqPage");

  return (
    <>
      <section className="shell relative overflow-hidden pb-8 pt-10 sm:pb-12 sm:pt-14">
        <SectionAccent variant="section" />
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

      <Section className="pt-2">
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <Reveal>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                {t("callout.title")}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                {t("callout.body")}
              </p>
            </Card>
          </Reveal>
          <Reveal delay={0.08}>
            <FaqAccordion />
          </Reveal>
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
