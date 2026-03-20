import { walletSnapshot } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Card, SubtleCard } from "@/components/ui/card";

export function WalletQuickActions() {
  return (
    <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {walletSnapshot.quickActions.map((action) => (
        <Card key={action.label} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-lg font-semibold text-white">{action.label}</h2>
            <BrandLogo variant="mark" className="h-5 w-5 opacity-80" alt="" />
          </div>
          <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{action.detail}</p>
          <SubtleCard className="mt-5 flex min-h-11 items-center gap-3 px-4 text-sm text-white">
            <BrandLogo variant="mark" className="h-4 w-4 opacity-75" alt="" />
            Open
          </SubtleCard>
        </Card>
      ))}
    </section>
  );
}
