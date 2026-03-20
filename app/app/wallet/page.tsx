import { buildMetadata } from "@/lib/metadata";
import { AppShell } from "@/components/layout/app-shell";
import { WalletBalanceCard } from "@/components/app/wallet-balance-card";
import { WalletQuickActions } from "@/components/app/wallet-quick-actions";
import { WalletDestinations } from "@/components/app/wallet-destinations";
import { WalletActivity } from "@/components/app/wallet-activity";
import { WalletSupport } from "@/components/app/wallet-support";

export const metadata = buildMetadata({
  title: "Wallet | UNYT.shop",
  description:
    "View balance, quick actions, supported spend destinations, and recent activity across the UNYT ecosystem.",
  path: "/app/wallet",
});

export default function WalletPage() {
  return (
    <AppShell
      title="Wallet"
      description="A single balance for every supported product, with clear actions and activity."
    >
      <WalletBalanceCard />
      <WalletQuickActions />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <WalletDestinations />
        <WalletActivity />
      </div>
      <WalletSupport />
    </AppShell>
  );
}
