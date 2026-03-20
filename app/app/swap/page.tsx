import { buildMetadata } from "@/lib/metadata";
import { AppShell } from "@/components/layout/app-shell";
import { SwapOverview } from "@/components/app/swap-overview";
import { SwapPanels } from "@/components/app/swap-panels";

export const metadata = buildMetadata({
  title: "Swap | UNYT.shop",
  description:
    "Review supported swap pairs, quote details, recent activity, and availability notes in a premium mobile-first flow.",
  path: "/app/swap",
});

export default function SwapPage() {
  return (
    <AppShell
      title="Swap"
      description="Precise quote presentation and a calm, mobile-first conversion flow."
    >
      <section className="rounded-[32px] border border-white/10 bg-white/4 p-5 sm:p-6">
        <p className="text-sm leading-6 text-[var(--muted)]">
          When users want to move into major supported digital assets, the swap experience should
          feel precise and transparent — with clear quotes, visible fees, and strong status
          feedback throughout.
        </p>
      </section>
      <SwapOverview />
      <SwapPanels />
    </AppShell>
  );
}
