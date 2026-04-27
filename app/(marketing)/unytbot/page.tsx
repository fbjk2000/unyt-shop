import { buildMetadata } from "@/lib/metadata";
import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";
import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Card, SubtleCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { InterestForm } from "@/components/marketing/interest-form";

export const metadata = buildMetadata({
  title: "UNYTBOT | UNYT Family",
  description:
    "UNYTBOT is a pre-launch trading intelligence and automation direction in the UNYT ecosystem, with first working prototypes targeted for July 2026 and an initial staged go-live target in September 2026.",
  path: "/unytbot",
});

export default async function UnytbotHoldingPage() {
  const t = await getTranslations("pages.unytbotHolding");
  const capabilityItems = [
    t("what.capabilities.0"),
    t("what.capabilities.1"),
    t("what.capabilities.2"),
    t("what.capabilities.3"),
  ];
  const audienceItems = [t("what.audience.0"), t("what.audience.1"), t("what.audience.2")];
  const whyItems = [
    t("why.bullets.0"),
    t("why.bullets.1"),
    t("why.bullets.2"),
    t("why.bullets.3"),
  ];
  const roadmapPhases = [
    {
      name: t("roadmap.phases.0.name"),
      window: t("roadmap.phases.0.window"),
      bullets: [
        t("roadmap.phases.0.bullets.0"),
        t("roadmap.phases.0.bullets.1"),
        t("roadmap.phases.0.bullets.2"),
        t("roadmap.phases.0.bullets.3"),
        t("roadmap.phases.0.bullets.4"),
      ],
    },
    {
      name: t("roadmap.phases.1.name"),
      window: t("roadmap.phases.1.window"),
      bullets: [
        t("roadmap.phases.1.bullets.0"),
        t("roadmap.phases.1.bullets.1"),
        t("roadmap.phases.1.bullets.2"),
        t("roadmap.phases.1.bullets.3"),
      ],
    },
    {
      name: t("roadmap.phases.2.name"),
      window: t("roadmap.phases.2.window"),
      bullets: [
        t("roadmap.phases.2.bullets.0"),
        t("roadmap.phases.2.bullets.1"),
        t("roadmap.phases.2.bullets.2"),
        t("roadmap.phases.2.bullets.3"),
      ],
    },
    {
      name: t("roadmap.phases.3.name"),
      window: t("roadmap.phases.3.window"),
      bullets: [
        t("roadmap.phases.3.bullets.0"),
        t("roadmap.phases.3.bullets.1"),
        t("roadmap.phases.3.bullets.2"),
      ],
    },
  ];

  return (
    <>
      <section className="shell relative overflow-hidden pb-10 pt-10 sm:pb-12 sm:pt-14 lg:pb-16">
        <SectionAccent variant="hero" />
        <div className="relative grid gap-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-start">
          <Reveal className="space-y-5">
            <BrandLogo variant="mark" className="h-8 w-8 opacity-90" alt="" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              {t("hero.eyebrow")}
            </p>
            <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="max-w-3xl text-xl font-medium text-[rgba(255,255,255,0.86)]">
              {t("hero.subtitle")}
            </p>
            <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              {t("hero.body")}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button href="/unytbot#interest-form" variant="brand">
                {t("hero.primaryCta")}
              </Button>
              <Button href="/unytbot#interest-form" variant="secondary">
                {t("hero.secondaryCta")}
              </Button>
              <Button href="/unytbot#roadmap" variant="ghost">
                {t("hero.roadmapCta")}
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <Card className="p-6 sm:p-7">
              <span className="status-pill-preview">{t("status.badge")}</span>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                {t("status.title")}
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                {t("status.body")}
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <SubtleCard className="p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    {t("status.milestones.prototypeLabel")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {t("status.milestones.prototypeValue")}
                  </p>
                </SubtleCard>
                <SubtleCard className="p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    {t("status.milestones.goLiveLabel")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white">
                    {t("status.milestones.goLiveValue")}
                  </p>
                </SubtleCard>
              </div>
              <SubtleCard className="mt-3 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                  {t("status.flowLabel")}
                </p>
                <p className="mt-2 text-sm leading-6 text-white">
                  {t("status.flowBody")}
                </p>
              </SubtleCard>
            </Card>
          </Reveal>
        </div>
      </section>

      <Section eyebrow={t("what.eyebrow")} title={t("what.title")} body={t("what.body")}>
        <Card className="p-6 sm:p-7">
          <p className="text-base leading-7 text-[var(--muted)]">{t("what.detail")}</p>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {capabilityItems.map((item, index) => (
              <Reveal key={item} delay={index * 0.04}>
                <SubtleCard className="h-full p-4">
                  <p className="text-sm leading-6 text-white">{item}</p>
                </SubtleCard>
              </Reveal>
            ))}
          </div>
          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">{t("what.audienceTitle")}</p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {audienceItems.map((item, index) => (
                <Reveal key={item} delay={index * 0.04}>
                  <SubtleCard className="h-full p-4">
                    <p className="text-sm leading-6 text-white">{item}</p>
                  </SubtleCard>
                </Reveal>
              ))}
            </div>
          </div>
        </Card>
      </Section>

      <Section eyebrow={t("why.eyebrow")} title={t("why.title")} body={t("why.body")}>
        <div className="grid gap-4 md:grid-cols-2">
          {whyItems.map((item, index) => (
            <Reveal key={item} delay={index * 0.05}>
              <SubtleCard className="h-full p-5">
                <p className="text-sm leading-6 text-white">{item}</p>
              </SubtleCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="roadmap" eyebrow={t("roadmap.eyebrow")} title={t("roadmap.title")} body={t("roadmap.body")}>
        <Card className="p-6 sm:p-7">
          <div className="grid gap-3 md:grid-cols-2">
            <SubtleCard className="p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                {t("roadmap.prototypeLabel")}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{t("roadmap.prototypeValue")}</p>
            </SubtleCard>
            <SubtleCard className="p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                {t("roadmap.goLiveLabel")}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">{t("roadmap.goLiveValue")}</p>
            </SubtleCard>
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{t("roadmap.caveat")}</p>
        </Card>

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {roadmapPhases.map((phase, index) => (
            <Reveal key={phase.name} delay={index * 0.05}>
              <Card className="h-full p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {t("roadmap.phaseLabel", { phase: index + 1 })}
                </p>
                <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">{phase.name}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{phase.window}</p>
                <div className="mt-4 space-y-2">
                  {phase.bullets.map((bullet) => (
                    <p key={bullet} className="text-sm leading-6 text-white/90">
                      • {bullet}
                    </p>
                  ))}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section id="interest-form" eyebrow={t("lead.eyebrow")} title={t("lead.title")} body={t("lead.body")}>
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <InterestForm
            sourcePage="unytbot.com"
            defaultInterestIn="unytbot"
            formTitle={t("lead.formTitle")}
            formBody={t("lead.formBody")}
            labels={{
              sharedHeadline: t("lead.form.sharedHeadline"),
              sharedBody: t("lead.form.sharedBody"),
              firstName: t("lead.form.fields.firstName"),
              lastName: t("lead.form.fields.lastName"),
              email: t("lead.form.fields.email"),
              companyOptional: t("lead.form.fields.companyOptional"),
              countryRegion: t("lead.form.fields.countryRegion"),
              interestIn: t("lead.form.fields.interestIn"),
              interestInOptions: {
                unytbot: t("lead.form.fields.interestInOptions.unytbot"),
                unytExchange: t("lead.form.fields.interestInOptions.unytExchange"),
                both: t("lead.form.fields.interestInOptions.both"),
              },
              interests: t("lead.form.fields.interests"),
              interestOptions: {
                earlyAccess: t("lead.form.fields.interestOptions.earlyAccess"),
                productUpdates: t("lead.form.fields.interestOptions.productUpdates"),
                commercialUse: t("lead.form.fields.interestOptions.commercialUse"),
                partnership: t("lead.form.fields.interestOptions.partnership"),
                backerEcosystem: t("lead.form.fields.interestOptions.backerEcosystem"),
              },
              messageOptional: t("lead.form.fields.messageOptional"),
              submit: t("lead.form.submit"),
              submitting: t("lead.form.submitting"),
              success: t("lead.form.success"),
              error: t("lead.form.error"),
              followUpNote: t("lead.form.followUpNote"),
            }}
          />

          <Card className="h-full p-6 sm:p-7">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-white">
              {t("lead.sideTitle")}
            </h3>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{t("lead.detail")}</p>
            <SubtleCard className="mt-5 p-4">
              <p className="text-sm text-white">{t("lead.footerNote")}</p>
            </SubtleCard>
            <div className="mt-5 flex flex-col gap-3">
              <Button href="/unytbot#roadmap" variant="ghost">
                {t("lead.roadmapCta")}
              </Button>
              <Button href="/ecosystem" variant="secondary">
                {t("lead.ecosystemCta")}
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
