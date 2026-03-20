import { Button } from "@/components/ui/button";
import { Card, SubtleCard } from "@/components/ui/card";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Reveal } from "@/components/motion/reveal";

type FeatureSplitProps = {
  eyebrow: string;
  title: string;
  body: string;
  bullets: readonly string[];
  ctaLabel: string;
  href: string;
  mockTitle: string;
  mockValue: string;
  mockItems: readonly string[];
  reverse?: boolean;
};

export function FeatureSplit({
  eyebrow,
  title,
  body,
  bullets,
  ctaLabel,
  href,
  mockTitle,
  mockValue,
  mockItems,
  reverse,
}: FeatureSplitProps) {
  return (
    <div className="shell py-8 sm:py-10 lg:py-12">
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-10">
        <Reveal className={reverse ? "lg:order-2" : undefined}>
          <div className="space-y-5">
            <Eyebrow>{eyebrow}</Eyebrow>
            <h2 className="max-w-xl text-3xl font-medium tracking-[-0.05em] text-white sm:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="max-w-xl text-base leading-7 text-[var(--muted)] sm:text-lg">{body}</p>
            <ul className="space-y-3">
              {bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                  <BrandLogo variant="mark" className="mt-0.5 h-4 w-4 shrink-0 opacity-90" alt="" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <Button href={href} variant="secondary">
              {ctaLabel}
            </Button>
          </div>
        </Reveal>
        <Reveal className={reverse ? "lg:order-1" : undefined} delay={0.08}>
          <Card className="overflow-hidden p-5 sm:p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--muted)]">{mockTitle}</p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">
                  Supported
                </span>
              </div>
              <div className="relative overflow-hidden rounded-[24px] border border-white/8 bg-black/16 p-5">
                <div className="brand-pattern-overlay absolute inset-0 opacity-[0.08]" />
                <p className="text-3xl font-semibold text-white">{mockValue}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">One balance across supported products</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {mockItems.map((item) => (
                  <SubtleCard key={item} className="p-4">
                    <p className="text-sm text-white">{item}</p>
                  </SubtleCard>
                ))}
              </div>
            </div>
          </Card>
        </Reveal>
      </div>
    </div>
  );
}
