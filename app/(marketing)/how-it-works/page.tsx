import { buildMetadata } from "@/lib/metadata";
import { ecosystemItems, howItWorksSteps } from "@/lib/content";
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
    "Understand how to add UNYTs, spend them across supported products, and access wallet utility where available.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <section className="shell relative overflow-hidden pb-8 pt-10 sm:pb-12 sm:pt-14">
        <SectionAccent variant="hero" />
        <Reveal className="relative max-w-4xl space-y-5">
          <BrandLogo variant="mark" className="h-8 w-8 opacity-90" alt="" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            HOW IT WORKS
          </p>
          <h1 className="text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
            A clearer utility model from funding to spend.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            The model is simple by design: users add UNYTs once, use the same balance across supported products, and access wallet-level utility only where it adds value.
          </p>
        </Reveal>
      </section>

      <HowItWorksGrid />

      <Section
        eyebrow="THE RELATIONSHIP"
        title="Why the three steps belong together."
        body="Each stage reduces friction instead of adding it. Funding creates a clear balance, spending reuses that balance across brands, and wallet features stay optional until they are actually useful."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {howItWorksSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.06}>
              <Card className="h-full p-6">
                <p className="text-sm text-[var(--muted)]">Step 0{index + 1}</p>
                <h2 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                  {step.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{step.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="SUPPORTED ACROSS THE NETWORK"
        title="One model, applied across participating products."
        body="The point is not complexity. The point is that users can carry one understood balance into the products they already use."
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
