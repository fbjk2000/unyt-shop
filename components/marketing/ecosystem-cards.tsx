import Link from "next/link";
import { ecosystemItems } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Reveal } from "@/components/motion/reveal";
import { Card, SubtleCard } from "@/components/ui/card";

export function EcosystemCards() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {ecosystemItems.map((item, index) => (
        <Reveal key={item.name} delay={index * 0.05}>
          <Card id={item.href.split("#")[1]} className="h-full p-6 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  {item.category}
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                  {item.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">
                <BrandLogo variant="mark" className="h-4 w-4 opacity-80" alt="" />
                {item.highlight}
              </div>
            </div>
            <p className="mt-5 text-base leading-7 text-[var(--muted)]">{item.description}</p>
            <SubtleCard className="mt-6 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Use UNYTs for</p>
              <p className="mt-2 text-sm leading-6 text-white">{item.useCase}</p>
            </SubtleCard>
            <Link
              href="/app/wallet"
              className="mt-6 inline-flex min-h-11 items-center rounded-full border border-white/10 px-4 text-sm font-semibold text-white hover:bg-white/6"
            >
              {item.ctaLabel}
            </Link>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}
