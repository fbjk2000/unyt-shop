import { ecosystemItems } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Section } from "@/components/ui/section";
import { SubtleCard } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export function LogoStrip() {
  return (
    <Section
      eyebrow="ALREADY BUILT FOR REAL PRODUCTS"
      title="Already built for real products."
      body="From commerce and services to community and communication, UNYTs are designed to work where people actually transact."
      className="pt-4"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {ecosystemItems.map((item, index) => (
          <Reveal key={item.name} delay={index * 0.04}>
            <SubtleCard className="flex min-h-28 flex-col justify-between p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {item.category}
                </p>
                <BrandLogo variant="mark" className="h-5 w-5 opacity-80" alt="" />
              </div>
              <div>
                <p className="text-base font-semibold text-white">{item.name}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{item.highlight}</p>
              </div>
            </SubtleCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
