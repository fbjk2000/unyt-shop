import { buildMetadata } from "@/lib/metadata";
import { securityNotes, trustPrinciples } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";
import { ClosingCta } from "@/components/marketing/closing-cta";
import { Reveal } from "@/components/motion/reveal";
import { Card, SubtleCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export const metadata = buildMetadata({
  title: "Security | UNYT.shop",
  description:
    "Review the security principles, support guidance, and availability disclosures behind the UNYT wallet experience.",
  path: "/security",
});

export default function SecurityPage() {
  return (
    <>
      <section className="shell relative overflow-hidden pb-8 pt-10 sm:pb-12 sm:pt-14">
        <SectionAccent variant="security" />
        <Reveal className="relative max-w-4xl space-y-5">
          <BrandLogo variant="mark" className="h-8 w-8 opacity-90" alt="" />
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            SECURITY
          </p>
          <h1 className="text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
            Built for control, visibility, and mature support.
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[var(--muted)] sm:text-lg">
            Security language should stay clear and measured. Users need to understand what is protected, what they can review, and where support begins when something needs attention.
          </p>
        </Reveal>
      </section>

      <Section
        eyebrow="PRINCIPLES"
        title="A serious product surface starts with product discipline."
        body="Good security communication avoids exaggeration. It gives users clear expectations, useful controls, and visible status."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {trustPrinciples.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <Card className="h-full p-6">
                <h2 className="text-xl font-semibold text-white">{item.title}</h2>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="WALLET AND TRANSACTION SAFETY"
        title="Clear guidance around account, payments, and recovery."
        body="The interface should help users understand sensitive actions without forcing them to decipher technical detail."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {securityNotes.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <SubtleCard className="h-full p-5">
                <h2 className="text-lg font-semibold text-white">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
              </SubtleCard>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="SUPPORT AND DISCLOSURE"
        title="Availability depends on region, account status, and supported routes."
        body="This v1 intentionally avoids making claims beyond what the product can support. Users should see availability, confirmation states, and support next steps before taking action."
      >
        <Card className="grid gap-4 p-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h2 className="text-xl font-semibold text-white">Risk and availability disclosure</h2>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
              Wallet features, supported payment methods, and swap availability may vary by region, account requirements, and supported infrastructure. The product should say so directly.
            </p>
          </div>
          <SubtleCard className="p-4">
            <p className="text-sm text-white">Recovery and support route</p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Support should verify identity where required, communicate timing clearly, and avoid making guarantees the system cannot keep.
            </p>
          </SubtleCard>
        </Card>
      </Section>

      <ClosingCta />
    </>
  );
}
