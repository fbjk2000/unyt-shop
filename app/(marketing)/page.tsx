import { buildMetadata } from "@/lib/metadata";
import { getLocale, getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { HeroBackdrop } from "@/components/brand/HeroBackdrop";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { HeroMockup } from "@/components/marketing/hero-mockup";
import { LogoStrip } from "@/components/marketing/logo-strip";
import { HowItWorksGrid } from "@/components/marketing/how-it-works-grid";
import { FeatureSplit } from "@/components/marketing/feature-split";
import { TrustBand } from "@/components/marketing/trust-band";
import { FaqAccordion } from "@/components/marketing/faq-accordion";
import { ClosingCta } from "@/components/marketing/closing-cta";
import { Reveal } from "@/components/motion/reveal";
import { Section } from "@/components/ui/section";

export const metadata = buildMetadata({
  title: "UNYT.shop | Supporter-ready credits and redemption",
  description:
    "Supporter v1 is live for prepaid credits, visible balance, activity history, and EarnRM redemption into usage rights. Swap remains preview-only.",
  path: "/",
});

export default async function HomePage() {
  const locale = await getLocale();
  const holdingSite = process.env.UNYT_HOLDING_SITE;
  if (holdingSite === "unytbot" || holdingSite === "unyt-exchange") {
    const prefix = locale === "en" ? "" : `/${locale}`;
    redirect(`${prefix}/${holdingSite}`);
  }

  const t = await getTranslations("pages.home");
  const isGerman = locale === "de";
  const heroTitleClass = isGerman
    ? "max-w-[12.8ch] text-[clamp(2.85rem,6.5vw,4.55rem)] leading-[1.02] tracking-[-0.02em]"
    : "max-w-[11.6ch] text-[clamp(3.8rem,8.7vw,5.75rem)] leading-[0.98] tracking-[-0.03em]";
  const heroCopyWidthClass = isGerman ? "max-w-[600px]" : "max-w-[520px]";
  const heroGridClass = isGerman
    ? "relative grid items-start gap-9 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 xl:gap-10"
    : "relative grid items-start gap-9 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12";
  const mockupContainerClass = isGerman
    ? "mockup-wrapper mx-auto w-full max-w-[500px] lg:ml-auto lg:mr-8 xl:mr-10"
    : "mockup-wrapper mx-auto w-full max-w-[560px] lg:ml-auto";
  const features = [
    {
      eyebrow: t("features.0.eyebrow"),
      title: t("features.0.title"),
      body: t("features.0.body"),
      ctaLabel: t("features.0.ctaLabel"),
      href: "/ecosystem",
      bullets: [t("features.0.bullets.0"), t("features.0.bullets.1"), t("features.0.bullets.2")],
      mockTitle: t("featureMocks.0.title"),
      mockValue: t("featureMocks.0.value"),
      mockItems: [
        t("featureMocks.0.items.0"),
        t("featureMocks.0.items.1"),
        t("featureMocks.0.items.2"),
        t("featureMocks.0.items.3"),
      ],
    },
    {
      eyebrow: t("features.1.eyebrow"),
      title: t("features.1.title"),
      body: t("features.1.body"),
      ctaLabel: t("features.1.ctaLabel"),
      href: "/how-it-works",
      bullets: [t("features.1.bullets.0"), t("features.1.bullets.1"), t("features.1.bullets.2")],
      mockTitle: t("featureMocks.1.title"),
      mockValue: t("featureMocks.1.value"),
      mockItems: [
        t("featureMocks.1.items.0"),
        t("featureMocks.1.items.1"),
        t("featureMocks.1.items.2"),
        t("featureMocks.1.items.3"),
      ],
    },
    {
      eyebrow: t("redemptionFeature.eyebrow"),
      title: t("redemptionFeature.title"),
      body: t("redemptionFeature.body"),
      ctaLabel: t("redemptionFeature.ctaLabel"),
      href: "/app/wallet#redeem",
      bullets: [
        t("redemptionFeature.bullets.0"),
        t("redemptionFeature.bullets.1"),
        t("redemptionFeature.bullets.2"),
      ],
      mockTitle: t("featureMocks.2.title"),
      mockValue: t("featureMocks.2.value"),
      mockItems: [
        t("featureMocks.2.items.0"),
        t("featureMocks.2.items.1"),
        t("featureMocks.2.items.2"),
        t("featureMocks.2.items.3"),
      ],
    },
  ] as const;

  return (
    <>
      <section className="shell relative overflow-hidden pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-22">
        <HeroBackdrop />
        <div className={heroGridClass}>
          <Reveal className="space-y-7">
            <BrandLogo variant="mark" className="h-8 w-8 opacity-90" alt="" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              {t("hero.eyebrow")}
            </p>
            <h1 className={`${heroTitleClass} font-medium text-white`}>
              <span className="block">{t("hero.line1")}</span>
              <span className="mt-1 block">{t("hero.line2")}</span>
            </h1>
            <p className={`${heroCopyWidthClass} text-[21px] leading-[1.45] font-medium text-[rgba(255,255,255,0.86)]`}>
              {t("hero.subheadline")}
            </p>
            <p className={`${heroCopyWidthClass} text-[18px] leading-[1.7] text-[rgba(255,255,255,0.72)]`}>
              {t("hero.body")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/app/wallet">{t("hero.walletCta")}</Button>
              <Button href="/ecosystem" variant="secondary">
                {t("hero.ecosystemCta")}
              </Button>
            </div>
            <p className="text-sm leading-6 text-[var(--muted)]">
              {t("hero.note")}
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className={mockupContainerClass}>
              <HeroMockup />
            </div>
          </Reveal>
        </div>
      </section>

      <LogoStrip />
      <HowItWorksGrid />

      {features.map((feature, index) => {
        return (
          <FeatureSplit
            key={feature.title}
            eyebrow={feature.eyebrow}
            title={feature.title}
            body={feature.body}
            bullets={feature.bullets}
            ctaLabel={feature.ctaLabel}
            href={feature.href}
            mockTitle={feature.mockTitle}
            mockValue={feature.mockValue}
            mockItems={feature.mockItems}
            reverse={index % 2 === 1}
          />
        );
      })}

      <TrustBand />

      <Section
        eyebrow={t("faqSection.eyebrow")}
        title={t("faqSection.title")}
        body={t("faqSection.body")}
      >
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal className="space-y-4">
            <div className="rounded-[32px] border border-white/10 bg-white/4 p-6">
              <p className="text-sm text-[var(--muted)]">{t("faqSection.promiseLabel")}</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                {t("faqSection.promiseTitle")}
              </p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                {t("faqSection.promiseBody")}
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <FaqAccordion compact items={undefined} />
          </Reveal>
        </div>
      </Section>

      <ClosingCta />
    </>
  );
}
