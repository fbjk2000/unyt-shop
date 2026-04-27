import { buildMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { securityNotes, trustPrinciples } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";
import { ClosingCta } from "@/components/marketing/closing-cta";
import { Reveal } from "@/components/motion/reveal";
import { Card, SubtleCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export const metadata = buildMetadata({
  title: "Security | UNYT.shop",
  description:
    "Review security principles, support guidance, and availability disclosures for the supporter-ready UNYT wallet experience.",
  path: "/security",
});

export default async function SecurityPage() {
  const t = await getTranslations("pages.securityPage");

  return (
    <>
      <section className="shell relative overflow-hidden pb-8 pt-10 sm:pb-12 sm:pt-14">
        <SectionAccent variant="security" />
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

      <Section
        eyebrow={t("principles.eyebrow")}
        title={t("principles.title")}
        body={t("principles.body")}
      >
        <div className="grid gap-4 md:grid-cols-3">
          {trustPrinciples.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <Card className="h-full p-6">
                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow={t("walletSafety.eyebrow")}
        title={t("walletSafety.title")}
        body={t("walletSafety.body")}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {securityNotes.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <SubtleCard className="h-full p-5">
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
              </SubtleCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow={t("supportDisclosure.eyebrow")}
        title={t("supportDisclosure.title")}
        body={t("supportDisclosure.body")}
      >
        <Card className="grid gap-4 p-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="text-xl font-semibold text-white">{t("supportDisclosure.riskTitle")}</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              {t("supportDisclosure.riskBody")}
            </p>
          </div>
          <SubtleCard className="p-4">
            <p className="text-sm text-white">{t("supportDisclosure.recoveryTitle")}</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {t("supportDisclosure.recoveryBody")}
            </p>
          </SubtleCard>
        </Card>
      </Section>

      <ClosingCta />
    </>
  );
}
