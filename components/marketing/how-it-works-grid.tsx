import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/motion/reveal";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export async function HowItWorksGrid() {
  const t = await getTranslations("howItWorksGrid");
  const steps = [0, 1, 2] as const;

  return (
    <Section
      eyebrow={t("eyebrow")}
      title={t("title")}
      body={t("body")}
    >
      <div className="grid gap-4 lg:grid-cols-3">
        {steps.map((stepIndex, index) => (
          <Reveal key={stepIndex} delay={index * 0.06}>
            <Card className="h-full p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--muted)]">0{index + 1}</span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">
                  {t(`steps.${stepIndex}.stat`)}
                </span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-white">
                {t(`steps.${stepIndex}.title`)}
              </h3>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)] sm:text-[15px]">
                {t(`steps.${stepIndex}.body`)}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
