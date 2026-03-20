import { buildMetadata } from "@/lib/metadata";
import { walletSnapshot } from "@/lib/content";
import { AppShell } from "@/components/layout/app-shell";
import { Card, SubtleCard } from "@/components/ui/card";

export const metadata = buildMetadata({
  title: "Activity | UNYT.shop",
  description:
    "Review recent balance activity, settlement states, and product-level transaction visibility.",
  path: "/app/activity",
});

export default function ActivityPage() {
  return (
    <AppShell
      title="Activity"
      description="A placeholder activity surface for transaction visibility across supported use cases."
    >
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-white">Recent wallet and payment activity</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)]">
          A clear activity surface helps users understand what completed, what is pending,
          and where a balance change came from.
        </p>
        <div className="mt-6 space-y-3">
          {walletSnapshot.activity.map((item) => (
            <SubtleCard key={item.title} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--muted)]">
                    {item.status}
                  </p>
                </div>
                <p className="text-sm text-white">{item.amount}</p>
              </div>
            </SubtleCard>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}
