import { buildMetadata } from "@/lib/metadata";
import { homepageFeatures } from "@/lib/content";
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
  title: "UNYT.shop | One balance across every product",
  description:
    "Use UNYTs across Fintery, Alakai, TechSelec, Unyted.world, Unyted.Chat, Earnrm.com, and future services. Pay by card, spend across the ecosystem, and access wallet utility where available.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <section className="shell relative overflow-hidden pb-12 pt-10 sm:pb-14 sm:pt-14 lg:pb-18 lg:pt-18">
        <HeroBackdrop />
        <div className="relative grid items-center gap-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-10">
          <Reveal className="space-y-6">
            <BrandLogo variant="mark" className="h-8 w-8 opacity-90" alt="" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              ONE BALANCE. MANY PRODUCTS.
            </p>
            <h1 className="max-w-3xl text-5xl font-medium tracking-[-0.07em] text-white sm:text-6xl lg:text-7xl">
              Spend UNYTs across the entire ecosystem.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              UNYTs are the utility balance behind unyt.shop — designed for payments across Fintery, Alakai, TechSelec, Unyted.world, Unyted.Chat, Earnrm.com, and future services. Add them in seconds, use them across the network, and access wallet utility where available.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/app/wallet">Get UNYTs</Button>
              <Button href="/ecosystem" variant="secondary">
                Explore the ecosystem
              </Button>
            </div>
            <p className="text-sm leading-6 text-[var(--muted)]">
              Pay by card or supported crypto methods. Availability may depend on region and account requirements.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <HeroMockup />
          </Reveal>
        </div>
      </section>

      <LogoStrip />
      <HowItWorksGrid />

      {homepageFeatures.map((feature, index) => (
        <FeatureSplit
          key={feature.title}
          eyebrow={feature.eyebrow}
          title={feature.title}
          body={feature.body}
          bullets={feature.bullets}
          ctaLabel={feature.ctaLabel}
          href={feature.href}
          mockTitle={index === 0 ? "Unified balance" : index === 1 ? "Checkout quality" : "Quote clarity"}
          mockValue={index === 0 ? "6 active products" : index === 1 ? "3.2s average top-up flow" : "2,487.10 USDC"}
          mockItems={
            index === 0
              ? ["Fintery payments", "TechSelec renewals", "Unyted.Chat upgrades", "Community access"]
              : index === 1
                ? ["Card top-up", "Confirmation screen", "Mobile wallet flow", "Support visibility"]
                : ["Visible fees", "Popular pairs", "Availability checks", "Status updates"]
          }
          reverse={index % 2 === 1}
        />
      ))}

      <TrustBand />

      <Section
        eyebrow="COMMON QUESTIONS"
        title="Answers before users need support."
        body="Keep the main questions close to the conversion path with straightforward answers and no technical theatre."
      >
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <Reveal className="space-y-4">
            <div className="rounded-[32px] border border-white/10 bg-white/4 p-6">
              <p className="text-sm text-[var(--muted)]">Support promise</p>
              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                Clear answers, visible status, and support paths that feel real.
              </p>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                UNYT.shop should explain the product before users need to ask for help, then make the support route obvious when they do.
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
