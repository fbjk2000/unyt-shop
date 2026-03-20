import { howItWorksSteps } from "@/lib/content";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export function HowItWorksGrid() {
  return (
    <Section eyebrow="HOW UNYTS WORK" title="How UNYTs work" body="A straightforward path from top-up to spend, designed for real product use.">
      <div className="grid gap-4 lg:grid-cols-3">
        {howItWorksSteps.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.06}>
            <Card className="h-full p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">0{index + 1}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">
                  {step.stat}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-white">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)] sm:text-[15px]">
                {step.body}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

