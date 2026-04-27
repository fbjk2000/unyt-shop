import { ecosystemItems } from "@/lib/content";
import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Section } from "@/components/ui/section";
import { SubtleCard } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";

export async function LogoStrip() {
  const t = await getTranslations("logoStrip");

  return (
    <Section
      eyebrow={t("eyebrow")}
      title={t("title")}
      body={t("body")}
      className="pt-4"
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        {ecosystemItems.map((item, index) => (
          <Reveal key={item.name} delay={index * 0.04}>
            <SubtleCard className="flex min-h-28 flex-col justify-between overflow-hidden p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 flex-1 truncate text-[11px] uppercase tracking-[0.14em] text-[var(--muted)]">
                  {t(`items.${index}.category`)}
                </p>
                <BrandLogo variant="mark" className="h-5 w-5 shrink-0 opacity-80" alt="" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-white">{item.name}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{t(`items.${index}.highlight`)}</p>
              </div>
            </SubtleCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
