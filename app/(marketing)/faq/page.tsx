import { buildMetadata } from "@/lib/metadata";
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
    "Find concise answers to the main questions about UNYTs, supported products, wallet availability, mobile payments, swaps, and support.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <section className="shell relative overflow-hidden pb-8 pt-10 sm:pb-12 sm:pt-14">
        <SectionAccent variant="section" />
        <Reveal className="relative max-w-4xl space-y-5">
          <BrandLogo variant="mark" className="h-8 w-8 opacity-90" alt="" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            FAQ
          </p>
          <h1 className="text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
            Straight answers for the questions users ask first.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            The product should answer the main practical questions before users need to contact support.
          </p>
        </Reveal>
      </section>

      <Section className="pt-2">
        <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr]">
          <Reveal>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
                Premium product language means fewer surprises.
              </h2>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
                Keep explanations concise, direct, and globally credible. This is a utility and payments experience, not a speculative story.
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
