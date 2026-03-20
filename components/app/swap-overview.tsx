import { swapSnapshot } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { Card, SubtleCard } from "@/components/ui/card";

export function SwapOverview() {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className="p-6 sm:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <BrandLogo variant="mark" className="h-6 w-6 opacity-85" alt="" />
              <h2 className="text-xl font-semibold text-white">Swap form</h2>
            </div>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Clear pair selection and quote visibility before approval.
            </p>
          </div>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted)]">
            Supported
          </span>
        </div>
        <div className="mt-6 space-y-3">
          <SubtleCard className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">From</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <p className="text-2xl font-semibold text-white">{swapSnapshot.input}</p>
              <p className="text-sm text-[var(--muted)]">UNYTs</p>
            </div>
          </SubtleCard>
          <SubtleCard className="p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">To</p>
            <div className="mt-3 flex items-end justify-between gap-4">
              <p className="text-2xl font-semibold text-white">{swapSnapshot.output}</p>
              <p className="text-sm text-[var(--muted)]">USDC</p>
            </div>
          </SubtleCard>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <Button variant="accent">Review quote</Button>
          <Button variant="secondary">Choose another pair</Button>
        </div>
      </Card>
      <Card className="p-6 sm:p-7">
        <div className="flex items-center gap-3">
          <BrandLogo variant="mark" className="h-6 w-6 opacity-85" alt="" />
          <h2 className="text-xl font-semibold text-white">Quote details</h2>
        </div>
        <div className="mt-6 space-y-3">
          {[
            ["Pair", swapSnapshot.pair],
            ["Fee", swapSnapshot.fee],
            ["Route", swapSnapshot.route],
            ["Settlement", swapSnapshot.completion],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 rounded-[20px] border border-white/10 bg-white/4 px-4 py-4"
            >
              <p className="text-sm text-[var(--muted)]">{label}</p>
              <p className="text-sm font-medium text-white">{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
