import { walletSnapshot } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Card, SubtleCard } from "@/components/ui/card";

export function WalletBalanceCard() {
  return (
    <Card className="overflow-hidden p-6 sm:p-8">
      <div className="brand-pattern-overlay absolute inset-0 opacity-[0.08]" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <BrandLogo variant="mark" className="h-6 w-6 opacity-85" alt="" />
            <p className="text-sm text-[var(--muted)]">Total balance</p>
          </div>
          <p className="mt-3 text-4xl font-semibold tracking-[-0.06em] text-white sm:text-5xl">
            {walletSnapshot.totalBalance}
          </p>
          <p className="mt-3 text-sm text-[var(--muted)]">{walletSnapshot.fiatEquivalent}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <SubtleCard className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Available</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {walletSnapshot.availableBalance}
            </p>
          </SubtleCard>
          <SubtleCard className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Pending</p>
            <p className="mt-2 text-lg font-semibold text-white">{walletSnapshot.pendingBalance}</p>
          </SubtleCard>
        </div>
      </div>
    </Card>
  );
}
