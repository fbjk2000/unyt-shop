import { BrandMotif } from "@/components/brand/BrandMotif";
import { Button } from "@/components/ui/button";

export function PagePlaceholder({
  eyebrow,
  title,
  body,
  ctaHref = "/app/wallet",
  ctaLabel = "Open wallet",
}: {
  eyebrow: string;
  title: string;
  body: string;
  ctaHref?: string;
  ctaLabel?: string;
}) {
  return (
    <section className="shell py-20">
      <div className="card grid gap-8 overflow-hidden p-8 md:p-12 lg:grid-cols-[minmax(0,1.1fr)_320px]">
        <div className="space-y-5">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--muted)]">
            {eyebrow}
          </p>
          <h1 className="max-w-2xl text-4xl font-medium tracking-[-0.05em] text-white md:text-6xl">
            {title}
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--muted)] md:text-lg">{body}</p>
          <div className="flex flex-wrap gap-3">
            <Button href={ctaHref}>{ctaLabel}</Button>
            <Button href="/ecosystem" variant="secondary">
              Explore ecosystem
            </Button>
          </div>
        </div>
        <div className="subtle-card relative min-h-72 overflow-hidden p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,124,255,0.22),_transparent_35%)]" />
          <BrandMotif variant="emptyState" className="absolute right-4 top-4 h-28 w-28 opacity-70" />
          <div className="relative space-y-3">
            <div className="rounded-[24px] border border-white/10 bg-[#0f172a]/90 p-4">
              <p className="text-sm text-[var(--muted)]">Balance</p>
              <p className="mt-2 text-3xl font-semibold text-white">18,400 UNYTs</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-white/4 p-4">
              <p className="text-sm text-[var(--muted)]">Latest payment</p>
              <p className="mt-2 text-base text-white">TechSelec annual tools plan</p>
              <p className="mt-1 text-sm text-[var(--muted)]">2,400 UNYTs • Confirmed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
