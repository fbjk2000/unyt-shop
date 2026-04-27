import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Section } from "@/components/ui/section";
import { SubtleCard } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export async function TrustBand() {
  const t = await getTranslations("trustBand");
  const principles = [0, 1, 2] as const;

  return (
    <Section
      eyebrow={t("eyebrow")}
      title={t("title")}
      body={t("body")}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {principles.map((index) => (
          <Reveal key={`trust-${index}`} delay={index * 0.06}>
            <SubtleCard className="h-full p-5">
              <BrandLogo variant="mark" className="h-5 w-5 opacity-80" alt="" />
              <p className="text-lg font-semibold text-white">{t(`items.${index}.title`)}</p>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{t(`items.${index}.body`)}</p>
            </SubtleCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
