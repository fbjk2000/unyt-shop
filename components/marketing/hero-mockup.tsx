import { BrandLogo } from "@/components/brand/BrandLogo";
import { SectionAccent } from "@/components/brand/SectionAccent";
import { Card, SubtleCard } from "@/components/ui/card";

export function HeroMockup() {
  return (
    <Card className="relative overflow-hidden p-4 sm:p-5">
      <SectionAccent variant="panel" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(79,124,255,0.2),_transparent_34%)]" />
      <div className="relative grid gap-4">
        <div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/10 bg-[#0c1428] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-[var(--muted)]">UNYT balance</p>
              <BrandLogo variant="mark" className="h-6 w-6 opacity-85" alt="" />
            </div>
            <p className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
              18,420.00
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">Available across every supported product</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <SubtleCard className="p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Pending</p>
                <p className="mt-2 text-lg font-semibold text-white">2,440</p>
              </SubtleCard>
              <SubtleCard className="p-3">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Spendable</p>
                <p className="mt-2 text-lg font-semibold text-white">15,980</p>
              </SubtleCard>
            </div>
          </div>
          <SubtleCard className="p-4">
            <p className="text-sm text-[var(--muted)]">Quick actions</p>
            <div className="mt-4 space-y-2">
              {["Add funds", "Pay with UNYTs", "Withdraw", "Swap"].map((action) => (
                <div
                  key={action}
                  className="flex min-h-11 items-center gap-3 rounded-[18px] border border-white/8 bg-white/5 px-4 text-sm text-white"
                >
                  <BrandLogo variant="mark" className="h-4 w-4 opacity-80" alt="" />
                  {action}
                </div>
              ))}
            </div>
          </SubtleCard>
        </div>
        <div className="grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
          <SubtleCard className="p-4">
            <p className="text-sm text-[var(--muted)]">Latest activity</p>
            <div className="mt-4 space-y-3">
              {[
                ["TechSelec annual tools plan", "-2,400 UNYTs", "Confirmed"],
                ["Card top-up", "+5,000 UNYTs", "Processing"],
                ["Unyted.Chat access", "-320 UNYTs", "Confirmed"],
              ].map(([label, amount, status]) => (
                <div key={label} className="rounded-[18px] border border-white/8 bg-black/12 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-white">{label}</p>
                      <p className="mt-1 text-xs text-[var(--muted)]">{status}</p>
                    </div>
                    <p className="text-sm font-medium text-white">{amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </SubtleCard>
          <SubtleCard className="p-4">
            <p className="text-sm text-[var(--muted)]">Where you can spend</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Fintery",
                "Alakai",
                "TechSelec",
                "Unyted.world",
                "Unyted.Chat",
                "Earnrm.com",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-[18px] border border-white/8 bg-white/5 px-4 py-4 text-sm text-white"
                >
                  <BrandLogo variant="mark" className="h-4 w-4 opacity-75" alt="" />
                  {item}
                </div>
              ))}
            </div>
          </SubtleCard>
        </div>
      </div>
    </Card>
  );
}
