import { buildMetadata } from "@/lib/metadata";
import { ecosystemItems } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";
import { EcosystemCards } from "@/components/marketing/ecosystem-cards";
import { HowItWorksGrid } from "@/components/marketing/how-it-works-grid";
import { ClosingCta } from "@/components/marketing/closing-cta";
import { Reveal } from "@/components/motion/reveal";
import { Card, SubtleCard } from "@/components/ui/card";
import { Section } from "@/components/ui/section";

export const metadata = buildMetadata({
  title: "Ecosystem | UNYT.shop",
  description: "See where UNYTs can be spent across commerce, services, communication, community, and future ecosystem utilities.",
  path: "/ecosystem",
});

export default function EcosystemPage() {
  return (
    <>
      <section className="shell relative overflow-hidden pb-10 pt-10 sm:pb-12 sm:pt-14 lg:pb-14">
        <SectionAccent variant="hero" />
        <div className="relative grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <Reveal className="space-y-5">
            <BrandLogo variant="mark" className="h-8 w-8 opacity-90" alt="" />
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
              ECOSYSTEM
            </p>
            <h1 className="max-w-3xl text-4xl font-medium tracking-[-0.06em] text-white sm:text-5xl lg:text-6xl">
              One balance, already useful across a real product network.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[var(--muted)] sm:text-lg">
              Explore where UNYTs can be used today across commerce, services, communication, community access, and future utility endpoints.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Card className="p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
                <label className="rounded-[22px] border border-white/10 bg-white/4 px-4 py-3">
                  <span className="sr-only">Search supported products</span>
                  <input
                    aria-label="Search supported products"
                    value="All supported products"
                    readOnly
                    className="w-full bg-transparent text-sm text-white outline-none"
                  />
                </label>
                <div className="rounded-[22px] border border-white/10 bg-white/4 px-4 py-3 text-sm text-[var(--muted)]">
                  Filter: All
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/4 px-4 py-3 text-sm text-[var(--muted)]">
                  Availability
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["Commerce", "Services", "Wallet utility"].map((item) => (
                  <SubtleCard key={item} className="p-4">
                    <p className="text-sm text-white">{item}</p>
                  </SubtleCard>
                ))}
              </div>
            </Card>
          </Reveal>
        </div>
      </section>

      <Section
        eyebrow="SUPPORTED PRODUCTS"
        title="A substantial ecosystem, not a placeholder list."
        body="Each product has a clear role, a practical use case, and a shared utility balance designed to feel familiar on every screen."
        className="pt-2"
      >
        <EcosystemCards />
      </Section>

      <Section
        eyebrow="HOW SPENDING WORKS"
        title="Simple enough for users, structured enough for partners."
        body="The same balance model can support premium checkout, service access, account upgrades, and future wallet utility without forcing separate payment logic for every product."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Top up once",
              body: "Users add UNYTs through a premium, guided funding flow using supported payment methods.",
            },
            {
              title: "Spend where supported",
              body: "The same balance can then be recognized across participating brands and services.",
            },
            {
              title: "Keep control visible",
              body: "Availability, support, and optional wallet features stay explicit instead of hidden in jargon.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <Card className="h-full p-6">
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{item.body}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <HowItWorksGrid />

      <Section
        eyebrow="PARTNER WITH THE NETWORK"
        title="Bring your product into the ecosystem."
        body="For future partners, the value is straightforward: a premium payment layer, one shared balance, and a product experience that feels coherent across brands."
      >
        <Card className="grid gap-6 p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-base text-white">
              {ecosystemItems.length} example products already frame the network. Future partners can extend the same balance model into new categories with a consistent UX standard.
            </p>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              Integration and settlement details are intentionally deferred in this v1, but the product language and partner call to action are ready.
            </p>
          </div>
          <a
            href="mailto:partners@unyt.shop"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/10 px-5 text-sm font-semibold text-white hover:bg-white/6"
          >
            Partner with UNYT
          </a>
        </Card>
      </Section>

      <ClosingCta />
    </>
  );
}
