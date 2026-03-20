import { trustPrinciples } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Section } from "@/components/ui/section";
import { SubtleCard } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export function TrustBand() {
  return (
    <Section
      eyebrow="BUILT FOR TRUST, NOT HYPE"
      title="Built for trust, not hype."
      body="Every part of unyt.shop should communicate control, transparency, and product maturity — from clear balances and visible activity to security-first wallet actions and straightforward support."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {trustPrinciples.map((item, index) => (
          <Reveal key={item.title} delay={index * 0.06}>
            <SubtleCard className="h-full p-5">
              <BrandLogo variant="mark" className="h-5 w-5 opacity-80" alt="" />
              <p className="text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
            </SubtleCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
