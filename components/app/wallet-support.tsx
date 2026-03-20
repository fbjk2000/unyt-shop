import { walletSnapshot } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Card, SubtleCard } from "@/components/ui/card";

export function WalletSupport() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <BrandLogo variant="mark" className="h-6 w-6 opacity-85" alt="" />
          <h2 className="text-xl font-semibold text-white">Payment methods</h2>
        </div>
        <div className="mt-6 space-y-3">
          {walletSnapshot.paymentMethods.map((item) => (
            <SubtleCard key={item} className="flex items-center gap-3 p-4">
              <BrandLogo variant="mark" className="h-4 w-4 opacity-75" alt="" />
              <p className="text-sm text-white">{item}</p>
            </SubtleCard>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <BrandLogo variant="mark" className="h-6 w-6 opacity-85" alt="" />
          <h2 className="text-xl font-semibold text-white">Support</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
          Questions about settlement, availability, or account access should have a calm,
          direct support path from inside the wallet.
        </p>
        <SubtleCard className="mt-6 p-4">
          <p className="text-sm text-white">Average response window</p>
          <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
            Under 1 business day
          </p>
        </SubtleCard>
      </Card>
    </div>
  );
}
