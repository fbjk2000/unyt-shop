import { swapSnapshot } from "@/lib/content";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { Card, SubtleCard } from "@/components/ui/card";

export function SwapPanels() {
  return (
    <div className="grid gap-4 xl:grid-cols-[0.8fr_0.8fr_1fr]">
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <BrandLogo variant="mark" className="h-6 w-6 opacity-85" alt="" />
          <h2 className="text-xl font-semibold text-white">Popular pairs</h2>
        </div>
        <div className="mt-6 grid gap-3">
          {swapSnapshot.popularPairs.map((pair) => (
            <SubtleCard key={pair} className="flex items-center gap-3 p-4">
              <BrandLogo variant="mark" className="h-4 w-4 opacity-75" alt="" />
              <p className="text-sm text-white">{pair}</p>
            </SubtleCard>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <BrandLogo variant="mark" className="h-6 w-6 opacity-85" alt="" />
          <h2 className="text-xl font-semibold text-white">Recent activity</h2>
        </div>
        <div className="mt-6 grid gap-3">
          {swapSnapshot.recentActivity.map((item) => (
            <SubtleCard key={`${item.pair}-${item.amount}`} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white">{item.pair}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    {item.status}
                  </p>
                </div>
                <p className="text-sm font-medium text-white">{item.amount}</p>
              </div>
            </SubtleCard>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-3">
          <BrandLogo variant="mark" className="h-6 w-6 opacity-85" alt="" />
          <h2 className="text-xl font-semibold text-white">Safety and availability</h2>
        </div>
        <div className="mt-6 space-y-3">
          {swapSnapshot.safetyNotes.map((note) => (
            <SubtleCard key={note} className="flex items-start gap-3 p-4">
              <BrandLogo variant="mark" className="mt-0.5 h-4 w-4 shrink-0 opacity-75" alt="" />
              <p className="text-sm leading-6 text-white">{note}</p>
            </SubtleCard>
          ))}
        </div>
      </Card>
    </div>
  );
}
